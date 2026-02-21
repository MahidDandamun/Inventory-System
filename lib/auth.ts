// lib/auth.ts
// ---
// Cached auth helper — use this in Server Components and DAL
// Wraps the session lookup in React.cache() so multiple components
// in the same request share a single DB call
// ---

import { cache } from "react"
import { auth } from "@/auth"

/**
 * Get the current authenticated user for the request.
 * Cached per-request via React.cache() — safe to call multiple times.
 *
 * @returns The session user or null if not authenticated
 */
export const getCurrentUser = cache(async () => {
    const session = await auth()
    return session?.user ?? null
})
