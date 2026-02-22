// routes.ts
// ---
// Centralized route definitions
// Used by middleware.ts for access control
// ---

/** Routes accessible without authentication */
export const publicRoutes = ["/", "/verify"]

/** Auth-related routes — logged-in users get redirected away */
export const authRoutes = ["/login", "/register", "/reset", "/new-password"]

/** Prefix for NextAuth API routes — always allowed */
export const apiAuthPrefix = "/api/auth"

/** Where to redirect after successful login */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

/** Routes only accessible by ADMIN role */
export const adminRoutes = ["/users"]
