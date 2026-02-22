import { z } from "zod"

export const userAdminSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }).optional().or(z.literal("")),
    role: z.enum(["ADMIN", "USER"]),
})

export type UserAdminInput = z.infer<typeof userAdminSchema>
