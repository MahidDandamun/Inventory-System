"use server"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"

export type ReplenishmentSuggestion = {
    id: string
    name: string
    sku: string
    entity: "PRODUCT" | "RAW_MATERIAL"
    currentQuantity: number
    reorderLevel: number
    suggestedQuantity: number
    warehouseName?: string
}

export const getReplenishmentSuggestions = cache(async (): Promise<ReplenishmentSuggestion[]> => {
    await requireCurrentUser()

    const suggestions: ReplenishmentSuggestion[] = []

    // Map Products
    const allProducts = await prisma.product.findMany({
        include: { warehouse: { select: { location: true } } }
    })

    allProducts.forEach((p) => {
        if (p.quantity < p.reorderPoint) {
            suggestions.push({
                id: p.id,
                name: p.name,
                sku: p.sku,
                entity: "PRODUCT",
                currentQuantity: p.quantity,
                reorderLevel: p.reorderPoint,
                suggestedQuantity: Math.max(0, (p.reorderQuantity || (p.maxQuantity - p.quantity)) || 0),
                warehouseName: p.warehouse.location
            })
        }
    })

    // Map Materials
    const allMaterials = await prisma.rawMaterial.findMany()
    allMaterials.forEach((m) => {
        if (m.quantity < m.reorderAt) {
            suggestions.push({
                id: m.id,
                name: m.name,
                sku: m.sku,
                entity: "RAW_MATERIAL",
                currentQuantity: m.quantity,
                reorderLevel: m.reorderAt,
                suggestedQuantity: 50,
            })
        }
    })

    return suggestions
})
