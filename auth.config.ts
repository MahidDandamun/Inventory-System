// auth.config.ts
// ---
// Auth provider configuration
// Separated from auth.ts so middleware can import it without
// pulling in Prisma (which doesn't work in Edge Runtime)
// ---

import type { NextAuthConfig } from "next-auth"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: { scope: "read:user user:email" },
            },
            issuer: "https://github.com/login/oauth",
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            authorization: {
                params: { scope: "public_profile,email" },
            },
        }),
    ],
} satisfies NextAuthConfig
