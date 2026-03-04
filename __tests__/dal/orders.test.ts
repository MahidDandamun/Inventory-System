import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createOrder, updateOrderStatus, deleteOrder } from '@/lib/dal/orders'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/dal/guards'
import { recordStockMovement } from '@/lib/dal/stock-movements'
import { checkLowStock } from '@/lib/dal/notifications'
import { createSystemLog } from '@/lib/dal/system-logs'
import { Decimal } from '@prisma/client/runtime/library'

// ── Mocks ──

vi.mock('server-only', () => ({ default: {} }))

vi.mock('@/lib/prisma', () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
            update: vi.fn(),
            findUnique: vi.fn(),
        },
        order: {
            create: vi.fn(),
            update: vi.fn(),
            findUnique: vi.fn(),
            delete: vi.fn(),
        },
        $transaction: vi.fn(),
    }
}))

vi.mock('@/lib/dal/guards', () => ({
    requireCurrentUser: vi.fn(),
}))

vi.mock('@/lib/dal/system-logs', () => ({
    createSystemLog: vi.fn(),
}))

vi.mock('@/lib/dal/stock-movements', () => ({
    recordStockMovement: vi.fn(),
}))

vi.mock('@/lib/dal/notifications', () => ({
    checkLowStock: vi.fn(),
}))

// ── Helpers ──

const mockUser = { id: 'user-1', name: 'Test User' }

function mockProduct(id: string, name: string, price: number, quantity: number) {
    return { id, name, price: new Decimal(price), quantity }
}

function mockOrder(id: string, overrides = {}) {
    return {
        id,
        orderNo: 'ORD-123-ABCD1234',
        customerName: 'John Doe',
        customerId: null,
        status: 'PENDING' as const,
        total: new Decimal(100),
        items: [],
        ...overrides,
    }
}

function mockOrderDetail(id: string, overrides = {}) {
    return {
        id,
        orderNo: 'ORD-123-ABCD1234',
        customerName: 'John Doe',
        customerId: null,
        status: 'PENDING' as const,
        total: new Decimal(100),
        notes: null,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        confirmedAt: null,
        shippedAt: null,
        deliveredAt: null,
        cancelledAt: null,
        _count: { items: 0 },
        items: [],
        ...overrides,
    }
}

// ── Tests ──

