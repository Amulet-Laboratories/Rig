import { test, expect } from '@playwright/test'

/**
 * Smoke tests — every showcase route loads and renders without errors.
 * Catches broken imports, missing components, and runtime crashes.
 */

const showcases = [
  'anchor-dashboard',
  'bestiary-compendium',
  'calendar',
  'character-quiz',
  'flight-tracker',
  'kanban-board',
  'lighthouse',
  'messaging-app',
  'mock-vscode',
  'preferences',
  'recipe-builder',
  'rune-generator',
  'signal-feed',
  'theme-grid',
  'tide-radio',
  'token-reference',
  'waypoint',
  'accessibility',
  'performance',
]

test.describe('Showcase smoke tests', () => {
  for (const id of showcases) {
    test(`/${id} loads without errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (err) => errors.push(err.message))

      await page.goto(`/${id}`)

      // Wait for the main content area to exist
      await expect(page.locator('.demo-main')).toBeVisible()

      // The sidebar should be present with the nav
      await expect(page.locator('.demo-sidebar')).toBeVisible()

      // The active nav link should match the current showcase
      const activeLink = page.locator('.demo-nav-active')
      await expect(activeLink).toBeVisible()

      // No JS errors during load
      expect(errors).toEqual([])
    })
  }
})

test.describe('Navigation', () => {
  test('sidebar links navigate between showcases', async ({ page }) => {
    await page.goto('/')

    // Click a different showcase
    await page.click('.demo-nav-link:has-text("Calendar")')
    await expect(page).toHaveURL('/calendar')

    // Click another
    await page.click('.demo-nav-link:has-text("Kanban Board")')
    await expect(page).toHaveURL('/kanban-board')
  })

  test('root redirects to anchor-dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/anchor-dashboard')
  })
})
