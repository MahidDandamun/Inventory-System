// app/(auth)/verify/page.tsx
// ---
// Suspense boundary required because VerifyCard calls useSearchParams()
// ---

import type { Metadata } from "next"
import { Suspense } from "react"
import { VerifyCard } from "../_components/verify-card"

export const metadata: Metadata = {
    title: "Verify Email",
    description: "Verify your email address",
}

export default function VerifyPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background sm:bg-muted/40 px-4 py-8">
            <div className="w-full max-w-md">
                <Suspense fallback={null}>
                    <VerifyCard />
                </Suspense>
            </div>
            <footer className="mt-8 text-center text-xs text-muted-foreground">
                Built by <span className="font-semibold text-foreground">Mahid Dandamun</span> · Theiapollo Inventory System · © {new Date().getFullYear()}
            </footer>
        </main>
    )
}
