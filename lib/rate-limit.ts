import "server-only"

type RateLimitEntry = {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * A simple in-memory rate limiter. Perfect for single-instance Next.js deployments.
 * 
 * @param identifier The unique key to rate limit by (e.g., IP address or email)
 * @param limit The maximum number of requests allowed within the window
 * @param windowMs The time window in milliseconds
 * @returns { success: boolean, remaining: number, resetTime: number }
 */
export async function rateLimit(identifier: string, limit: number, windowMs: number) {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    // Clean up expired entries whenever we check
    if (entry && now > entry.resetTime) {
        rateLimitStore.delete(identifier)
    }

    const currentEntry = rateLimitStore.get(identifier)

    if (!currentEntry) {
        // First request for this identifier
        const resetTime = now + windowMs
        rateLimitStore.set(identifier, { count: 1, resetTime })
        return { success: true, remaining: limit - 1, resetTime }
    }

    if (currentEntry.count >= limit) {
        // Rate limit exceeded
        return { success: false, remaining: 0, resetTime: currentEntry.resetTime }
    }

    // Increment request count
    currentEntry.count += 1
    return { success: true, remaining: limit - currentEntry.count, resetTime: currentEntry.resetTime }
}
