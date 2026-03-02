import { test, expect } from '@playwright/test'

test.describe('Orders Flow (Authenticated)', () => {
    // Uses stored auth state from global-setup.ts — already logged in

    test('can view orders page', async ({ page }) => {
        await page.goto('/dashboard/orders')
        await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible()
    })

    test('orders page displays a data table', async ({ page }) => {
        await page.goto('/dashboard/orders')
        // Look for table structure — the orders table should render
        await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    })

    test('orders page has a create order button', async ({ page }) => {
        await page.goto('/dashboard/orders')
        // Look for a button/link to create a new order
        const createBtn = page.getByRole('button', { name: /create|new|add/i })
            .or(page.getByRole('link', { name: /create|new|add/i }))
        await expect(createBtn).toBeVisible({ timeout: 10000 })
    })
})
