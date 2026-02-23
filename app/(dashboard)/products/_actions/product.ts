"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/dal/products"
import { productSchema } from "@/schemas/product"
import { createNotification } from "@/lib/dal/notifications"
import { getAllUsers } from "@/lib/dal/users"

export async function createProductAction(formData: FormData) {
    const parsed = productSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const product = await createProduct(parsed.data)
        const users = await getAllUsers()
        const admins = users.filter((u) => u.role === "ADMIN")
        for (const admin of admins) {
            await createNotification(admin.id, "New Product Added", `Product "${product.name}" was added to the catalog.`)
        }
        revalidatePath("/products")
        return { success: true, data: product }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function updateProductAction(id: string, formData: FormData) {
    const parsed = productSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        // Only update allowed fields, not including warehouseId if not strictly needed or handle it securely.
        const product = await updateProduct(id, parsed.data)

        if (product.quantity <= 10) {
            const users = await getAllUsers()
            const admins = users.filter((u) => u.role === "ADMIN")
            for (const admin of admins) {
                await createNotification(admin.id, "Low Stock Alert", `Product "${product.name}" is low on stock (${product.quantity} remaining).`)
            }
        }

        revalidatePath("/products")
        return { success: true, data: product }
    } catch (error: unknown) {
        return { error: { root: [error instanceof Error ? error.message : "Unknown error"] } }
    }
}

export async function deleteProductAction(id: string) {
    try {
        await deleteProduct(id)
        revalidatePath("/products")
        return { success: true }
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}
