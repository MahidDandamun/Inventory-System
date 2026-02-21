// app/(auth)/_components/social-buttons.tsx
// ---
// OAuth social sign-in buttons (GitHub + Google)
// Uses next-auth/react signIn — must be a Client Component
// ---

"use client"

import { signIn } from "next-auth/react"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export function SocialButtons() {
    function handleOAuth(provider: "github" | "google") {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth("github")}
            >
                <IconBrandGithub className="mr-2 size-4" />
                GitHub
            </Button>
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuth("google")}
            >
                <IconBrandGoogle className="mr-2 size-4" />
                Google
            </Button>
        </div>
    )
}
