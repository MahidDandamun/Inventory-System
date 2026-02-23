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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { userAdminSchema, type UserAdminInput } from "@/schemas/user"
import { createUserAction, updateUserAction } from "../_actions/user"
import { UserDTO } from "@/lib/dal/users"

interface UserFormProps {
    user?: UserDTO | null
}

export function UserForm({ user }: UserFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<UserAdminInput>({
        resolver: zodResolver(userAdminSchema) as never,
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            role: user?.role || "USER",
        },
    })

    const roleValue = useWatch({ control, name: "role" });

    function onSubmit(values: UserAdminInput) {
        setError(undefined)
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("email", values.email)
            if (values.password) formData.append("password", values.password)
            formData.append("role", values.role)

            let result
            if (user?.id) {
                result = await updateUserAction(user.id, formData)
            } else {
                result = await createUserAction(formData)
            }

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
                toast.success(user ? "User updated successfully" : "User created successfully")
                router.push("/users")
                router.refresh()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="password">
                        {user ? "New Password (Optional)" : "Password *"}
                    </Label>
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
                    <Label htmlFor="role">System Role *</Label>
                    <Select
                        disabled={isPending}
                        value={roleValue}
                        onValueChange={(value: "ADMIN" | "USER") => setValue("role", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">User (Standard Access)</SelectItem>
                            <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.role && (
                        <p className="text-sm text-destructive">{errors.role.message}</p>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => router.push("/users")}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {user ? "Update User" : "Create User"}
                </Button>
            </div>
        </form>
    )
}
