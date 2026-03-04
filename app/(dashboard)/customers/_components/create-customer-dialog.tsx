"use client"

import { useState } from "react"
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
    DialogTrigger,
} from "@/components/ui/dialog"
import { createCustomerAction } from "../_actions/customers"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create Customer"}
        </Button>
    )
}

export function CreateCustomerDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    async function action(formData: FormData) {
        const result = await createCustomerAction(formData)

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
            toast.success("Customer created successfully")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Customer</DialogTitle>
                    <DialogDescription>
                        Add a new customer to your system. Fill in the details
                        below.
                    </DialogDescription>
                </DialogHeader>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Acme Corporation"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="contact@acme.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Input
                            id="billingAddress"
                            name="billingAddress"
                            placeholder="123 Main St, Suite 100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shippingAddress">
                            Shipping Address
                        </Label>
                        <Input
                            id="shippingAddress"
                            name="shippingAddress"
                            placeholder="456 Warehouse Ave"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="terms">Payment Terms</Label>
                            <Input
                                id="terms"
                                name="terms"
                                placeholder="Net 30"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="ACTIVE">
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
