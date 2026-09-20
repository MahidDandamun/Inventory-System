// app/page.tsx
// ---
// Landing page — public route
// Shows an animated SVG side-by-side with the LoginForm
// ---

import { LoginForm } from "@/app/(auth)/_components/login-form"
import Image from "next/image"

export default function HomePage() {
    return (
        <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Panel */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')" }}
                />
                {/* Emerald Overlays for theme consistency and text readability */}
                <div className="absolute inset-0 bg-emerald-950/70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-emerald-950/40" />

                <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
                    <Image src="/logo.png" alt="Theiapollo" width={32} height={32} className="h-8 w-8 brightness-0 invert" />
                    Theiapollo Inventory
                </div>
                
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium leading-relaxed">
                            &ldquo;Streamline your warehouse. Empower your team. One system to manage it all.&rdquo;
                        </p>
                        <footer className="text-sm opacity-80">Real-time stock • Orders • Invoices • Analytics</footer>
                    </blockquote>
                </div>
            </div>
            
            {/* Right Panel */}
            <div className="flex h-full items-center p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}