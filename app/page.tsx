// app/page.tsx
// ---
// Landing page — public route
// Shows an animated SVG side-by-side with the LoginForm
// ---

import { LoginForm } from "@/app/(auth)/_components/login-form"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-background rounded-3xl shadow-xl overflow-hidden border border-border">
                {/* Left side: Animated SVG branding */}
                <div className="hidden lg:flex flex-col items-center justify-center bg-primary/5 p-12 relative overflow-hidden">
                    {/* Decorative blurred background circles */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-pulse delay-700"></div>

                    <div className="z-10 text-center space-y-6">
                        <div className="flex justify-center">
                            {/* Animated isometric inventory boxes SVG */}
                            <svg
                                className="w-64 h-64 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-12"
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g transform="translate(100, 100)">
                                    <path
                                        className="animate-[bounce_3s_ease-in-out_infinite] fill-primary drop-shadow-xl"
                                        d="M0,-40 L40,-20 L0,0 L-40,-20 Z"
                                    />
                                    <path
                                        className="fill-primary/80"
                                        d="M-40,-20 L0,0 L0,40 L-40,20 Z"
                                    />
                                    <path
                                        className="fill-primary/60"
                                        d="M0,0 L40,-20 L40,20 L0,40 Z"
                                    />

                                    <path
                                        className="animate-[bounce_3.5s_ease-in-out_infinite] delay-150 fill-secondary drop-shadow-md"
                                        d="M-45,-5 L-15,10 L-45,25 L-75,10 Z"
                                    />
                                    <path
                                        className="fill-secondary/80"
                                        d="M-75,10 L-45,25 L-45,55 L-75,40 Z"
                                    />
                                    <path
                                        className="fill-secondary/60"
                                        d="M-45,25 L-15,10 L-15,40 L-45,55 Z"
                                    />

                                    <path
                                        className="animate-[bounce_4s_ease-in-out_infinite] fill-primary/90 drop-shadow-md"
                                        d="M30,10 L60,25 L30,40 L0,25 Z"
                                    />
                                    <path
                                        className="fill-primary/70"
                                        d="M0,25 L30,40 L30,70 L0,55 Z"
                                    />
                                    <path
                                        className="fill-primary/50"
                                        d="M30,40 L60,25 L60,55 L30,70 Z"
                                    />
                                </g>
                            </svg>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                            Theiapollo
                        </h1>
                        <p className="text-lg text-muted-foreground uppercase tracking-widest font-semibold text-sm">
                            Inventory System
                        </p>
                        <p className="max-w-xs mx-auto text-sm text-muted-foreground pt-4">
                            Production-grade warehouse management, fully equipped with comprehensive analytics and reporting tools.
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