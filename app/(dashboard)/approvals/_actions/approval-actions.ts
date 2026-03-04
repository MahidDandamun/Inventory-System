"use server"

import { revalidatePath } from "next/cache"
import { ROUTES } from "@/lib/routes"
import { handleServerError } from "@/lib/error-handling"
import { approveRequest, rejectRequest } from "@/lib/dal/approvals"

export async function approveAction(id: string, comments?: string) {
    try {
        await approveRequest(id, comments)
        revalidatePath(ROUTES.APPROVALS)
        revalidatePath(ROUTES.CYCLE_COUNTS) // in case it was a cycle count
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function rejectAction(id: string, comments?: string) {
    try {
        await rejectRequest(id, comments)
        revalidatePath(ROUTES.APPROVALS)
        revalidatePath(ROUTES.CYCLE_COUNTS) // in case it was a cycle count
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
