// app/(auth)/_components/new-password-form.tsx
// ---
// New password form — reads token from URL search params
// ---

"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { IconLoader2 } from "@tabler/icons-react"

import { newPasswordSchema, type NewPasswordInput } from "@/schemas/auth"
import { newPasswordAction } from "@/app/(auth)/_actions/new-password"

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

export function NewPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewPasswordInput>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: { password: "" },
    })

    function onSubmit(values: NewPasswordInput) {
        setError(undefined)
        setSuccess(undefined)

        startTransition(async () => {
            const result = await newPasswordAction(values, token)
            if ("error" in result) {
                setError(result.error)
            } else {
                setSuccess(result.success)
            }
        })
    }

    return (
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl">Set a new password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="At least 6 characters"
                            disabled={isPending || !token}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {!token && (
                        <FormError message="Invalid or missing reset token. Please request a new reset link." />
                    )}

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isPending || !token}
                    >
                        {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                        Reset Password
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