describe('DAL: Orders', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireCurrentUser).mockResolvedValue(mockUser as never)
        vi.mocked(prisma.$transaction).mockImplementation(async (callback: unknown) => {
            return (callback as (tx: unknown) => Promise<unknown>)(prisma)
        })
    })

    // ─── createOrder ───

    describe('createOrder', () => {
        it('throws if product not found', async () => {
            vi.mocked(prisma.product.findMany).mockResolvedValue([])

            await expect(createOrder({
                customerName: 'John Doe',
                items: [{ productId: 'prod-1', quantity: 2, unitPrice: 10 }]
            })).rejects.toThrow('One or more selected products were not found')
        })

        it('throws if insufficient stock', async () => {
            vi.mocked(prisma.product.findMany).mockResolvedValue([
                mockProduct('prod-1', 'Widget', 10, 1) as never,
            ])

            await expect(createOrder({
                customerName: 'John Doe',
                items: [{ productId: 'prod-1', quantity: 5, unitPrice: 10 }]
            })).rejects.toThrow('Insufficient stock for Widget')
        })

        it('creates order within a transaction and records stock movement', async () => {
            vi.mocked(prisma.product.findMany).mockResolvedValue([
                mockProduct('prod-1', 'Widget', 25, 100) as never,
            ])
            vi.mocked(prisma.order.create).mockResolvedValue(mockOrderDetail('order-1') as never)
            vi.mocked(prisma.product.update).mockResolvedValue({} as never)

            const result = await createOrder({
                customerName: 'Jane',
                items: [{ productId: 'prod-1', quantity: 3, unitPrice: 25 }]
            })

            expect(result.id).toBe('order-1')
            expect(prisma.$transaction).toHaveBeenCalledOnce()
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'prod-1' },
                data: { quantity: { decrement: 3 } },
            })
            expect(recordStockMovement).toHaveBeenCalledWith(
                expect.objectContaining({
                    entity: 'PRODUCT',
                    entityId: 'prod-1',
                    type: 'OUT',
                    quantity: 3,
                }),
                prisma, // tx reference
            )
        })

        it('calls checkLowStock and createSystemLog after creation', async () => {
            vi.mocked(prisma.product.findMany).mockResolvedValue([
                mockProduct('prod-1', 'Widget', 10, 100) as never,
            ])
            vi.mocked(prisma.order.create).mockResolvedValue(mockOrderDetail('order-1') as never)
            vi.mocked(prisma.product.update).mockResolvedValue({} as never)

            await createOrder({
                customerName: 'Jane',
                items: [{ productId: 'prod-1', quantity: 1, unitPrice: 10 }]
            })

            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'CREATE', 'ORDER', 'order-1', expect.any(String)
            )
            expect(checkLowStock).toHaveBeenCalledOnce()
        })
    })

    // ─── updateOrderStatus ───

    describe('updateOrderStatus', () => {
        it('throws if order not found', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(null)

            await expect(updateOrderStatus('ord-1', 'PROCESSING'))
                .rejects.toThrow('Order not found')
        })

        it('throws on invalid status transition', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', { status: 'DELIVERED' }) as never
            )

            await expect(updateOrderStatus('ord-1', 'PENDING'))
                .rejects.toThrow('Invalid status transition: DELIVERED -> PENDING')
        })

        it('allows valid transition (PENDING → PROCESSING)', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', { status: 'PENDING' }) as never
            )
            vi.mocked(prisma.order.update).mockResolvedValue(
                mockOrder('ord-1', { status: 'PROCESSING' }) as never
            )

            const result = await updateOrderStatus('ord-1', 'PROCESSING')

            expect(result.status).toBe('PROCESSING')
            expect(prisma.$transaction).toHaveBeenCalledOnce()
        })

        it('restores stock on cancellation', async () => {
            const items = [
                { id: 'item-1', productId: 'prod-1', quantity: 5, unitPrice: new Decimal(10) },
                { id: 'item-2', productId: 'prod-2', quantity: 3, unitPrice: new Decimal(20) },
            ]
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', { status: 'PENDING', items }) as never
            )
            vi.mocked(prisma.order.update).mockResolvedValue(
                mockOrder('ord-1', { status: 'CANCELLED' }) as never
            )
            vi.mocked(prisma.product.update).mockResolvedValue({} as never)

            await updateOrderStatus('ord-1', 'CANCELLED')

            // Stock restored for both items
            expect(prisma.product.update).toHaveBeenCalledTimes(2)
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'prod-1' },
                data: { quantity: { increment: 5 } },
            })
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'prod-2' },
                data: { quantity: { increment: 3 } },
            })
            expect(recordStockMovement).toHaveBeenCalledTimes(2)
            expect(checkLowStock).toHaveBeenCalledOnce()
        })

        it('does NOT restore stock on non-cancellation transition', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', { status: 'PENDING' }) as never
            )
            vi.mocked(prisma.order.update).mockResolvedValue(
                mockOrder('ord-1', { status: 'PROCESSING' }) as never
            )

            await updateOrderStatus('ord-1', 'PROCESSING')

            expect(prisma.product.update).not.toHaveBeenCalled()
            expect(recordStockMovement).not.toHaveBeenCalled()
            expect(checkLowStock).not.toHaveBeenCalled()
        })
    })

    // ─── deleteOrder ───

    describe('deleteOrder', () => {
        it('throws if order not found', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(null)

            await expect(deleteOrder('ord-1')).rejects.toThrow('Order not found')
        })

        it('restores stock for non-cancelled order', async () => {
            const items = [
                { id: 'item-1', productId: 'prod-1', quantity: 10, unitPrice: new Decimal(5) },
            ]
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', { status: 'PENDING', items, orderNo: 'ORD-TEST' }) as never
            )
            vi.mocked(prisma.product.update).mockResolvedValue({} as never)
            vi.mocked(prisma.order.delete).mockResolvedValue(mockOrderDetail('ord-1') as never)

            await deleteOrder('ord-1')

            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'prod-1' },
                data: { quantity: { increment: 10 } },
            })
            expect(recordStockMovement).toHaveBeenCalledWith(
                expect.objectContaining({
                    entity: 'PRODUCT',
                    entityId: 'prod-1',
                    type: 'IN',
                    quantity: 10,
                    reason: 'Order ORD-TEST deleted',
                }),
                prisma,
            )
        })

        it('skips stock restore for already-cancelled order', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', { status: 'CANCELLED' }) as never
            )
            vi.mocked(prisma.order.delete).mockResolvedValue(
                mockOrderDetail('ord-1', { status: 'CANCELLED' }) as never
            )

            await deleteOrder('ord-1')

            expect(prisma.product.update).not.toHaveBeenCalled()
            expect(recordStockMovement).not.toHaveBeenCalled()
        })
    })
})
