"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { settingsSchema, type SettingsInput } from "@/schemas/auth"
import { updateSettingsAction } from "../_actions/settings"

interface SettingsFormProps {
    user: {
        name?: string | null
        email?: string | null
        role: "ADMIN" | "USER"
        isTwoFactorEnabled: boolean
    }
}

export function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<SettingsInput>({
        resolver: zodResolver(settingsSchema) as never,
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            role: user.role,
            isTwoFactorEnabled: user.isTwoFactorEnabled,
            password: "",
            newPassword: "",
        },
    })

    const roleValue = useWatch({ control, name: "role" });
    const isTwoFactorEnabledValue = useWatch({ control, name: "isTwoFactorEnabled" });

    function onSubmit(values: SettingsInput) {
        setError(undefined)
        setSuccess(undefined)

        startTransition(async () => {
            const formData = new FormData()
            if (values.name) formData.append("name", values.name)
            if (values.email) formData.append("email", values.email)
            if (values.role) formData.append("role", values.role)
            if (values.isTwoFactorEnabled) formData.append("isTwoFactorEnabled", "true")
            if (values.password) formData.append("password", values.password)
            if (values.newPassword) formData.append("newPassword", values.newPassword)

            const result: { error?: string | Record<string, string[]>; success?: boolean; data?: unknown } = await updateSettingsAction(formData)

            if (result?.error) {
                if (typeof result.error === "object") {
                    const err = result.error as Record<string, string[]>
                    const firstError = Object.values(err).find(e => e && e.length > 0)
                    if (firstError) {
                        setError(firstError[0])
                        toast.error(firstError[0])
                    } else if (err.root) {
                        setError(err.root[0])
                        toast.error(err.root[0])
                    }
                } else {
                    setError(String(result.error))
                    toast.error(String(result.error))
                }
            } else {
                setSuccess("Settings updated successfully.")
                toast.success("Settings updated successfully.")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        disabled={isPending}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        disabled={isPending}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Current Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        {...register("newPassword")}
                    />
                    {errors.newPassword && (
                        <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                        disabled={true}
                        value={roleValue}
                        onValueChange={(value: "ADMIN" | "USER") => setValue("role", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <p className="text-sm text-destructive">{errors.role.message}</p>
                    )}
                </div>

                <div className="space-y-2 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 pt-4">
                        <Checkbox
                            id="isTwoFactorEnabled"
                            checked={isTwoFactorEnabledValue}
                            onCheckedChange={(checked) => setValue("isTwoFactorEnabled", checked === true)}
                            disabled={isPending}
                        />
                        <Label htmlFor="isTwoFactorEnabled" className="cursor-pointer">
                            Enable Two-Factor Authentication (2FA)
                        </Label>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 rounded bg-green-500/15 text-green-600 text-sm">
                    {success}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </form>
    )
}
