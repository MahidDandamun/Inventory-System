"use server"

import { revalidatePath } from "next/cache"
import {
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "@/lib/dal/suppliers"
import { supplierSchema } from "@/schemas/supplier"
import { handleServerError } from "@/lib/error-handling"

export async function createSupplierAction(formData: FormData) {
    const rawData = Object.fromEntries(formData)

    const cleanedData = {
        name: rawData.name,
        contactEmail: rawData.contactEmail || undefined,
        phone: rawData.phone || undefined,
        address: rawData.address || undefined,
        terms: rawData.terms || undefined,
        leadTimeDays: rawData.leadTimeDays || undefined,
        status: rawData.status,
    }

    const parsed = supplierSchema.safeParse(cleanedData)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createSupplier({
            ...parsed.data,
            leadTimeDays: typeof parsed.data.leadTimeDays === "number" ? parsed.data.leadTimeDays : undefined,
        })
        revalidatePath("/suppliers")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updateSupplierAction(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData)

    const cleanedData = {
        name: rawData.name,
        contactEmail: rawData.contactEmail || undefined,
        phone: rawData.phone || undefined,
        address: rawData.address || undefined,
        terms: rawData.terms || undefined,
        leadTimeDays: rawData.leadTimeDays || undefined,
        status: rawData.status,
    }

    const parsed = supplierSchema.safeParse(cleanedData)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await updateSupplier(id, {
            ...parsed.data,
            leadTimeDays: typeof parsed.data.leadTimeDays === "number" ? parsed.data.leadTimeDays : undefined,
        })
        revalidatePath("/suppliers")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteSupplierAction(id: string) {
    try {
        await deleteSupplier(id)
        revalidatePath("/suppliers")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
