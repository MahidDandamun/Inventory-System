// app/(auth)/login/page.tsx

import type { Metadata } from "next"
import { LoginForm } from "../_components/login-form"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your Inventory System account",
}

export default function LoginPage() {
    return <LoginForm />
}
