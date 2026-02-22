// app/(auth)/reset/page.tsx

import type { Metadata } from "next"
import { ResetForm } from "../_components/reset-form"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Request a password reset link",
}

export default function ResetPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background sm:bg-muted/40 px-4 py-8">
            <div className="w-full max-w-md">
                <ResetForm />
            </div>
            <footer className="mt-8 text-center text-xs text-muted-foreground">
                Built by <span className="font-semibold text-foreground">Mahid Dandamun</span> · Theiapollo Inventory System · © {new Date().getFullYear()}
            </footer>
        </main>
    )
}
