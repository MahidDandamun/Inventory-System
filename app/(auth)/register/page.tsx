// app/(auth)/register/page.tsx

import type { Metadata } from "next"
import { RegisterForm } from "../_components/register-form"

export const metadata: Metadata = {
    title: "Create Account",
    description: "Create a new Inventory System account",
}

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background sm:bg-muted/40 px-4 py-8">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
            <footer className="mt-8 text-center text-xs text-muted-foreground">
                Built by <span className="font-semibold text-foreground">Mahid Dandamun</span> · Theiapollo Inventory System · © {new Date().getFullYear()}
            </footer>
        </main>
    )
}
