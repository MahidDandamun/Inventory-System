"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/dal/products"
import { productSchema } from "@/schemas/product"
import { notifyAdmins } from "@/lib/domain/notifications"
import { handleServerError } from "@/lib/error-handling"

export async function createProductAction(formData: FormData) {
    const parsed = productSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const product = await createProduct(parsed.data)
        await notifyAdmins("New Product Added", `Product "${product.name}" was added to the catalog.`)
        revalidatePath("/products")
        return { success: true, data: product }
    } catch (error: unknown) {
        return handleServerError(error)
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
            await notifyAdmins("Low Stock Alert", `Product "${product.name}" is low on stock (${product.quantity} remaining).`)
        }

        revalidatePath("/products")
        return { success: true, data: product }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteProductAction(id: string) {
    try {
        await deleteProduct(id)
        revalidatePath("/products")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
