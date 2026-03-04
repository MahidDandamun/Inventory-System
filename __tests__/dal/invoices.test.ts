import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createInvoice, updateInvoice, deleteInvoice } from '@/lib/dal/invoices'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/dal/guards'
import { createSystemLog } from '@/lib/dal/system-logs'
import { Decimal } from '@prisma/client/runtime/library'

vi.mock('server-only', () => ({ default: {} }))

vi.mock('@/lib/prisma', () => ({
    prisma: {
        invoice: {
            create: vi.fn(),
            update: vi.fn(),
            findUnique: vi.fn(),
            findMany: vi.fn(),
            delete: vi.fn(),
        },
        order: {
            findUnique: vi.fn(),
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

vi.mock('@/lib/document-number', () => ({
    generateDocumentNumber: vi.fn().mockReturnValue('INV-123-ABCD1234'),
    createWithUniqueRetry: vi.fn(async (fn: () => Promise<unknown>) => fn()),
}))

const mockUser = { id: 'user-1', name: 'Test User' }

function mockOrder(id: string, total: number) {
    return { id, total: new Decimal(total), orderNo: 'ORD-123', customerName: 'John' }
}

function mockInvoice(overrides?: Partial<Record<string, unknown>>) {
    return {
        id: 'inv-1',
        invoiceNo: 'INV-123-ABCD1234',
        orderId: 'ord-1',
        total: new Decimal(500),
        status: 'ISSUED',
        dueDate: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        order: { orderNo: 'ORD-123', customerName: 'John', customerRef: null },
        payments: [],
        ...overrides,
    }
}

describe('DAL: Invoices', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireCurrentUser).mockResolvedValue(mockUser as never)
    })

    describe('createInvoice', () => {
        it('throws if order not found', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(null)

            await expect(createInvoice({ orderId: 'ord-missing' }))
                .rejects.toThrow('Order not found')
        })

        it('creates invoice with default DRAFT status', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', 500) as never
            )
            vi.mocked(prisma.invoice.create).mockResolvedValue(
                mockInvoice({ status: 'DRAFT' }) as never
            )

            const result = await createInvoice({ orderId: 'ord-1' })

            expect(result.status).toBe('DRAFT')
            expect(prisma.invoice.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    orderId: 'ord-1',
                    total: new Decimal(500),
                    status: 'DRAFT',
                    dueDate: null,
                    createdById: 'user-1',
                }),
                include: expect.any(Object),
            })
        })

        it('logs system event after creation', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', 100) as never
            )
            vi.mocked(prisma.invoice.create).mockResolvedValue(mockInvoice() as never)

            await createInvoice({ orderId: 'ord-1' })

            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'CREATE', 'INVOICE', 'inv-1', expect.any(String)
            )
        })
    })

    describe('updateInvoice', () => {
        it('updates dueDate and auto-derives overdue status when due date is in the past', async () => {
            vi.mocked(prisma.invoice.findUnique).mockResolvedValue(
                mockInvoice({ status: 'ISSUED', dueDate: null, payments: [] }) as never
            )
            vi.mocked(prisma.invoice.update).mockResolvedValue(
                mockInvoice({ status: 'OVERDUE', dueDate: new Date('2025-01-01T00:00:00.000Z') }) as never
            )

            await updateInvoice('inv-1', { dueDate: new Date('2025-01-01T00:00:00.000Z') })

            expect(prisma.invoice.update).toHaveBeenCalledWith({
                where: { id: 'inv-1' },
                data: {
                    dueDate: new Date('2025-01-01T00:00:00.000Z'),
                    status: 'OVERDUE',
                },
                include: expect.any(Object),
            })
        })

        it('rejects invalid status transitions', async () => {
            vi.mocked(prisma.invoice.findUnique).mockResolvedValue(
                mockInvoice({ status: 'PAID', payments: [{ amount: new Decimal(500) }] }) as never
            )

            await expect(updateInvoice('inv-1', { status: 'DRAFT' as never }))
                .rejects.toThrow('Invalid status transition: PAID -> DRAFT')
        })

        it('logs system event after update', async () => {
            vi.mocked(prisma.invoice.findUnique).mockResolvedValue(mockInvoice() as never)
            vi.mocked(prisma.invoice.update).mockResolvedValue(mockInvoice() as never)

            await updateInvoice('inv-1', { status: 'ISSUED' })

            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'UPDATE', 'INVOICE', 'inv-1', expect.any(String)
            )
        })
    })

    describe('deleteInvoice', () => {
        it('deletes invoice and logs system event', async () => {
            vi.mocked(prisma.invoice.delete).mockResolvedValue(mockInvoice() as never)

            await deleteInvoice('inv-1')

            expect(prisma.invoice.delete).toHaveBeenCalledWith({
                where: { id: 'inv-1' },
                include: expect.any(Object),
            })
            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'DELETE', 'INVOICE', 'inv-1'
            )
        })
    })
})
