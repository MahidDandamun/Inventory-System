import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProduct, updateProduct, deleteProduct } from '@/lib/dal/products'
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
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findUnique: vi.fn(),
        },
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

const baseProductData = {
    name: 'Widget',
    sku: 'WDG-001',
    description: 'A fine widget',
    price: 29.99,
    quantity: 50,
    warehouseId: 'wh-1',
}

// ── Tests ──

describe('DAL: Products', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireCurrentUser).mockResolvedValue(mockUser as never)
    })

    // ─── createProduct ───

    describe('createProduct', () => {
        it('creates product and logs system event', async () => {
            vi.mocked(prisma.product.create).mockResolvedValue({
                id: 'prod-1',
                ...baseProductData,
            } as never)

            const result = await createProduct(baseProductData)

            expect(result.id).toBe('prod-1')
            expect(prisma.product.create).toHaveBeenCalledWith({
                data: {
                    name: 'Widget',
                    sku: 'WDG-001',
                    description: 'A fine widget',
                    price: 29.99,
                    quantity: 50,
                    warehouseId: 'wh-1',
                    createdById: 'user-1',
                },
            })
            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'CREATE', 'PRODUCT', 'prod-1', expect.any(String)
            )
        })

        it('records stock movement when initial quantity > 0', async () => {
            vi.mocked(prisma.product.create).mockResolvedValue({
                id: 'prod-1',
                ...baseProductData,
            } as never)

            await createProduct(baseProductData)

            expect(recordStockMovement).toHaveBeenCalledWith({
                entity: 'PRODUCT',
                entityId: 'prod-1',
                type: 'IN',
                quantity: 50,
                reason: 'Initial stock on creation',
                userId: 'user-1',
            })
            expect(checkLowStock).toHaveBeenCalledOnce()
        })

        it('does NOT record stock movement when quantity is 0', async () => {
            vi.mocked(prisma.product.create).mockResolvedValue({
                id: 'prod-2',
            } as never)

            await createProduct({ ...baseProductData, quantity: 0 })

            expect(recordStockMovement).not.toHaveBeenCalled()
        })
    })

    // ─── updateProduct ───

    describe('updateProduct', () => {
        it('records IN stock movement when quantity increases', async () => {
            vi.mocked(prisma.product.findUnique).mockResolvedValue({
                id: 'prod-1',
                quantity: 50,
                price: new Decimal(29.99),
            } as never)
            vi.mocked(prisma.product.update).mockResolvedValue({ id: 'prod-1' } as never)

            await updateProduct('prod-1', { quantity: 80 })

            expect(recordStockMovement).toHaveBeenCalledWith({
                entity: 'PRODUCT',
                entityId: 'prod-1',
                type: 'IN',
                quantity: 30, // 80 - 50
                reason: 'Manual adjustment via update',
                userId: 'user-1',
            })
            expect(checkLowStock).toHaveBeenCalledOnce()
        })

        it('records OUT stock movement when quantity decreases', async () => {
            vi.mocked(prisma.product.findUnique).mockResolvedValue({
                id: 'prod-1',
                quantity: 50,
                price: new Decimal(29.99),
            } as never)
            vi.mocked(prisma.product.update).mockResolvedValue({ id: 'prod-1' } as never)

            await updateProduct('prod-1', { quantity: 20 })

            expect(recordStockMovement).toHaveBeenCalledWith({
                entity: 'PRODUCT',
                entityId: 'prod-1',
                type: 'OUT',
                quantity: 30, // |20 - 50|
                reason: 'Manual adjustment via update',
                userId: 'user-1',
            })
        })

        it('does NOT record stock movement when quantity unchanged', async () => {
            vi.mocked(prisma.product.findUnique).mockResolvedValue({
                id: 'prod-1',
                quantity: 50,
            } as never)
            vi.mocked(prisma.product.update).mockResolvedValue({ id: 'prod-1' } as never)

            await updateProduct('prod-1', { name: 'Updated Name' })

            expect(recordStockMovement).not.toHaveBeenCalled()
            expect(checkLowStock).not.toHaveBeenCalled()
        })

        it('logs system event on update', async () => {
            vi.mocked(prisma.product.findUnique).mockResolvedValue({
                id: 'prod-1',
                quantity: 50,
            } as never)
            vi.mocked(prisma.product.update).mockResolvedValue({ id: 'prod-1' } as never)

            await updateProduct('prod-1', { name: 'New Name' })

            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'UPDATE', 'PRODUCT', 'prod-1', expect.any(String)
            )
        })
    })

    // ─── deleteProduct ───

    describe('deleteProduct', () => {
        it('deletes product and logs system event', async () => {
            vi.mocked(prisma.product.delete).mockResolvedValue({ id: 'prod-1' } as never)

            await deleteProduct('prod-1')

            expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'prod-1' } })
            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'DELETE', 'PRODUCT', 'prod-1'
            )
        })
    })
})
