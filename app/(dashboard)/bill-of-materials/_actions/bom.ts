"use server"

import { revalidatePath } from "next/cache"
import { createBillOfMaterial, deleteBillOfMaterial } from "@/lib/dal/bill-of-materials"
import { billOfMaterialSchema } from "@/schemas/bill-of-material"
import { handleServerError } from "@/lib/error-handling"
import { ROUTES } from "@/lib/routes"

// Need a specific route for BOMs? Or just revalidate the product page if nested?
// Let's assume a dedicated BOM page based on our plan, even though it's relation-heavy.
// A common pattern is having them under products or a standalone matching route.
const BOM_ROUTE = "/bill-of-materials"

export async function createBillOfMaterialAction(formData: FormData) {
    const parsed = billOfMaterialSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createBillOfMaterial(parsed.data)
        revalidatePath(BOM_ROUTE)
        // Also revalidate the specific product page where it might be shown
        revalidatePath(`${ROUTES.PRODUCTS}/${item.productId}`)
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteBillOfMaterialAction(id: string) {
    try {
        const item = await deleteBillOfMaterial(id)
        revalidatePath(BOM_ROUTE)
        revalidatePath(`${ROUTES.PRODUCTS}/${item.productId}`)
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function createBillOfMaterialsBatchAction(
    productId: string,
    items: { rawMaterialId: string; quantity: number }[]
) {
    if (!productId || items.length === 0) {
        return { error: "Product and at least one material are required" }
    }

    try {
        const { createBillOfMaterials } = await import("@/lib/dal/bill-of-materials")
        const result = await createBillOfMaterials({ productId, items })
        revalidatePath(BOM_ROUTE)
        revalidatePath(`${ROUTES.PRODUCTS}/${productId}`)
        return { success: true, data: result }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
