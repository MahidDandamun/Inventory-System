import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { createSystemLog } from "@/lib/dal/system-logs"
import { requireCurrentUser } from "@/lib/dal/guards"
import type { BillOfMaterial } from "@prisma/client"

export type BillOfMaterialDTO = {
    id: string
    productId: string
    productName: string
    rawMaterialId: string
    rawMaterialName: string
    quantity: number
}

export function toBillOfMaterialDTO(bom: BillOfMaterial & { product: { name: string }, rawMaterial: { name: string } }): BillOfMaterialDTO {
    return {
        id: bom.id,
        productId: bom.productId,
        productName: bom.product.name,
        rawMaterialId: bom.rawMaterialId,
        rawMaterialName: bom.rawMaterial.name,
        quantity: typeof bom.quantity?.toNumber === 'function' ? bom.quantity.toNumber() : Number(bom.quantity),
    }
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

    return boms.map(toBillOfMaterialDTO)
})

export async function createBillOfMaterial(data: {
    productId: string
    rawMaterialId: string
    quantity: number
}): Promise<BillOfMaterialDTO> {
    const user = await requireCurrentUser()

    const bom = await prisma.billOfMaterial.create({
        data: {
            productId: data.productId,
            rawMaterialId: data.rawMaterialId,
            quantity: data.quantity,
        },
        include: {
            product: { select: { name: true } },
            rawMaterial: { select: { name: true } },
        }
    })

    await createSystemLog(user.id, "CREATE", "BOM", bom.id, JSON.stringify(data))
    return toBillOfMaterialDTO(bom)
}

export async function deleteBillOfMaterial(id: string): Promise<BillOfMaterialDTO> {
    const user = await requireCurrentUser()

    const bom = await prisma.billOfMaterial.delete({
        where: { id },
        include: {
            product: { select: { name: true } },
            rawMaterial: { select: { name: true } },
        }
    })
    await createSystemLog(user.id, "DELETE", "BOM", id)
    return toBillOfMaterialDTO(bom)
}
