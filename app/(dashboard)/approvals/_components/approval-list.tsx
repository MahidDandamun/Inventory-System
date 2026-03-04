"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { approveAction, rejectAction } from "../_actions/approval-actions"
import { toast } from "sonner"
import type { ApprovalRequestDTO } from "@/lib/dal/approvals"

export function ApprovalList({ requests }: { requests: ApprovalRequestDTO[] }) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    async function onApprove(id: string) {
        if (!confirm("Approve this request?")) return
        setIsPending(true)
        const res = await approveAction(id, "Approved automatically by action") as { error?: string } | undefined
        setIsPending(false)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Request approved")
            router.refresh()
        }
    }

    async function onReject(id: string) {
        if (!confirm("Reject this request?")) return
        setIsPending(true)
        const res = await rejectAction(id, "Rejected via action") as { error?: string } | undefined
        setIsPending(false)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success("Request rejected")
            router.refresh()
        }
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Context / Details</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">No approval requests found.</TableCell>
                        </TableRow>
                    ) : (
                        requests.map((req) => {
                            let payloadData: { variance?: number, cycleCountId?: string } = {}
                            try { payloadData = JSON.parse(req.payload || "{}") } catch { }

                            const isPendingStr = req.status === "PENDING"

                            return (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.actionType}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {req.entity} ({req.entityId})
                                            {payloadData.variance && (
                                                <span className="block text-muted-foreground">Variance: {payloadData.variance} (CC: {payloadData.cycleCountId})</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{req.requesterName || "Unknown"}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === "APPROVED" ? "default" : req.status === "REJECTED" ? "destructive" : "secondary"}>
                                            {req.status}
                                        </Badge>
                                        {req.approverName && <span className="block text-xs text-muted-foreground mt-1">by {req.approverName}</span>}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {isPendingStr && (
                                            <>
                                                <Button size="sm" variant="default" onClick={() => onApprove(req.id)} disabled={isPending}>Approve</Button>
                                                <Button size="sm" variant="destructive" onClick={() => onReject(req.id)} disabled={isPending}>Reject</Button>
                                            </>
                                        )}
                                        {!isPendingStr && <span className="text-muted-foreground text-sm">Processed</span>}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
