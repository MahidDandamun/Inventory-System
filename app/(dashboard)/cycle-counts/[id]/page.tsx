import { notFound } from "next/navigation"
import { getCycleCountById } from "@/lib/dal/cycle-counts"
import { CycleCountClientWrapper } from "../_components/cycle-count-client"

export const metadata = {
    title: "Cycle Count Detail | Inventory System",
}

export default async function CycleCountDetailPage({ params }: { params: { id: string } }) {
    const cc = await getCycleCountById(params.id)

    if (!cc) {
        notFound()
    }

    return (
        <CycleCountClientWrapper cc={cc} />
    )
}
