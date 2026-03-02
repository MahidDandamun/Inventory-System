import { describe, it, expect } from 'vitest'
import { canTransitionOrderStatus, getAllowedOrderStatuses } from '@/lib/order-status'

describe('order-status', () => {
    describe('canTransitionOrderStatus', () => {
        it('should allow transition to same status', () => {
            expect(canTransitionOrderStatus('PENDING', 'PENDING')).toBe(true)
            expect(canTransitionOrderStatus('SHIPPED', 'SHIPPED')).toBe(true)
        })

        it('should allow valid transitions for PENDING', () => {
            expect(canTransitionOrderStatus('PENDING', 'PROCESSING')).toBe(true)
            expect(canTransitionOrderStatus('PENDING', 'CANCELLED')).toBe(true)
            expect(canTransitionOrderStatus('PENDING', 'SHIPPED')).toBe(false)
            expect(canTransitionOrderStatus('PENDING', 'DELIVERED')).toBe(false)
        })

        it('should allow valid transitions for PROCESSING', () => {
            expect(canTransitionOrderStatus('PROCESSING', 'SHIPPED')).toBe(true)
            expect(canTransitionOrderStatus('PROCESSING', 'CANCELLED')).toBe(true)
            expect(canTransitionOrderStatus('PROCESSING', 'PENDING')).toBe(false)
            expect(canTransitionOrderStatus('PROCESSING', 'DELIVERED')).toBe(false)
        })

        it('should allow valid transitions for SHIPPED', () => {
            expect(canTransitionOrderStatus('SHIPPED', 'DELIVERED')).toBe(true)
            expect(canTransitionOrderStatus('SHIPPED', 'PENDING')).toBe(false)
            expect(canTransitionOrderStatus('SHIPPED', 'CANCELLED')).toBe(false)
        })

        it('should not allow transitions from terminal statuses', () => {
            expect(canTransitionOrderStatus('DELIVERED', 'PENDING')).toBe(false)
            expect(canTransitionOrderStatus('CANCELLED', 'PROCESSING')).toBe(false)
        })
    })

    describe('getAllowedOrderStatuses', () => {
        it('should return current status plus allowed next statuses', () => {
            expect(getAllowedOrderStatuses('PENDING')).toEqual(['PENDING', 'PROCESSING', 'CANCELLED'])
            expect(getAllowedOrderStatuses('DELIVERED')).toEqual(['DELIVERED'])
        })
    })
})
