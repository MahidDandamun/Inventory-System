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
import { createSupplierAction } from "../_actions/suppliers"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create Supplier"}
        </Button>
    )
}

export function CreateSupplierDialog() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    async function action(formData: FormData) {
        const result = await createSupplierAction(formData)

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
            toast.success("Supplier created successfully")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Supplier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Supplier</DialogTitle>
                    <DialogDescription>
                        Add a new supplier to your procurement system. Fill in the
                        details below.
                    </DialogDescription>
                </DialogHeader>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Supplier Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Acme Raw Materials Inc."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                placeholder="supplier@acme.com"
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
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="123 Industrial Blvd, Suite 500"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="terms">Payment Terms</Label>
                            <Input
                                id="terms"
                                name="terms"
                                placeholder="Net 30"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
                            <Input
                                id="leadTimeDays"
                                name="leadTimeDays"
                                type="number"
                                min="0"
                                placeholder="14"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue="ACTIVE">
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
