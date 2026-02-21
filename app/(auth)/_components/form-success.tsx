// app/(auth)/_components/form-success.tsx
// ---
// Reusable success alert for auth forms
// ---

import { IconCircleCheck } from "@tabler/icons-react"

interface FormSuccessProps {
    message?: string
}

export function FormSuccess({ message }: FormSuccessProps) {
    if (!message) return null

    return (
        <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
            <IconCircleCheck className="size-4 shrink-0" />
            <p>{message}</p>
        </div>
    )
}
