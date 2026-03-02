"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/dal/products"
import { productSchema } from "@/schemas/product"
import { createNotification } from "@/lib/dal/notifications"
import { getAllUsers } from "@/lib/dal/users"
import { validatedAction } from "@/lib/actions/safe-action"
import { z } from "zod"

export async function createProductAction(formData: FormData) {
    return validatedAction(productSchema, formData, async (data) => {

        const product = await createProduct(data)
        const users = await getAllUsers()
        const admins = users.filter((u) => u.role === "ADMIN")
        for (const admin of admins) {
            await createNotification(admin.id, "New Product Added", `Product "${product.name}" was added to the catalog.`)
        }
        revalidatePath("/products")
        return product
    })
}

export async function updateProductAction(id: string, formData: FormData) {
    return validatedAction(productSchema, formData, async (data) => {

        const product = await updateProduct(id, data)

        if (product.quantity <= 10) {
            const users = await getAllUsers()
            const admins = users.filter((u) => u.role === "ADMIN")
            for (const admin of admins) {
                await createNotification(admin.id, "Low Stock Alert", `Product "${product.name}" is low on stock (${product.quantity} remaining).`)
            }
        }

        revalidatePath("/products")
        return product
    })
}

export async function deleteProductAction(id: string) {
    return validatedAction(z.any(), {}, async () => {
        await deleteProduct(id)
        revalidatePath("/products")
        return null
    })
}
