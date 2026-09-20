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
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return { error: "The database is currently waking up from standby. Please try your request again in a few seconds." }
    }

    if (error instanceof Error) {
        if (error.message.toLowerCase().includes("timeout")) {
            return { error: "The database took too long to respond. It may be waking up from standby. Please try again." }
        }
        return { error: error.message }
    }

    return { error: "An unexpected error occurred" }
}
