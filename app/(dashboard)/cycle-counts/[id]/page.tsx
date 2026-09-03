import { notFound } from "next/navigation"
import { getCycleCountById } from "@/lib/dal/cycle-counts"
import { CycleCountClientWrapper } from "../_components/cycle-count-client"

export const metadata = {
    title: "Cycle Count Detail | Inventory System",
}

export default async function CycleCountDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cc = await getCycleCountById(id)

    if (!cc) {
        notFound()
    }

    return (
        <CycleCountClientWrapper cc={cc} />
    )
}
