// app/(auth)/register/page.tsx

import type { Metadata } from "next"
import { RegisterForm } from "../_components/register-form"

export const metadata: Metadata = {
    title: "Create Account",
    description: "Create a new Inventory System account",
}

export default function RegisterPage() {
    return <RegisterForm />
}
