import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createInvoice, updateInvoice, deleteInvoice } from '@/lib/dal/invoices'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/dal/guards'
import { createSystemLog } from '@/lib/dal/system-logs'
import { Decimal } from '@prisma/client/runtime/library'

// ── Mocks ──

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

// ── Helpers ──

const mockUser = { id: 'user-1', name: 'Test User' }

function mockOrder(id: string, total: number) {
    return { id, total: new Decimal(total), orderNo: 'ORD-123', customer: 'John' }
}

// ── Tests ──

describe('DAL: Invoices', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(requireCurrentUser).mockResolvedValue(mockUser as never)
    })

    // ─── createInvoice ───

    describe('createInvoice', () => {
        it('throws if order not found', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(null)

            await expect(createInvoice({ orderId: 'ord-missing' }))
                .rejects.toThrow('Order not found')
        })

        it('creates invoice without marking as paid', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', 500) as never
            )
            vi.mocked(prisma.invoice.create).mockResolvedValue({
                id: 'inv-1',
                paidAt: null,
            } as never)

            const result = await createInvoice({ orderId: 'ord-1' })

            expect(result.paidAt).toBeNull()
            expect(prisma.invoice.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    orderId: 'ord-1',
                    total: new Decimal(500),
                    paidAt: null,
                    createdById: 'user-1',
                }),
            })
        })

        it('creates invoice with markAsPaid: true and sets paidAt', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', 250) as never
            )
            vi.mocked(prisma.invoice.create).mockResolvedValue({
                id: 'inv-1',
                paidAt: new Date(),
            } as never)

            const result = await createInvoice({ orderId: 'ord-1', markAsPaid: true })

            expect(result.paidAt).not.toBeNull()
            // paidAt should be a Date, not null
            expect(prisma.invoice.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    paidAt: expect.any(Date),
                }),
            })
        })

        it('logs system event after creation', async () => {
            vi.mocked(prisma.order.findUnique).mockResolvedValue(
                mockOrder('ord-1', 100) as never
            )
            vi.mocked(prisma.invoice.create).mockResolvedValue({ id: 'inv-1' } as never)

            await createInvoice({ orderId: 'ord-1' })

            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'CREATE', 'INVOICE', 'inv-1', expect.any(String)
            )
        })
    })

    // ─── updateInvoice ───

    describe('updateInvoice', () => {
        it('marks as paid — sets paidAt to a Date', async () => {
            vi.mocked(prisma.invoice.update).mockResolvedValue({
                id: 'inv-1',
                paidAt: new Date(),
            } as never)

            await updateInvoice('inv-1', { markAsPaid: true })

            expect(prisma.invoice.update).toHaveBeenCalledWith({
                where: { id: 'inv-1' },
                data: { paidAt: expect.any(Date) },
            })
        })

        it('marks as unpaid — sets paidAt to null', async () => {
            vi.mocked(prisma.invoice.update).mockResolvedValue({
                id: 'inv-1',
                paidAt: null,
            } as never)

            await updateInvoice('inv-1', { markAsPaid: false })

            expect(prisma.invoice.update).toHaveBeenCalledWith({
                where: { id: 'inv-1' },
                data: { paidAt: null },
            })
        })

        it('logs system event after update', async () => {
            vi.mocked(prisma.invoice.update).mockResolvedValue({ id: 'inv-1' } as never)

            await updateInvoice('inv-1', { markAsPaid: true })

            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'UPDATE', 'INVOICE', 'inv-1', expect.any(String)
            )
        })
    })

    // ─── deleteInvoice ───

    describe('deleteInvoice', () => {
        it('deletes invoice and logs system event', async () => {
            vi.mocked(prisma.invoice.delete).mockResolvedValue({ id: 'inv-1' } as never)

            await deleteInvoice('inv-1')

            expect(prisma.invoice.delete).toHaveBeenCalledWith({ where: { id: 'inv-1' } })
            expect(createSystemLog).toHaveBeenCalledWith(
                'user-1', 'DELETE', 'INVOICE', 'inv-1'
            )
        })
    })
})
