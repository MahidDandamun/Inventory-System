import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { createSystemLog } from "@/lib/dal/system-logs"

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

    const rawMaterial = await prisma.rawMaterial.create({
        data: {
            ...data,
            createdById: user.id,
        }
    })
    await createSystemLog(user.id, "CREATE", "RAW_MATERIAL", rawMaterial.id, JSON.stringify(data))
    return rawMaterial
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

    const rawMaterial = await prisma.rawMaterial.update({ where: { id }, data })
    await createSystemLog(user.id, "UPDATE", "RAW_MATERIAL", id, JSON.stringify(data))
    return rawMaterial
}

export async function deleteRawMaterial(id: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized")

    const rawMaterial = await prisma.rawMaterial.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "RAW_MATERIAL", id)
    return rawMaterial
}
