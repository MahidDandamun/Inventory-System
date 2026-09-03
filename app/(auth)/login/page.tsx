// app/(auth)/login/page.tsx
// Full-page login layout: brand panel (left) + form (right)

import type { Metadata } from "next"
import { LoginForm } from "../_components/login-form"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Sign In — Theiapollo",
    description: "Sign in to your Theiapollo Inventory account",
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">

            {/* ── Main area ─────────────────────────────── */}
            <main className="flex flex-1 items-center justify-center p-4">

                <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-card rounded-2xl shadow-xl overflow-hidden border border-border animate-fade-in">
                    {/* Left panel: brand */}
                    <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
                        {/* Subtle grid pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />

                        {/* Brand */}
                        <div className="flex items-center gap-3 relative z-10">
                            <Image src="/logo.png" alt="Theiapollo" width={32} height={32} className="h-8 w-8 brightness-0 invert" />
                            <div>
                                <p className="text-sm font-semibold leading-none tracking-tight">Theiapollo</p>
                                <p className="text-[10px] tracking-widest uppercase opacity-40 mt-0.5">Inventory System</p>
                            </div>
                        </div>

                        {/* Central message */}
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                All systems operational
                            </div>
                            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                                Manage your entire<br />
                                warehouse in one place.
                            </h2>
                            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                                Products, orders, invoices, suppliers, and real-time stock tracking — all connected.
                            </p>
                        </div>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {["Real-time Stock", "Order Tracking", "Invoicing", "Reports", "Multi-Warehouse"].map((f) => (
                                <span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Login form */}
                    <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
                        <div className="w-full max-w-sm [&>div]:shadow-none [&>div]:border-none [&>div]:bg-transparent [&>div]:ring-0">
                            <LoginForm />
                        </div>
                    </div>
                </div>

            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="py-4 text-center text-xs text-muted-foreground">
                <p>
                    Built & designed by{" "}
                    <span className="font-medium text-foreground">Mahid Dandamun</span>
                    {" · "}© {new Date().getFullYear()} Theiapollo
                </p>
            </footer>
        </div>
    )
}
