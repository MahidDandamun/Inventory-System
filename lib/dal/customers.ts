import "server-only"
import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { requireCurrentUser } from "@/lib/dal/guards"
import { CustomerInput } from "@/schemas/customer"
import { createSystemLog } from "@/lib/dal/system-logs"
import type { Customer } from "@prisma/client"

export type CustomerDTO = {
    id: string
    name: string
    email: string | null
    phone: string | null
    billingAddress: string | null
    shippingAddress: string | null
    terms: string | null
    status: "ACTIVE" | "INACTIVE"
    createdAt: Date
    updatedAt: Date
}

function toCustomerDTO(customer: Customer): CustomerDTO {
    return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        billingAddress: customer.billingAddress,
        shippingAddress: customer.shippingAddress,
        terms: customer.terms,
        status: customer.status,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
    }
}

export const getCustomers = cache(async (): Promise<CustomerDTO[]> => {
    await requireCurrentUser()

    const customers = await prisma.customer.findMany({
        orderBy: { name: "asc" },
    })

    return customers.map(toCustomerDTO)
})

export async function getCustomerById(id: string): Promise<CustomerDTO | null> {
    await requireCurrentUser()

    const customer = await prisma.customer.findUnique({
        where: { id },
    })

    return customer ? toCustomerDTO(customer) : null
}

export async function createCustomer(data: CustomerInput): Promise<CustomerDTO> {
    const user = await requireCurrentUser()

    const customer = await prisma.customer.create({
        data: {
            ...data,
            createdBy: { connect: { id: user.id } },
        },
    })

    await createSystemLog(user.id, "CREATE", "CUSTOMER", customer.id, `Created customer ${customer.name}`)
    return toCustomerDTO(customer)
}

export async function updateCustomer(id: string, data: CustomerInput): Promise<CustomerDTO> {
    const user = await requireCurrentUser()

    const customer = await prisma.customer.update({
        where: { id },
        data,
    })

    await createSystemLog(user.id, "UPDATE", "CUSTOMER", customer.id, `Updated customer ${customer.name}`)
    return toCustomerDTO(customer)
}

export async function deleteCustomer(id: string): Promise<CustomerDTO> {
    const user = await requireCurrentUser()

    const customer = await prisma.customer.delete({
        where: { id },
    })

    await createSystemLog(user.id, "DELETE", "CUSTOMER", customer.id, `Deleted customer ${customer.name}`)
    return toCustomerDTO(customer)
}
