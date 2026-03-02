import { chromium, type FullConfig } from '@playwright/test'

/**
 * Playwright global setup — authenticates once and saves storage state
 * for reuse across all authenticated test specs.
 *
 * Credentials come from the seed script (prisma/seed.ts).
 */
async function globalSetup(config: FullConfig) {
    const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:3000'

    const browser = await chromium.launch()
    const page = await browser.newPage()

    // Navigate to login
    await page.goto(`${baseURL}/login`)

    // Fill in seeded admin credentials
    await page.fill('input[name="email"]', 'admin@inventory.dev')
    await page.fill('input[name="password"]', 'Admin@1234')

    // Submit the form
    await page.getByRole('button', { name: /login/i }).click()

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 15000 })

    // Save authenticated state
    await page.context().storageState({ path: 'e2e/.auth/state.json' })

    await browser.close()
}

export default globalSetup
