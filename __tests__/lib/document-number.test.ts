import { describe, it, expect, vi } from 'vitest'
import { generateDocumentNumber, createWithUniqueRetry } from '@/lib/document-number'
import { Prisma } from '@prisma/client'

describe('document-number', () => {
    describe('generateDocumentNumber', () => {
        it('should generate a string with correct prefix and format', () => {
            const ordNumber = generateDocumentNumber('ORD')
            expect(ordNumber).toMatch(/^ORD-\d+-[A-Z0-9]{8,10}$/)

            const invNumber = generateDocumentNumber('INV')
            expect(invNumber).toMatch(/^INV-\d+-[A-Z0-9]{8,10}$/)
        })

        it('should generate unique numbers', () => {
            const n1 = generateDocumentNumber('ORD')
            const n2 = generateDocumentNumber('ORD')
            expect(n1).not.toBe(n2)
        })
    })

    describe('createWithUniqueRetry', () => {
        it('should return result if fn succeeds on first try', async () => {
            const createFn = vi.fn().mockResolvedValue('success')
            const result = await createWithUniqueRetry(createFn)
            expect(result).toBe('success')
            expect(createFn).toHaveBeenCalledTimes(1)
        })

        it('should retry if Prisma P2002 error is thrown', async () => {
            const p2002Error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                code: 'P2002',
                clientVersion: '6.0.0'
            })

            const createFn = vi.fn()
                .mockRejectedValueOnce(p2002Error)
                .mockResolvedValueOnce('success')

            const result = await createWithUniqueRetry(createFn)
            expect(result).toBe('success')
            expect(createFn).toHaveBeenCalledTimes(2)
        })

        it('should throw immediately for non-P2002 errors', async () => {
            const otherError = new Error('Database down')
            const createFn = vi.fn().mockRejectedValue(otherError)

            await expect(createWithUniqueRetry(createFn)).rejects.toThrow('Database down')
            expect(createFn).toHaveBeenCalledTimes(1)
        })

        it('should throw if max attempts reached', async () => {
            const p2002Error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                code: 'P2002',
                clientVersion: '6.0.0'
            })
            const createFn = vi.fn().mockRejectedValue(p2002Error)

            await expect(createWithUniqueRetry(createFn, 3)).rejects.toThrow('Failed to generate a unique document number after multiple attempts')
            expect(createFn).toHaveBeenCalledTimes(3)
        })
    })
})
