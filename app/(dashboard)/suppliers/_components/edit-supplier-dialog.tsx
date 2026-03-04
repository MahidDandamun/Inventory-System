"use client"

import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { updateSupplierAction } from "../_actions/suppliers"
import { SupplierDTO } from "@/lib/dal/suppliers"
import { toast } from "sonner"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving..." : "Save Changes"}
        </Button>
    )
}

export function EditSupplierDialog({
    supplier,
    open,
    onOpenChange,
}: {
    supplier: SupplierDTO
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const router = useRouter()

    async function action(formData: FormData) {
        const result = await updateSupplierAction(supplier.id, formData)

        if (result && "error" in result && typeof result.error === "string") {
            toast.error(result.error)
            return
        }

        if (result && "error" in result && typeof result.error === "object") {
            const firstError = Object.values(result.error as Record<string, string[]>)
                .flat()
                .find(Boolean)
            toast.error(firstError || "Validation error")
            return
        }

        if (result && "success" in result && result.success) {
            toast.success("Supplier updated successfully")
            onOpenChange(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Supplier</DialogTitle>
                    <DialogDescription>
                        Update the details for &quot;{supplier.name}&quot;.
                    </DialogDescription>
                </DialogHeader>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Supplier Name *</Label>
                        <Input
                            id="edit-name"
                            name="name"
                            required
                            defaultValue={supplier.name}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-contactEmail">Contact Email</Label>
                            <Input
                                id="edit-contactEmail"
                                name="contactEmail"
                                type="email"
                                defaultValue={supplier.contactEmail || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                name="phone"
                                type="tel"
                                defaultValue={supplier.phone || ""}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-address">Address</Label>
                        <Input
                            id="edit-address"
                            name="address"
                            defaultValue={supplier.address || ""}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-terms">Payment Terms</Label>
                            <Input
                                id="edit-terms"
                                name="terms"
                                defaultValue={supplier.terms || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-leadTimeDays">Lead Time (days)</Label>
                            <Input
                                id="edit-leadTimeDays"
                                name="leadTimeDays"
                                type="number"
                                min="0"
                                defaultValue={supplier.leadTimeDays ?? ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                name="status"
                                defaultValue={supplier.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    )
}
