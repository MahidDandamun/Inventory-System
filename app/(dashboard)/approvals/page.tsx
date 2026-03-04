import { getApprovalRequests } from "@/lib/dal/approvals"
import { ApprovalList } from "./_components/approval-list"

export const metadata = {
    title: "Approvals | Inventory System",
}

export default async function ApprovalsPage() {
    const requests = await getApprovalRequests()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Governance & Approvals</h1>
                <p className="text-muted-foreground">
                    Review and act upon administrative requests like significant stock variances.
                </p>
            </div>

            <ApprovalList requests={requests} />
        </div>
    )
}
