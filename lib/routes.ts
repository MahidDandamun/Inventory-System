/**
 * Application Route Constants
 * Provides centralized routing paths to avoid hardcoded strings.
 */
export const ROUTES = {
    DASHBOARD: "/",
    LOGIN: "/login",
    REGISTER: "/register",

    // Resources
    PRODUCTS: "/products",
    WAREHOUSES: "/warehouses",
    ORDERS: "/orders",
    INVOICES: "/invoices",
    USERS: "/users",
    RAW_MATERIALS: "/raw-materials",
    BILL_OF_MATERIALS: "/bill-of-materials",
    STOCK_MOVEMENTS: "/stock-movements",
    CUSTOMERS: "/customers",
    SYSTEM_LOGS: "/system-logs",
    SETTINGS: "/settings",
} as const;
