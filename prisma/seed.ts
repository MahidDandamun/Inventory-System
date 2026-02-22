// prisma/seed.ts
// ---
// Database Seeder for the Inventory System
// Run with: npx tsx prisma/seed.ts
// ---

import { PrismaClient, UserRole, Status, OrderStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// ─── Constants ───────────────────────────────────────────

const ADMIN_EMAIL = "admin@inventory.dev"
const ADMIN_PASSWORD = "Admin@1234"
const DEMO_USER_EMAIL = "user@inventory.dev"
const DEMO_USER_PASSWORD = "User@1234"

// ─── Helpers ─────────────────────────────────────────────

function generateOrderNo(): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
    return `ORD-${timestamp}-${random}`
}

function generateInvoiceNo(index: number): string {
    const year = new Date().getFullYear()
    return `INV-${year}-${String(index + 1).padStart(4, "0")}`
}

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Seed Data ───────────────────────────────────────────

async function seedUsers() {
    console.log("🌱  Seeding users...")

    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
    const userHash = await bcrypt.hash(DEMO_USER_PASSWORD, 12)

    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {},
        create: {
            name: "Apollo Admin",
            email: ADMIN_EMAIL,
            password: adminHash,
            role: UserRole.ADMIN,
            emailVerified: new Date(),
        },
    })

    const demoUser = await prisma.user.upsert({
        where: { email: DEMO_USER_EMAIL },
        update: {},
        create: {
            name: "Demo User",
            email: DEMO_USER_EMAIL,
            password: userHash,
            role: UserRole.USER,
            emailVerified: new Date(),
        },
    })

    console.log(`   ✅  Admin:     ${admin.email}  (role: ${admin.role})`)
    console.log(`   ✅  Demo User: ${demoUser.email}  (role: ${demoUser.role})`)

    return { admin, demoUser }
}

async function seedWarehouses() {
    console.log("🌱  Seeding warehouses...")

    const warehouseData = [
        { location: "Manila — Main Hub", status: Status.ACTIVE },
        { location: "Cebu — Regional Depot", status: Status.ACTIVE },
        { location: "Davao — Southern Branch", status: Status.ACTIVE },
        { location: "Quezon City — North Wing", status: Status.ACTIVE },
        { location: "Makati — Express Center", status: Status.INACTIVE },
    ] as const

    const warehouses = []

    for (const data of warehouseData) {
        const warehouse = await prisma.warehouse.upsert({
            where: { location: data.location },
            update: {},
            create: data,
        })
        warehouses.push(warehouse)
        console.log(`   ✅  ${warehouse.location}  [${warehouse.status}]`)
    }

    return warehouses
}

async function seedRawMaterials() {
    console.log("🌱  Seeding raw materials...")

    const materials = [
        { name: "Steel Rods", sku: "RM-STL-001", unit: "kg", quantity: 500, reorderAt: 50, status: Status.ACTIVE },
        { name: "Aluminum Sheets", sku: "RM-ALU-001", unit: "pcs", quantity: 320, reorderAt: 30, status: Status.ACTIVE },
        { name: "Copper Wire", sku: "RM-CPR-001", unit: "m", quantity: 1200, reorderAt: 100, status: Status.ACTIVE },
        { name: "Plastic Pellets", sku: "RM-PLS-001", unit: "kg", quantity: 800, reorderAt: 80, status: Status.ACTIVE },
        { name: "Rubber Gaskets", sku: "RM-RBR-001", unit: "pcs", quantity: 2500, reorderAt: 200, status: Status.ACTIVE },
        { name: "Glass Panels", sku: "RM-GLS-001", unit: "pcs", quantity: 150, reorderAt: 20, status: Status.ACTIVE },
        { name: "Carbon Fiber", sku: "RM-CFB-001", unit: "m", quantity: 75, reorderAt: 15, status: Status.ACTIVE },
        { name: "Electronics Components", sku: "RM-ELC-001", unit: "pcs", quantity: 3000, reorderAt: 300, status: Status.ACTIVE },
        { name: "Hydraulic Fluid", sku: "RM-HYD-001", unit: "L", quantity: 400, reorderAt: 40, status: Status.ACTIVE },
        { name: "Wood Planks", sku: "RM-WOD-001", unit: "pcs", quantity: 8, reorderAt: 20, status: Status.INACTIVE }, // Low stock
    ]

    const created = []
    for (const m of materials) {
        const raw = await prisma.rawMaterial.upsert({
            where: { sku: m.sku },
            update: {},
            create: m,
        })
        created.push(raw)
        console.log(`   ✅  ${raw.name}  [SKU: ${raw.sku}]`)
    }

    return created
}

