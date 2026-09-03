// app/(auth)/register/page.tsx

import type { Metadata } from "next"
import { RegisterForm } from "../_components/register-form"

export const metadata: Metadata = {
    title: "Create Account — Theiapollo",
    description: "Create a new Theiapollo Inventory account",
}

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md animate-fade-in-up">
                <RegisterForm />
            </div>
            <footer className="mt-8 text-center text-xs text-muted-foreground">
                Built by <span className="font-medium text-foreground">Mahid Dandamun</span> · © {new Date().getFullYear()} Theiapollo
            </footer>
        </main>
    )
}
