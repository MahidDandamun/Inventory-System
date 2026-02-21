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
        <Suspense fallback={null}>
            <VerifyCard />
        </Suspense>
    )
}
