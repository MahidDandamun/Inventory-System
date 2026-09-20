"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconDatabaseOff, IconRefresh } from "@tabler/icons-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error(error)
    }, [error])

    const isDbTimeout = 
        error.message.toLowerCase().includes("timeout") || 
        error.message.toLowerCase().includes("database") ||
        error.message.toLowerCase().includes("prisma")

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="max-w-md w-full bg-background rounded-3xl shadow-xl border border-border p-8 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <IconDatabaseOff className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isDbTimeout ? "Database is waking up" : "Something went wrong"}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {isDbTimeout 
                            ? "This application is hosted on a serverless database that goes to sleep during inactivity. It usually takes about 3–5 seconds to wake up." 
                            : error.message || "An unexpected error occurred while processing your request."}
                    </p>
                </div>

                <Button 
                    onClick={() => reset()} 
                    size="lg" 
                    className="w-full"
                >
                    <IconRefresh className="mr-2 h-4 w-4" />
                    Try again
                </Button>
            </div>
        </div>
    )
}
