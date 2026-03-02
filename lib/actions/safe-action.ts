import { z } from "zod"

export type ActionState<T> =
    | { success: true; data: T }
    | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> }

export async function validatedAction<TSchema extends z.ZodType, TResult>(
    schema: TSchema,
    formData: FormData | unknown,
    handler: (data: z.infer<TSchema>) => Promise<TResult>
): Promise<ActionState<TResult>> {
    try {
        let parsedInput

        if (formData instanceof FormData) {
            parsedInput = Object.fromEntries(formData.entries())
        } else {
            parsedInput = formData
        }

        const validation = schema.safeParse(parsedInput)

        if (!validation.success) {
            return {
                success: false,
                error: "Invalid form data.",
                fieldErrors: validation.error.flatten().fieldErrors,
            }
        }

        const data = await handler(validation.data)
        return { success: true, data }
    } catch (error: unknown) {
        console.error("Action error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred."
        }
    }
}
