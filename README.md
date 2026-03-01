# Inventory System

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-5-purple?logo=authjs)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

A **production-grade inventory management system** built as a portfolio project to demonstrate modern full-stack architecture patterns: Data Access Layer (DAL), server actions, role-based access control, two-factor authentication, and a clean feature-based folder structure.

---

## Features

- **Full CRUD** — Warehouses, Products, Raw Materials, Orders, Invoices, Users
- **Dashboard** — Real-time stats cards and an interactive overview chart (Recharts)
- **Authentication** — Email/password login, Google & GitHub OAuth (Auth.js v5)
- **Two-Factor Auth (2FA)** — TOTP-style email OTP with confirmation flow
- **Role-Based Access** — `ADMIN` / `USER` roles enforced at the Data Access Layer
- **Email** — Verification, password reset, and 2FA emails via Resend
- **Data Access Layer** — All DB queries behind a security boundary with DTO projection
- **Dark / Light Mode** — System-aware theme switcher built with `next-themes`

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer                             │
│  Server Components (pages) → Client Components (forms)  │
│  Consumes DTOs only — never raw DB objects              │
└──────────────────────────┬──────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────┐
│                 Server Actions Layer                    │
│  Thin orchestration: validate (Zod) → DAL → revalidate  │
│  Located in: app/(dashboard)/[feature]/_actions/        │
└──────────────────────────┬──────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────┐
│              Data Access Layer (DAL)                    │
│  All DB queries live here — the security boundary       │
│  Auth checks before every query                         │
│  Returns DTOs (never raw Prisma models)                 │
│  Guarded with `import 'server-only'`                    │
│  Located in: lib/dal/                                   │
└──────────────────────────┬──────────────────────────────┘
                           │ queries
┌──────────────────────────▼──────────────────────────────┐
│                   Database Layer                        │
│  Prisma Client (singleton) → Neon PostgreSQL            │
└─────────────────────────────────────────────────────────┘
```

> **Why a DAL?** Every DB query goes through `lib/dal/`. Components never import Prisma directly, auth checks happen at the data layer (not the UI), and DTOs prevent accidental exposure of sensitive fields like `password` or internal tokens.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | App Router, Server Components, Server Actions |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Full type safety across all layers |
| [Prisma](https://www.prisma.io/) | 6 | ORM + schema management |
| [Neon](https://neon.tech/) | — | Serverless PostgreSQL |
| [Auth.js](https://authjs.dev/) | 5 (beta) | Authentication, OAuth, session management |
| [shadcn/ui](https://ui.shadcn.com/) | latest | Accessible, composable component library |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first styling |
| [Recharts](https://recharts.org/) | 3 | Dashboard data visualisation |
| [React Hook Form](https://react-hook-form.com/) | 7 | Client-side form state |
| [Zod](https://zod.dev/) | 4 | Schema validation (server + client) |
| [Resend](https://resend.com/) | 6 | Transactional email |
| [react-table](https://tanstack.com/table) | 8 | Headless data tables |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- [Neon](https://neon.tech/) PostgreSQL database (free tier works)
- [Resend](https://resend.com/) API key (free tier works)
- GitHub and/or Google OAuth app credentials (optional)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/inventory-system.git
cd inventory-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
# Database (Neon PostgreSQL)
NEON_DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth secret — generate with: npx auth secret
AUTH_SECRET="your-secret"

# OAuth (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email (Resend)
RESEND_API_KEY="re_..."
```

### 4. Set up the database

```bash
npx prisma generate   # Generate the Prisma Client
npx prisma db push    # Push schema to your Neon database
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Folder Structure

```
inventory-system/
├── app/
│   ├── (auth)/                   # Auth pages (login, register, reset…)
│   │   ├── layout.tsx            # Centered card layout
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── reset/page.tsx
│   │   ├── new-password/page.tsx
│   │   └── verify/page.tsx
│   │
│   └── (dashboard)/              # Protected app shell
│       ├── layout.tsx            # Sidebar + Navbar wrapper
│       ├── dashboard/page.tsx    # Stats + chart overview
│       ├── products/             # ← pattern repeated per feature
│       │   ├── page.tsx          #   Data table page
│       │   ├── new/page.tsx      #   Create form
│       │   ├── [id]/page.tsx     #   Edit form
│       │   ├── _actions/         #   Server actions (thin, Zod-validated)
│       │   └── _components/      #   Feature-scoped components
│       ├── warehouse/
│       ├── raw-materials/
│       ├── orders/
│       ├── invoices/
│       ├── users/
│       └── settings/
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (auto-generated)
│   └── layout/                   # App shell: sidebar, navbar, theme switcher
│
├── lib/
│   ├── dal/                      # ← Data Access Layer (security boundary)
│   │   ├── users.ts
│   │   ├── products.ts
│   │   ├── warehouses.ts
│   │   ├── raw-materials.ts
│   │   ├── orders.ts
│   │   └── invoices.ts
│   ├── auth.ts                   # getCurrentUser() — React.cache() wrapped
│   ├── mail.ts                   # Resend email service
│   ├── tokens.ts                 # Token generation helpers
│   └── prisma.ts                 # Prisma singleton
│
├── schemas/                      # Zod validation schemas (shared)
├── types/                        # TypeScript interfaces & DTO types
├── hooks/                        # Custom React hooks
├── auth.ts                       # NextAuth.js configuration
├── auth.config.ts                # OAuth provider setup
├── middleware.ts                  # Route protection (public / private)
└── routes.ts                     # Centralised route constants
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.
