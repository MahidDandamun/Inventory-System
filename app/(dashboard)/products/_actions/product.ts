"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/dal/products"
import { productSchema } from "@/schemas/product"

export async function createProductAction(formData: FormData) {
    const parsed = productSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const product = await createProduct(parsed.data)
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
