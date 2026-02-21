// app/page.tsx
// ---
// Landing page — public route
// Redirects authenticated users to /dashboard
// ---

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <div className="mx-auto max-w-2xl space-y-8 px-4 text-center">
                <h1 className="text-5xl font-bold tracking-tight">
                    Inventory System
                </h1>
                <p className="text-lg text-muted-foreground">
                    Production-grade inventory management built with Next.js, Prisma, and
                    shadcn/ui.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}