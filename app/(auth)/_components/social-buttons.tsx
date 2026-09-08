// app/(auth)/_components/social-buttons.tsx
// ---
// OAuth social sign-in buttons (GitHub + Google)
// Uses next-auth/react signIn — must be a Client Component
// ---

"use client"

import { signIn } from "next-auth/react"
import { IconBrandFacebook, IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export function SocialButtons() {
    function handleOAuth(provider: "github" | "google" | "facebook") {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            <Button
                type="button"
                variant="outline"
                className="w-full px-2"
                onClick={() => handleOAuth("github")}
            >
                <IconBrandGithub className="mr-2 size-4" />
                GitHub
            </Button>
            <Button
                type="button"
                variant="outline"
                className="w-full px-2"
                onClick={() => handleOAuth("google")}
            >
                <IconBrandGoogle className="mr-2 size-4" />
                Google
            </Button>
            <Button
                type="button"
                variant="outline"
                className="w-full px-2"
                onClick={() => handleOAuth("facebook")}
            >
                <IconBrandFacebook className="mr-2 size-4" />
                Facebook
            </Button>
        </div>
    )
}
