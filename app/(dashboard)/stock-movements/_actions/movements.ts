"use server"

import { revalidatePath } from "next/cache"
import { executeStockMovement } from "@/lib/dal/stock-movements"
import { stockMovementSchema } from "@/schemas/stock-movement"
import { handleServerError } from "@/lib/error-handling"
import { ROUTES } from "@/lib/routes"

const MOVEMENTS_ROUTE = "/stock-movements"

export async function createStockMovementAction(formData: FormData) {
    const parsed = stockMovementSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const data = parsed.data

        const movement = await executeStockMovement(data)

        revalidatePath(MOVEMENTS_ROUTE)
        // Also revalidate the entity's own page
        if (data.entity === "PRODUCT") revalidatePath(`${ROUTES.PRODUCTS}/${data.entityId}`)
        if (data.entity === "RAW_MATERIAL") revalidatePath(`${ROUTES.RAW_MATERIALS}/${data.entityId}`)

        return { success: true, data: movement }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
