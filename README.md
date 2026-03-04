# Enterprise Inventory Management System

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white&style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white&style=flat-square)
![Auth.js](https://img.shields.io/badge/Auth.js-5-purple?logo=authjs&style=flat-square)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A **production-grade, scalable inventory management system** built to demonstrate modern full-stack architecture patterns. This project features a robust Data Access Layer (DAL), role-based access control, server actions, a cleanly organized feature-based folder structure, and a thorough set of interconnected supply-chain functionalities.

---

## 🌟 Key Functionalities

This system goes beyond simple CRUD, modeling a realistic supply chain and warehouse operation.

### 📦 Inventory & Manufacturing
- **Products & Raw Materials**: Manage finished goods and the raw materials used to create them, complete with SKUs, reorder points, and max quantities.
- **Bill of Materials (BOM)**: Define recipes indicating exactly which raw materials (and what quantities) are required to manufacture a specific product.
- **Lots & Tracking**: Group products into batches with manufacturing and expiration dates.
- **Serial Numbers**: Track individual items exactly, managing statuses like `IN_STOCK`, `SOLD`, or `RMA`.

### 🏭 Warehouse Operations
- **Varied Warehouses**: Manage multiple warehouse locations and assignments.
- **Warehouse Transfers**: Move stock seamlessly across different warehouses with tracked statuses (`REQUESTED`, `IN_TRANSIT`, `RECEIVED`).
- **Cycle Counts**: Perform routine inventory audits. Record expected vs. actual quantities and track variances.
- **Stock Movements**: An immutable audit log of every quantity change (IN, OUT, ADJUST) with specific user attribution.

### 🚚 Purchasing & Supply Chain
- **Suppliers**: Manage vendor catalogs, contact info, and lead times.
- **Purchase Orders (POs)**: Issue orders to suppliers for raw materials.
- **Goods Receipts**: Process deliveries against POs, ensuring precise recording of incoming raw materials.

### 🤝 Sales & Fulfillment
- **Customers & Orders**: Track customer information and manage their lifecycle from placing an `Order` to fulfillment (`PROCESSING`, `SHIPPED`, `DELIVERED`).
- **Invoices & Payments**: Generate invoices based on orders, process payments, and track outstanding balances.

### 🛡️ Security, Governance & Approvals
- **Approval Workflows**: Built-in flow for administrative sign-offs (e.g., approving large inventory cycle-count variances).
- **Authentication & 2FA**: Password + OAuth login strategies using Auth.js, fortified with Two-Factor Authentication via email OTPs.
- **Role-Based Access Control (RBAC)**: Strict `ADMIN` vs. `USER` roles enforced entirely at the Data Access Layer—never relying exclusively on UI hiding.
- **System Logs**: Fully comprehensive administrative tracking detailing exactly who changed what, when, and comparing previous vs. new data states.

---

## 🏗️ Architecture Design

```text
┌──────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  Server Components (pages)  →  Client Components (forms)     │
│  [ Always consumes DTOs — NEVER raw Database Entities ]      │
└────────────────────────────┬─────────────────────────────────┘
                             │ calls
┌────────────────────────────▼─────────────────────────────────┐
│                   Server Actions Layer                       │
│  Thin boundary: Validates Inputs (Zod) → Calls DAL → Re-val  │
│  Location: `app/(dashboard)/[feature]/_actions/`             │
└────────────────────────────┬─────────────────────────────────┘
                             │ calls
┌────────────────────────────▼─────────────────────────────────┐
│                 Data Access Layer (DAL)                      │
│  The ultimate security & data-gathering boundary.            │
│  - Auth/Role checks happen here BEFORE any query             │
│  - Guarded globally by `import 'server-only'`                │
│  - Location: `lib/dal/`                                      │
└────────────────────────────┬─────────────────────────────────┘
                             │ queries
┌────────────────────────────▼─────────────────────────────────┐
│                     Database Layer                           │
│  Prisma Client Singleton  →  Neon Serverless PostgreSQL      │
└──────────────────────────────────────────────────────────────┘
```

> **Why a DAL?** Placing all database communication in `lib/dal/` ensures React Components and Server Actions never directly ping Prisma. By projecting outputs into DTOs (Data Transfer Objects), we prevent exposing sensitive schema details (e.g., passwords, internal system IDs) to the broader application.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **[Next.js 16](https://nextjs.org/)** | App Router, Server Components, and secure Server Actions |
| **[TypeScript 5](https://www.typescriptlang.org/)** | End-to-end type safety |
| **[Prisma 6](https://www.prisma.io/)** | Highly-typed ORM & database migrations |
| **[Neon PostgreSQL](https://neon.tech/)** | Fast, serverless relational database engine |
| **[Auth.js (v5)](https://authjs.dev/)** | Sessions, OAuth, and credential management |
| **[shadcn/ui](https://ui.shadcn.com/)** | Accessible, copy-paste Tailwind component primitives |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Fast utility styling |
| **[Zod](https://zod.dev/)** | Synchronous schema validation used across client/server |
| **[React Table (v8)](https://tanstack.com/table)** | Robust headless data tables |
| **[Recharts](https://recharts.org/)** | Gorgeous data plotting for dashboard overviews |
| **[Resend](https://resend.com/)** | Fast and reliable transactional email provider |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **Postgres Database**: Create a free instance on [Neon.tech](https://neon.tech/)
- **Resend API Key**: Free tier available on [Resend.com](https://resend.com/)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/inventory-system.git
cd inventory-system
npm install
```

### 2. Environment Configuration
Duplicate the example variables config:
```bash
cp .env.example .env
```
Fill in `.env` with your secure keys:
```env
# Database Credentials
NEON_DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"

# Generate Auth secret: npx auth secret
AUTH_SECRET="your-secure-random-string"

# Resend for Notifications & 2FA
RESEND_API_KEY="re_123456789"
```

### 3. Bootstrap the Database
Generate your Prisma types and sync the schema with your active database:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to **[http://localhost:3000](http://localhost:3000)** and log in!

---

## 📁 System Folder Structure

The project is structured entirely by **feature** rather than file-type, keeping components and actions co-located next to the pages they serve.

```
inventory-system/
├── app/
│   ├── (auth)/                   # Public auth routes (login, register...)
│   └── (dashboard)/              # The secure App Shell 
│       ├── dashboard/            # Home overview & charts
│       ├── cycle-counts/         # Feature Example
│       │   ├── page.tsx          #   Main views
│       │   ├── new/page.tsx      #   Creation routes
│       │   ├── _actions/         #   Action endpoints (mutations)
│       │   └── _components/      #   Feature-specific UI elements 
│       ├── approvals/
│       ├── goods-receipts/
│       ├── invoices/
│       ├── orders/
│       ├── products/
│       ├── purchase-orders/
│       ├── raw-materials/
│       ├── settings/
│       ├── stock-movements/
│       ├── suppliers/
│       ├── system-logs/
│       ├── users/
│       └── warehouse/
│
├── components/                   # Shared shell components & shadcn primitives
├── lib/
│   ├── dal/                      # Core Data Access Layer
│   ├── tests/                    # Vitest utilities & DAL unit tests
│   └── utils.ts
├── prisma/                       # Prisma Schema definitions
└── schemas/                      # Global Zod schemas
```

---

## 📜 License

This system is open-source and released under the **[MIT License](./LICENSE)**. Feel free to use and heavily modify it to fit your exact business use case!
