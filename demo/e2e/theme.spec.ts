import { test, expect } from '@playwright/test'

/**
 * Theme switcher E2E tests — verifies theme × mode independence,
 * CSS hot-swap, and persistence across page load.
 */

test.describe('Theme switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/anchor-dashboard')
    await expect(page.locator('.demo-main')).toBeVisible()
  })

  test('mode toggle switches between light and dark', async ({ page }) => {
    // Click Light mode
    await page.click('.demo-mode-btn:has-text("Light")')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')

    // Click Dark mode
    await page.click('.demo-mode-btn:has-text("Dark")')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark')
  })

  test('theme picker changes active theme', async ({ page }) => {
    // Switch to Obsidian
    await page.click('.demo-theme-btn:has-text("Obsidian")')
    const obsidianActive = page.locator('.demo-theme-btn-active:has-text("Obsidian")')
    await expect(obsidianActive).toBeVisible()

    // The stylesheet link should have changed
    const link = page.locator('#hex-theme-stylesheet')
    const href = await link.getAttribute('href')
    expect(href).toContain('obsidian')
  })

  test('all four themes are selectable', async ({ page }) => {
    const themes = ['Obelisk', 'Calcite', 'Obsidian', 'VS Code']

    for (const name of themes) {
      await page.click(`.demo-theme-btn:has-text("${name}")`)
      const active = page.locator(`.demo-theme-btn-active:has-text("${name}")`)
      await expect(active).toBeVisible()
    }
  })

  test('theme and mode are independent', async ({ page }) => {
    // Set Obsidian + Light
    await page.click('.demo-theme-btn:has-text("Obsidian")')
    await page.click('.demo-mode-btn:has-text("Light")')

    await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')
    const link = page.locator('#hex-theme-stylesheet')
    const href = await link.getAttribute('href')
    expect(href).toContain('obsidian')
    expect(href).toContain('light')

    // Switch to Calcite — should keep light mode
    await page.click('.demo-theme-btn:has-text("Calcite")')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')
  })

  test('theme persists across page reload', async ({ page }) => {
    // Set VS Code theme
    await page.click('.demo-theme-btn:has-text("VS Code")')
    await page.click('.demo-mode-btn:has-text("Light")')

    // Reload
    await page.reload()
    await expect(page.locator('.demo-main')).toBeVisible()

    // VS Code should still be active
    const active = page.locator('.demo-theme-btn-active:has-text("VS Code")')
    await expect(active).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'light')
  })
})
