import { describe, it, expect, vi, beforeEach } from 'vitest'
import { recordStockMovement } from '@/lib/dal/stock-movements'

// ── Mocks ──

vi.mock('server-only', () => ({ default: {} }))

// Use a typed mock object we control directly, avoiding Prisma type conflicts
const mockCreate = vi.fn()

vi.mock('@/lib/prisma', () => ({
    prisma: {
        stockMovement: {
            create: (...args: unknown[]) => mockCreate(...args),
            findMany: vi.fn(),
        },
    },
}))

vi.mock('@/lib/dal/guards', () => ({
    requireCurrentUser: vi.fn().mockResolvedValue({ id: 'user-1', name: 'Test' }),
}))

// ── Tests ──

describe('DAL: Stock Movements', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('recordStockMovement', () => {
        const movementData = {
            entity: 'PRODUCT' as const,
            entityId: 'prod-1',
            type: 'OUT' as const,
            quantity: 5,
            reason: 'Order created',
            userId: 'user-1',
        }

        it('uses default prisma client when no tx provided', async () => {
            mockCreate.mockResolvedValue({ id: 'mv-1' })

            await recordStockMovement(movementData)

            expect(mockCreate).toHaveBeenCalledWith({
                data: {
                    entity: 'PRODUCT',
                    entityId: 'prod-1',
                    type: 'OUT',
                    quantity: 5,
                    reason: 'Order created',
                    userId: 'user-1',
                },
            })
        })

        it('uses transaction client when tx is provided', async () => {
            const mockTx = {
                stockMovement: {
                    create: vi.fn().mockResolvedValue({ id: 'mv-2' }),
                },
            }

            await recordStockMovement(movementData, mockTx as never)

            expect(mockTx.stockMovement.create).toHaveBeenCalledWith({
                data: {
                    entity: 'PRODUCT',
                    entityId: 'prod-1',
                    type: 'OUT',
                    quantity: 5,
                    reason: 'Order created',
                    userId: 'user-1',
                },
            })
            // Default prisma should NOT be called
            expect(mockCreate).not.toHaveBeenCalled()
        })

        it('handles RAW_MATERIAL entity type', async () => {
            mockCreate.mockResolvedValue({ id: 'mv-3' })

            await recordStockMovement({
                entity: 'RAW_MATERIAL',
                entityId: 'rm-1',
                type: 'IN',
                quantity: 100,
                reason: 'Restock delivery',
            })

            expect(mockCreate).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    entity: 'RAW_MATERIAL',
                    entityId: 'rm-1',
                    type: 'IN',
                    quantity: 100,
                }),
            })
        })

        it('allows omitting userId', async () => {
            mockCreate.mockResolvedValue({ id: 'mv-4' })

            await recordStockMovement({
                entity: 'PRODUCT',
                entityId: 'prod-1',
                type: 'ADJUST',
                quantity: 10,
                reason: 'Inventory audit',
            })

            expect(mockCreate).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    userId: undefined,
                }),
            })
        })
    })
})
