// app/(auth)/layout.tsx
// ---
// Auth layout — base wrapper for all auth pages.
// Login page owns its own full-page layout.
// Register/reset/verify/etc. use the centered card pattern.
// ---

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
