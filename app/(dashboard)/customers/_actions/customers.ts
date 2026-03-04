"use server"

import { revalidatePath } from "next/cache"
import {
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "@/lib/dal/customers"
import { customerSchema } from "@/schemas/customer"
import { handleServerError } from "@/lib/error-handling"

export async function createCustomerAction(formData: FormData) {
    const rawData = Object.fromEntries(formData)
    
    // Convert empty strings to null/undefined as required by schema optional fields
    const cleanedData = {
        name: rawData.name,
        email: rawData.email || undefined,
        phone: rawData.phone || undefined,
        billingAddress: rawData.billingAddress || undefined,
        shippingAddress: rawData.shippingAddress || undefined,
        terms: rawData.terms || undefined,
        status: rawData.status,
    }

    const parsed = customerSchema.safeParse(cleanedData)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await createCustomer(parsed.data)
        revalidatePath("/customers")
        revalidatePath("/orders")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function updateCustomerAction(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData)
    
    const cleanedData = {
        name: rawData.name,
        email: rawData.email || undefined,
        phone: rawData.phone || undefined,
        billingAddress: rawData.billingAddress || undefined,
        shippingAddress: rawData.shippingAddress || undefined,
        terms: rawData.terms || undefined,
        status: rawData.status,
    }

    const parsed = customerSchema.safeParse(cleanedData)

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors }
    }

    try {
        const item = await updateCustomer(id, parsed.data)
        revalidatePath("/customers")
        revalidatePath("/orders")
        return { success: true, data: item }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}

export async function deleteCustomerAction(id: string) {
    try {
        await deleteCustomer(id)
        revalidatePath("/customers")
        revalidatePath("/orders")
        return { success: true }
    } catch (error: unknown) {
        return handleServerError(error)
    }
}
