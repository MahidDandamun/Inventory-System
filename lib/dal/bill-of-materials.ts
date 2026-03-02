import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"

export type BillOfMaterialDTO = {
    id: string
    productId: string
    productName: string
    rawMaterialId: string
    rawMaterialName: string
    quantity: number
}

export const getBillOfMaterialsByProductId = cache(async (productId: string): Promise<BillOfMaterialDTO[]> => {
    await requireCurrentUser()

    const boms = await prisma.billOfMaterial.findMany({
        where: { productId },
        include: {
            product: { select: { name: true } },
            rawMaterial: { select: { name: true } },
        }
    })

    return boms.map((b: typeof boms[number]) => ({
        id: b.id,
        productId: b.productId,
        productName: b.product.name,
        rawMaterialId: b.rawMaterialId,
        rawMaterialName: b.rawMaterial.name,
        quantity: b.quantity.toNumber(),
    }))
})

export async function createBillOfMaterial(data: {
    productId: string
    rawMaterialId: string
    quantity: number
}) {
    const user = await requireCurrentUser()

    const bom = await prisma.billOfMaterial.create({
        data: {
            productId: data.productId,
            rawMaterialId: data.rawMaterialId,
            quantity: data.quantity,
        }
    })

    await createSystemLog(user.id, "CREATE", "BOM", bom.id, JSON.stringify(data))
    return bom
}

export async function deleteBillOfMaterial(id: string) {
    const user = await requireCurrentUser()

    const bom = await prisma.billOfMaterial.delete({ where: { id } })
    await createSystemLog(user.id, "DELETE", "BOM", id)
    return bom
}
