import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export type RawMaterialDTO = {
    id: string
    name: string
    sku: string
    description: string | null
    unit: string
    quantity: number
    reorderAt: number
    status: "ACTIVE" | "INACTIVE"
    createdAt: Date
}

export const getRawMaterials = cache(async (): Promise<RawMaterialDTO[]> => {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const items = await prisma.rawMaterial.findMany({
        orderBy: { createdAt: "desc" },
    })

    return items
})

export async function getRawMaterialById(id: string): Promise<RawMaterialDTO | null> {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.rawMaterial.findUnique({ where: { id } })
}

export async function createRawMaterial(data: {
    name: string
    sku: string
    description?: string
    unit: string
    quantity: number
    reorderAt: number
    status?: "ACTIVE" | "INACTIVE"
}) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.rawMaterial.create({ data })
}

export async function updateRawMaterial(
    id: string,
    data: {
        name?: string
        sku?: string
        description?: string
        unit?: string
        quantity?: number
        reorderAt?: number
        status?: "ACTIVE" | "INACTIVE"
    }
) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.rawMaterial.update({ where: { id }, data })
}

export async function deleteRawMaterial(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    return prisma.rawMaterial.delete({ where: { id } })
}
