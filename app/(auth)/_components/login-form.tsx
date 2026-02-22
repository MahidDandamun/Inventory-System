// app/(auth)/_components/login-form.tsx
// ---
// Interactive login form with 2FA support
// Uses react-hook-form + zodResolver + server action + useTransition
// ---

"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { IconLoader2, IconEye, IconEyeOff } from "@tabler/icons-react"
import { toast } from "sonner"

import { loginSchema, type LoginInput } from "@/schemas/auth"
import { loginAction } from "@/app/(auth)/_actions/login"

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
import { SocialButtons } from "./social-buttons"
import Image from "next/image"

export function LoginForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", code: "" },
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form

    function onSubmit(values: LoginInput) {
        setError(undefined)
        setSuccess(undefined)

        startTransition(async () => {
            const result = await loginAction(values)

            if (!result) return

            if ("error" in result) {
                setError(result.error)
                toast.error("Sign in failed", { description: result.error })
            } else if ("success" in result) {
                form.reset()
                setSuccess(result.success)
                toast.success("Success!", { description: result.success })
            } else if ("twoFactor" in result) {
                setShowTwoFactor(true)
                toast.info("Two-Factor Authentication", { description: "Code sent to your email." })
            }
        })
    }

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="text-center">
                <div className="flex justify-center pb-2">
                    <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-12" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">
                    {showTwoFactor ? "Two-Factor Authentication" : "Welcome back"}
                </CardTitle>
                <CardDescription>
                    {showTwoFactor
                        ? "Enter the 6-digit code we sent to your email"
                        : "Sign in to your account to continue"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {showTwoFactor ? (
                        /* 2FA code input */
                        <div className="space-y-2">
                            <Label htmlFor="code">Authentication Code</Label>
                            <Input
                                id="code"
                                placeholder="123456"
                                maxLength={6}
                                disabled={isPending}
                                {...register("code")}
                            />
                            {errors.code && (
                                <p className="text-sm text-destructive">{errors.code.message}</p>
                            )}
                        </div>
                    ) : (
                        /* Regular login fields */
                        <>
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/reset"
                                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        disabled={isPending}
                                        className="pr-10"
                                        {...register("password")}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? (
                                            <IconEyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <IconEye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                        {showTwoFactor ? "Verify Code" : "Sign In"}
                    </Button>

                    {!showTwoFactor && (
                        <>
                            {/* Divider */}
                            <div className="relative my-2 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                                    or continue with
                                </span>
                            </div>

                            <SocialButtons />

                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/register"
                                    className="text-primary underline-offset-4 hover:underline"
                                >
                                    Register
                                </Link>
                            </div>
                        </>
                    )}

                    {showTwoFactor && (
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setShowTwoFactor(false)}
                            disabled={isPending}
                        >
                            Back to sign in
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
