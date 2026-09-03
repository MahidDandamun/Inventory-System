// app/layout.tsx
// ---
// Root layout — wraps entire application
// Providers: SessionProvider, ThemeProvider
// Font: Inter (variable --font-sans)
// ---

import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { auth } from "@/auth"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Theiapollo Inventory",
    template: "%s — Theiapollo",
  },
  description:
    "Enterprise inventory management — products, orders, invoices, and warehouse operations in one system.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
