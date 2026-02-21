// middleware.ts
// ---
// Route protection middleware
// Runs on the Edge Runtime — no Prisma here, only auth.config
// ---

import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import {
    publicRoutes,
    authRoutes,
    apiAuthPrefix,
    DEFAULT_LOGIN_REDIRECT,
} from "@/routes"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    // Allow all API auth routes (NextAuth handlers)
    if (isApiAuthRoute) return

    // Redirect logged-in users away from auth pages
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return
    }

    // Redirect unauthenticated users to login
    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) callbackUrl += nextUrl.search

        return Response.redirect(
            new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl)
        )
    }
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
