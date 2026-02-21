// app/(auth)/reset/page.tsx

import type { Metadata } from "next"
import { ResetForm } from "../_components/reset-form"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Request a password reset link",
}

export default function ResetPage() {
    return <ResetForm />
}
