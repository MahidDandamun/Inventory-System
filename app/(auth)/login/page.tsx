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
        <div className="min-h-screen flex flex-col bg-background">

            {/* ── Main hero area ─────────────────────────────── */}
            <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">

                {/* ── DESKTOP (lg+): two-column card layout ─── */}
                <div className="hidden lg:grid grid-cols-2 w-full max-w-5xl rounded-2xl border shadow-xl overflow-hidden">

                    {/* Left panel: brand + illustration */}
                    <div className="flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-orange-700 p-10 text-white">
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

                    {/* Right panel: form */}
                    <div className="flex flex-col justify-center px-12 py-10 bg-background">
                        <div className="w-full max-w-md mx-auto">
                            <LoginForm />
                        </div>
                    </div>
                </div>

                {/* ── MOBILE/TABLET (below lg): plain centered form, no outer container ─── */}
                <div className="lg:hidden w-full max-w-sm">
                    <LoginForm />
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
