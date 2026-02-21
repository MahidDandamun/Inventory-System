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
        <Suspense fallback={null}>
            <NewPasswordForm />
        </Suspense>
    )
}
