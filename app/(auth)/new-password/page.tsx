// app/(auth)/new-password/page.tsx
// ---
// Suspense boundary is required because NewPasswordForm calls useSearchParams()
// ---

import type { Metadata } from "next"
import { Suspense } from "react"
import { NewPasswordForm } from "../_components/new-password-form"

export const metadata: Metadata = {
    title: "New Password",
    description: "Set a new password for your account",
}

export default function NewPasswordPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background sm:bg-muted/40 px-4 py-8">
            <div className="w-full max-w-md">
                <Suspense fallback={null}>
                    <NewPasswordForm />
                </Suspense>
            </div>
            <footer className="mt-8 text-center text-xs text-muted-foreground">
                Built by <span className="font-semibold text-foreground">Mahid Dandamun</span> · Theiapollo Inventory System · © {new Date().getFullYear()}
            </footer>
        </main>
    )
}
