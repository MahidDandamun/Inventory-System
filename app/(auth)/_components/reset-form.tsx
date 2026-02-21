// app/(auth)/_components/reset-form.tsx
// ---
// Password reset request form
// ---

"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { IconLoader2 } from "@tabler/icons-react"

import { resetSchema, type ResetInput } from "@/schemas/auth"
import { resetAction } from "@/app/(auth)/_actions/reset"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"

export function ResetForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetInput>({
        resolver: zodResolver(resetSchema),
        defaultValues: { email: "" },
    })

    function onSubmit(values: ResetInput) {
        setError(undefined)
        setSuccess(undefined)

        startTransition(async () => {
            const result = await resetAction(values)
            if ("error" in result) {
                setError(result.error)
            } else {
                setSuccess(result.success)
            }
        })
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Forgot your password?</CardTitle>
                <CardDescription>
                    Enter your email and we&apos;ll send a reset link
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            disabled={isPending}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                        Send Reset Link
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
