"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconDots, IconTrash, IconCheck, IconTruck, IconCornerDownRight } from "@tabler/icons-react"
import { TransferDTO } from "@/lib/dal/transfers"
import { updateTransferStatusAction } from "../_actions/transfers"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TRANSFER_STATUS_FLOW, TransferStatus } from "@/lib/transfer-status"

interface CellActionProps {
    data: TransferDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const onUpdateStatus = (status: TransferStatus) => {
        startTransition(async () => {
            const result = await updateTransferStatusAction(data.id, status)
            if (result && "error" in result) {
                toast.error(typeof result.error === "string" ? result.error : "Failed to update status")
            } else {
                toast.success(`Transfer marked as ${status.toLowerCase()}`)
                router.refresh()
            }
        })
    }

    const availableNextStatuses = TRANSFER_STATUS_FLOW[data.status as TransferStatus] || []

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <IconDots className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {availableNextStatuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => onUpdateStatus(status)}
                        disabled={isPending}
                        className="cursor-pointer"
                    >
                        {status === "APPROVED" && <IconCheck className="mr-2 h-4 w-4" />}
                        {status === "IN_TRANSIT" && <IconTruck className="mr-2 h-4 w-4" />}
                        {status === "RECEIVED" && <IconCornerDownRight className="mr-2 h-4 w-4" />}
                        {status === "CANCELLED" && <IconTrash className="mr-2 h-4 w-4" />}
                        Mark as {status}
                    </DropdownMenuItem>
                ))}

                {availableNextStatuses.length === 0 && (
                    <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
