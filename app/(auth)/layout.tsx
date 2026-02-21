// app/(auth)/layout.tsx
// ---
// Auth layout — centered card for login/register/reset pages
// ---

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <div className="w-full max-w-md">{children}</div>
        </main>
    )
}
