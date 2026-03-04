"use server"

import { revalidatePath } from "next/cache"
import { createTransfer, updateTransferStatus } from "@/lib/dal/transfers"
import { transferSchema, transferStatusSchema } from "@/schemas/transfer"
import { handleServerError } from "@/lib/error-handling"
import { TransferStatus } from "@/lib/transfer-status"

export async function createTransferAction(formData: unknown) {
    // Handling both FormData and plain objects if needed, but usually it's plain object from forms in this project
    const data = formData instanceof FormData ? Object.fromEntries(formData) : formData

    // Convert items if they are in the format from a dynamic form
    // (This part depends on how the UI sends items, but for now assuming a clean object)

    const parsed = transferSchema.safeParse(data)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createTransfer(parsed.data)
        revalidatePath("/transfers")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updateTransferStatusAction(id: string, status: TransferStatus) {
    const parsed = transferStatusSchema.safeParse(status)

    if (!parsed.success) {
        return { error: "Invalid status" }
    }

    try {
        await updateTransferStatus(id, parsed.data as TransferStatus)
        revalidatePath("/transfers")
        revalidatePath(`/transfers/${id}`)
        revalidatePath("/products") // Quantity changes
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
