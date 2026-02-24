import { Prisma } from "@prisma/client"

export function handleServerError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return { error: "A record with this identifier already exists." }
        }
        if (error.code === 'P2003') {
            return { error: "This record is referenced by other items and cannot be deleted." }
        }
        return { error: `Database error: ${error.message}` }
    }

    if (error instanceof Error) {
        return { error: error.message }
    }

    return { error: "An unexpected error occurred" }
}
