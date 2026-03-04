import { describe, it, expect } from 'vitest'
import {
    canTransitionInvoiceStatus,
    deriveInvoiceStatusFromPayments,
    getAllowedInvoiceStatuses,
} from '@/lib/invoice-status'

describe('invoice-status', () => {
    describe('canTransitionInvoiceStatus', () => {
        it('allows transition to same status', () => {
            expect(canTransitionInvoiceStatus('ISSUED', 'ISSUED')).toBe(true)
            expect(canTransitionInvoiceStatus('PAID', 'PAID')).toBe(true)
        })

        it('enforces transition map', () => {
            expect(canTransitionInvoiceStatus('DRAFT', 'ISSUED')).toBe(true)
            expect(canTransitionInvoiceStatus('DRAFT', 'PAID')).toBe(false)
            expect(canTransitionInvoiceStatus('PAID', 'OVERDUE')).toBe(false)
        })
    })

    describe('getAllowedInvoiceStatuses', () => {
        it('returns current plus valid next statuses', () => {
            expect(getAllowedInvoiceStatuses('ISSUED')).toEqual([
                'ISSUED',
                'PARTIALLY_PAID',
                'PAID',
                'OVERDUE',
                'VOID',
            ])
        })
    })

    describe('deriveInvoiceStatusFromPayments', () => {
        it('derives PAID when paid amount reaches total', () => {
            expect(deriveInvoiceStatusFromPayments({
                currentStatus: 'ISSUED',
                totalAmount: 100,
                paidAmount: 100,
                dueDate: null,
            })).toBe('PAID')
        })

        it('derives PARTIALLY_PAID when some amount is paid', () => {
            expect(deriveInvoiceStatusFromPayments({
                currentStatus: 'ISSUED',
                totalAmount: 100,
                paidAmount: 30,
                dueDate: null,
            })).toBe('PARTIALLY_PAID')
        })

        it('derives OVERDUE when due date has passed and no payment exists', () => {
            expect(deriveInvoiceStatusFromPayments({
                currentStatus: 'ISSUED',
                totalAmount: 100,
                paidAmount: 0,
                dueDate: new Date('2025-01-01T00:00:00.000Z'),
                asOf: new Date('2025-01-02T00:00:00.000Z'),
            })).toBe('OVERDUE')
        })
    })
})