async function seedProducts(warehouses: Awaited<ReturnType<typeof seedWarehouses>>) {
    console.log("🌱  Seeding products...")

    const activeWarehouses = warehouses.filter((w) => w.status === Status.ACTIVE)

    const productData = [
        { name: "Industrial Drill Press", sku: "PRD-DRL-001", price: 12500.0, quantity: 15, description: "Heavy-duty drill press for industrial use", warehouseIndex: 0 },
        { name: "CNC Milling Machine", sku: "PRD-CNC-001", price: 85000.0, quantity: 3, description: "Computer numerical control milling machine", warehouseIndex: 0 },
        { name: "Hydraulic Press 50T", sku: "PRD-HYD-001", price: 45000.0, quantity: 6, description: "50-ton hydraulic press for metal forming", warehouseIndex: 1 },
        { name: "Lathe Machine 2m", sku: "PRD-LTH-001", price: 32000.0, quantity: 8, description: "2-meter precision lathe machine", warehouseIndex: 1 },
        { name: "Welding Station Pro", sku: "PRD-WLD-001", price: 9800.0, quantity: 20, description: "Professional MIG/TIG welding station", warehouseIndex: 2 },
        { name: "Angle Grinder Set", sku: "PRD-AGR-001", price: 2500.0, quantity: 45, description: "Professional angle grinder set with accessories", warehouseIndex: 2 },
        { name: "Compressor 100L", sku: "PRD-CMP-001", price: 7500.0, quantity: 12, description: "100-liter industrial air compressor", warehouseIndex: 3 },
        { name: "Bench Vise Heavy", sku: "PRD-BVS-001", price: 3200.0, quantity: 30, description: "Heavy-duty bench vise with swivel base", warehouseIndex: 3 },
        { name: "Safety Helmet Set", sku: "PRD-SFH-001", price: 850.0, quantity: 100, description: "ANSI-certified industrial safety helmets", warehouseIndex: 0 },
        { name: "Steel Workbench", sku: "PRD-WBN-001", price: 6500.0, quantity: 10, description: "Heavy-gauge steel workbench", warehouseIndex: 1 },
        { name: "Digital Caliper Pro", sku: "PRD-CAL-001", price: 1200.0, quantity: 25, description: "Professional digital caliper 0–300mm", warehouseIndex: 2 },
        { name: "Torque Wrench Set", sku: "PRD-TWR-001", price: 4800.0, quantity: 18, description: "Preset torque wrench set with case", warehouseIndex: 3 },
        { name: "Industrial Shelving Unit", sku: "PRD-SHV-001", price: 5200.0, quantity: 7, description: "Heavy-duty steel shelving unit 5 tiers", warehouseIndex: 0 },
        { name: "Forklift Pallet Jack", sku: "PRD-PLJ-001", price: 22000.0, quantity: 4, description: "Electric pallet jack 2000kg capacity", warehouseIndex: 1 },
        { name: "Hand Trolley", sku: "PRD-HTR-001", price: 1800.0, quantity: 22, description: "Foldable hand trolley 150kg capacity", warehouseIndex: 2 },
    ]

    const products = []
    for (const p of productData) {
        const warehouse = activeWarehouses[p.warehouseIndex % activeWarehouses.length]
        const product = await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: {
                name: p.name,
                sku: p.sku,
                price: p.price,
                quantity: p.quantity,
                description: p.description,
                warehouseId: warehouse.id,
                status: Status.ACTIVE,
            },
        })
        products.push(product)
        console.log(`   ✅  ${product.name}  [SKU: ${product.sku}]  @ ${warehouse.location}`)
    }

    return products
}

