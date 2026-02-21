// app/(auth)/_components/register-form.tsx
// ---
// Registration form with react-hook-form + server action
// ---

"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { IconLoader2 } from "@tabler/icons-react"

import { registerSchema, type RegisterInput } from "@/schemas/auth"
import { registerAction } from "@/app/(auth)/_actions/register"

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

export function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    })

    function onSubmit(values: RegisterInput) {
        setError(undefined)
        setSuccess(undefined)

        startTransition(async () => {
            const result = await registerAction(values)
            if ("error" in result) {
                setError(result.error)
            } else {
                reset()
                setSuccess(result.success)
            }
        })
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            disabled={isPending}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

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

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="At least 6 characters"
                            disabled={isPending}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                        Create Account
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
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
