// app/(auth)/_components/form-error.tsx
// ---
// Reusable error alert for auth forms
// ---

import { IconAlertCircle } from "@tabler/icons-react"

interface FormErrorProps {
    message?: string
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null

    return (
        <div className="flex items-center gap-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <IconAlertCircle className="size-4 shrink-0" />
            <p>{message}</p>
        </div>
    )
}
