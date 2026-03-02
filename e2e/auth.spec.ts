import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
    // These tests run WITHOUT stored auth state (unauthenticated)
    test.use({ storageState: { cookies: [], origins: [] } })

    test('redirects unauthenticated users to login', async ({ page }) => {
        await page.goto('/dashboard')
        await expect(page).toHaveURL(/.*\/login/)
    })

    test('login page has email and password fields', async ({ page }) => {
        await page.goto('/login')
        await expect(page.locator('input[name="email"]')).toBeVisible()
        await expect(page.locator('input[name="password"]')).toBeVisible()
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
    })

    test('submitting valid credentials redirects to dashboard', async ({ page }) => {
        await page.goto('/login')
        await page.fill('input[name="email"]', 'admin@inventory.dev')
        await page.fill('input[name="password"]', 'Admin@1234')
        await page.getByRole('button', { name: /login/i }).click()

        // Should land on dashboard after login
        await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 })
    })
})
