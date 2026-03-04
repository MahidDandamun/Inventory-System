"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ROUTES } from "@/lib/routes"
import { handleServerError } from "@/lib/error-handling"
import { createCycleCount, updateCycleCountItem, completeCycleCount } from "@/lib/dal/cycle-counts"

const createCycleCountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    scheduledDate: z.string().min(1, "Date is required"),
    notes: z.string().optional(),
    productIds: z.string().array().min(1, "Select at least one product")
})

export async function createCycleCountAction(data: z.infer<typeof createCycleCountSchema>) {
    try {
        const parsed = createCycleCountSchema.parse(data)

        const cc = await createCycleCount({
            name: parsed.name,
            scheduledDate: new Date(parsed.scheduledDate),
            notes: parsed.notes,
            productIds: parsed.productIds
        })

        revalidatePath(ROUTES.CYCLE_COUNTS)
        return cc
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

const updateItemSchema = z.object({
    id: z.string().min(1),
    actualQuantity: z.number().min(0, "Cannot be negative"),
    notes: z.string().optional()
})

export async function updateCycleCountItemAction(ccId: string, data: z.infer<typeof updateItemSchema>) {
    try {
        const parsed = updateItemSchema.parse(data)
        await updateCycleCountItem(ccId, parsed)
        revalidatePath(ROUTES.CYCLE_COUNTS)
        revalidatePath(`${ROUTES.CYCLE_COUNTS}/${ccId}`)
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function completeCycleCountAction(ccId: string) {
    try {
        await completeCycleCount(ccId)
        revalidatePath(ROUTES.CYCLE_COUNTS)
        revalidatePath(`${ROUTES.CYCLE_COUNTS}/${ccId}`)
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
