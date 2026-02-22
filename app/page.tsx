// app/page.tsx
// ---
// Landing page — public route
// Shows an animated SVG side-by-side with the LoginForm
// ---

import { LoginForm } from "@/app/(auth)/_components/login-form"
import { InventoryIllustration } from "@/app/(auth)/_components/inventory-illustration"
import Image from "next/image"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
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
                    <div className="w-full max-w-md [&>div]:shadow-none [&>div]:border-none [&>div]:bg-transparent">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    )
}