import { Prisma } from "@prisma/client"

export function generateDocumentNumber(prefix: "ORD" | "INV") {
    const randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()
    return `${prefix}-${Date.now()}-${randomPart}`
}

export async function createWithUniqueRetry<T>(
    createFn: () => Promise<T>,
    maxAttempts = 5
): Promise<T> {
    let attempt = 0

    while (attempt < maxAttempts) {
        try {
            return await createFn()
        } catch (error) {
            const isUniqueViolation =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"

            if (!isUniqueViolation) {
                throw error
            }

            attempt += 1
            if (attempt >= maxAttempts) {
                throw new Error("Failed to generate a unique document number after multiple attempts")
            }
        }
    }

    throw new Error("Unexpected document number generation failure")
}
