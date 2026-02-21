// auth.ts
// ---
// NextAuth.js v5 configuration
// Uses Prisma adapter for session storage + JWT strategy
// ---

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "@/lib/prisma"
import authConfig from "@/auth.config"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/login",
        error: "/login",
    },

    events: {
        // Auto-verify email for OAuth sign-ups
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            })
        },
    },

    callbacks: {
        async signIn({ user, account }) {
            // Allow all OAuth providers without email verification
            if (account?.provider !== "credentials") return true

            // Require email verification for credentials
            const existingUser = await prisma.user.findUnique({
                where: { id: user.id! },
            })
            if (!existingUser?.emailVerified) return false

            // Check two-factor if enabled
            if (existingUser.isTwoFactorEnabled) {
                const confirmation = await prisma.twoFactorConfirmation.findUnique({
                    where: { userId: existingUser.id },
                })
                if (!confirmation) return false

                // Delete after use — require fresh 2FA on next login
                await prisma.twoFactorConfirmation.delete({
                    where: { id: confirmation.id },
                })
            }

            return true
        },

        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as "ADMIN" | "USER"
            }
            if (session.user) {
                session.user.name = token.name ?? ""
                session.user.email = token.email ?? ""
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.isOAuth = token.isOAuth as boolean
            }
            return session
        },

        async jwt({ token }) {
            if (!token.sub) return token

            const user = await prisma.user.findUnique({
                where: { id: token.sub },
            })
            if (!user) return token

            const account = await prisma.account.findFirst({
                where: { userId: user.id },
            })

            token.isOAuth = !!account
            token.name = user.name
            token.email = user.email
            token.role = user.role
            token.isTwoFactorEnabled = user.isTwoFactorEnabled

            return token
        },
    },

    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
})
