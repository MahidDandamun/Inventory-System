// app/(auth)/login/page.tsx
// Full-page login layout: animated SVG hero (left) + form (right) + footer

import type { Metadata } from "next"
import { LoginForm } from "../_components/login-form"
import { InventoryIllustration } from "../_components/inventory-illustration"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Sign In | Theiapollo Inventory",
    description: "Sign in to your Inventory System account",
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-muted/30">

            {/* ── Main hero area ─────────────────────────────── */}
            <main className="flex flex-1 items-center justify-center p-4">

                <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-background rounded-3xl shadow-xl overflow-hidden border border-border">
                    {/* Left panel: brand + illustration */}
                    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-orange-700 p-10 text-white">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="Theiapollo" width={36} height={36} className="h-9 w-9 rounded-lg brightness-0 invert" />
                            <div>
                                <p className="text-lg font-bold leading-none tracking-tight">Theiapollo</p>
                                <p className="text-xs tracking-widest uppercase opacity-70 mt-0.5">Inventory System</p>
                            </div>
                        </div>

                        {/* Animated SVG */}
                        <div className="flex-1 flex items-center justify-center py-8">
                            <InventoryIllustration />
                        </div>

                        {/* Tagline */}
                        <div>
                            <blockquote className="text-base font-medium leading-relaxed opacity-90">
                                &quot;Streamline your warehouse. Empower your team. One system to manage it all.&quot;
                            </blockquote>
                            <p className="mt-3 text-xs opacity-60 tracking-wide">
                                Real-time stock • Orders • Invoices • Analytics
                            </p>
                        </div>
                    </div>

                    {/* Right side: Login Container */}
                    <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
                        <div className="w-full max-w-md [&>div]:shadow-none [&>div]:border-none [&>div]:bg-transparent [&>div]:ring-0">
                            <LoginForm />
                        </div>
                    </div>
                </div>

            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="py-5 text-center text-sm text-muted-foreground border-t">
                <p>
                    Built &amp; designed by{" "}
                    <span className="font-semibold text-foreground">Mahid Dandamun</span>
                    {" · "}
                    <span className="text-primary">Theiapollo Inventory System</span>
                    {" · "}© {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    )
}
