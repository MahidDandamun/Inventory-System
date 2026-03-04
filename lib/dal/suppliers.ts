import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import { createSystemLog } from "@/lib/dal/system-logs"
import type { Supplier } from "@prisma/client"

// ── DTO type ──
export type SupplierDTO = {
    id: string
    name: string
    contactEmail: string | null
    phone: string | null
    address: string | null
    terms: string | null
    leadTimeDays: number | null
    status: "ACTIVE" | "INACTIVE"
    createdAt: Date
    updatedAt: Date
}

function toSupplierDTO(supplier: Supplier): SupplierDTO {
    return {
        id: supplier.id,
        name: supplier.name,
        contactEmail: supplier.contactEmail,
        phone: supplier.phone,
        address: supplier.address,
        terms: supplier.terms,
        leadTimeDays: supplier.leadTimeDays,
        status: supplier.status,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
    }
}

// ── List (cached) ──
export const getSuppliers = cache(async (): Promise<SupplierDTO[]> => {
    await requireCurrentUser()

    const suppliers = await prisma.supplier.findMany({
        orderBy: { name: "asc" },
    })

    return suppliers.map(toSupplierDTO)
})

// ── Get by ID ──
export async function getSupplierById(id: string): Promise<SupplierDTO | null> {
    await requireCurrentUser()

    const supplier = await prisma.supplier.findUnique({ where: { id } })
    return supplier ? toSupplierDTO(supplier) : null
}

// ── Create ──
export async function createSupplier(data: {
    name: string
    contactEmail?: string
    phone?: string
    address?: string
    terms?: string
    leadTimeDays?: number
    status?: "ACTIVE" | "INACTIVE"
}): Promise<SupplierDTO> {
    const user = await requireCurrentUser()

    const supplier = await prisma.supplier.create({
        data: {
            name: data.name,
            contactEmail: data.contactEmail || null,
            phone: data.phone || null,
            address: data.address || null,
            terms: data.terms || null,
            leadTimeDays: data.leadTimeDays ?? null,
            status: data.status ?? "ACTIVE",
            createdBy: { connect: { id: user.id } },
        },
    })

    await createSystemLog(user.id, "CREATE", "SUPPLIER", supplier.id, `Created supplier ${supplier.name}`)
    return toSupplierDTO(supplier)
}

// ── Update ──
export async function updateSupplier(id: string, data: {
    name: string
    contactEmail?: string
    phone?: string
    address?: string
    terms?: string
    leadTimeDays?: number
    status?: "ACTIVE" | "INACTIVE"
}): Promise<SupplierDTO> {
    const user = await requireCurrentUser()

    const supplier = await prisma.supplier.update({
        where: { id },
        data: {
            name: data.name,
            contactEmail: data.contactEmail || null,
            phone: data.phone || null,
            address: data.address || null,
            terms: data.terms || null,
            leadTimeDays: data.leadTimeDays ?? null,
            status: data.status,
        },
    })

    await createSystemLog(user.id, "UPDATE", "SUPPLIER", supplier.id, `Updated supplier ${supplier.name}`)
    return toSupplierDTO(supplier)
}

// ── Delete ──
export async function deleteSupplier(id: string): Promise<SupplierDTO> {
    const user = await requireCurrentUser()

    const supplier = await prisma.supplier.delete({ where: { id } })

    await createSystemLog(user.id, "DELETE", "SUPPLIER", supplier.id, `Deleted supplier ${supplier.name}`)
    return toSupplierDTO(supplier)
}
