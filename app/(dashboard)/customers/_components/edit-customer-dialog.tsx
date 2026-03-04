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
import { updateCustomerAction } from "../_actions/customers"
import { CustomerDTO } from "@/lib/dal/customers"
import { toast } from "sonner"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving..." : "Save Changes"}
        </Button>
    )
}

export function EditCustomerDialog({
    customer,
    open,
    onOpenChange,
}: {
    customer: CustomerDTO
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const router = useRouter()

    async function action(formData: FormData) {
        const result = await updateCustomerAction(customer.id, formData)

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
            toast.success("Customer updated successfully")
            onOpenChange(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                    <DialogDescription>
                        Update the details for &quot;{customer.name}&quot;.
                    </DialogDescription>
                </DialogHeader>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name *</Label>
                        <Input
                            id="edit-name"
                            name="name"
                            required
                            defaultValue={customer.name}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                defaultValue={customer.email || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                                id="edit-phone"
                                name="phone"
                                type="tel"
                                defaultValue={customer.phone || ""}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-billingAddress">
                            Billing Address
                        </Label>
                        <Input
                            id="edit-billingAddress"
                            name="billingAddress"
                            defaultValue={customer.billingAddress || ""}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-shippingAddress">
                            Shipping Address
                        </Label>
                        <Input
                            id="edit-shippingAddress"
                            name="shippingAddress"
                            defaultValue={customer.shippingAddress || ""}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-terms">Payment Terms</Label>
                            <Input
                                id="edit-terms"
                                name="terms"
                                defaultValue={customer.terms || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                name="status"
                                defaultValue={customer.status}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="INACTIVE">
                                        Inactive
                                    </SelectItem>
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