async function seedOrdersAndInvoices(products: Awaited<ReturnType<typeof seedProducts>>) {
    console.log("🌱  Seeding orders & invoices...")

    const orderStatuses: OrderStatus[] = [
        OrderStatus.PENDING,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
    ]

    const customers = [
        "Torres Construction Corp.",
        "Manila Steel Works",
        "Pacific Industrial Co.",
        "Visayas Equipment Ltd.",
        "Mindanao Machinery Inc.",
        "Northern Builders PH",
        "Sunrise Manufacturing",
        "Golden Gate Engineering",
        "Premier Tech Solutions",
        "Cagayan Industrial Supplies",
    ]

    const existingOrdersCount = await prisma.order.count()
    if (existingOrdersCount > 0) {
        console.log(`   ⏭️   Orders already seeded (${existingOrdersCount} found). Skipping.`)
        return
    }

    for (let i = 0; i < 12; i++) {
        const status = randomItem(orderStatuses)
        const numItems = randomBetween(1, 4)
        const selectedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, numItems)

        let total = 0
        const itemsData = selectedProducts.map((p) => {
            const qty = randomBetween(1, 5)
            const unitPrice = Number(p.price)
            total += qty * unitPrice
            return {
                productId: p.id,
                quantity: qty,
                unitPrice: unitPrice,
            }
        })

        const order = await prisma.order.create({
            data: {
                orderNo: generateOrderNo(),
                customer: randomItem(customers),
                status,
                total,
                items: { create: itemsData },
            },
        })

        // Create invoice for DELIVERED orders and some SHIPPED ones
        if (status === OrderStatus.DELIVERED || (status === OrderStatus.SHIPPED && Math.random() > 0.4)) {
            await prisma.invoice.create({
                data: {
                    invoiceNo: generateInvoiceNo(i),
                    orderId: order.id,
                    total: order.total,
                    paidAt: status === OrderStatus.DELIVERED ? new Date() : null,
                },
            })
        }

        console.log(`   ✅  Order ${order.orderNo}  [${status}]  — ${order.customer}`)
    }
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
    console.log("\n╔══════════════════════════════════════════╗")
    console.log("║     Inventory System — Database Seeder   ║")
    console.log("╚══════════════════════════════════════════╝\n")

    const warehouses = await seedWarehouses()
    await seedRawMaterials()
    const products = await seedProducts(warehouses)
    await seedOrdersAndInvoices(products)
    await seedUsers()

    console.log("\n╔══════════════════════════════════════════╗")
    console.log("║            Seeding Complete! 🎉           ║")
    console.log("╠══════════════════════════════════════════╣")
    console.log("║  CREDENTIALS                             ║")
    console.log("║  ─────────────────────────────────────── ║")
    console.log(`║  👑 Admin                                ║`)
    console.log(`║     Email:    ${ADMIN_EMAIL.padEnd(27)}║`)
    console.log(`║     Password: ${ADMIN_PASSWORD.padEnd(27)}║`)
    console.log("║  ─────────────────────────────────────── ║")
    console.log(`║  👤 Demo User                            ║`)
    console.log(`║     Email:    ${DEMO_USER_EMAIL.padEnd(27)}║`)
    console.log(`║     Password: ${DEMO_USER_PASSWORD.padEnd(27)}║`)
    console.log("╚══════════════════════════════════════════╝\n")
}

main()
    .catch((e) => {
        console.error("❌  Seeding failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
