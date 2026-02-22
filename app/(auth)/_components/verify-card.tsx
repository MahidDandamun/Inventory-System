// app/(auth)/_components/verify-card.tsx
// ---
// Email verification card — auto-calls verify action on mount
// Reads ?token= from URL search params
// ---

"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { IconLoader2 } from "@tabler/icons-react"

import { verifyEmailAction } from "@/app/(auth)/_actions/verify"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"

export function VerifyCard() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [error, setError] = useState<string | undefined>(
        !token ? "Missing verification token." : undefined
    )
    const [success, setSuccess] = useState<string | undefined>()

    useEffect(() => {
        if (!token) return

        verifyEmailAction(token).then((result) => {
            if ("error" in result) {
                setError(result.error)
            } else {
                setSuccess(result.success)
            }
        })
    }, [token])

    return (
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Email Verification</CardTitle>
                <CardDescription>Confirming your email address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!error && !success && (
                    <div className="flex items-center justify-center py-4">
                        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Verifying…</span>
                    </div>
                )}

                <FormError message={error} />
                <FormSuccess message={success} />

                <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Back to sign in</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
