import { test, expect } from '@playwright/test'

test.describe('Modal', () => {
  test('renders dialog with correct ARIA when open', async ({ page }) => {
    await page.goto('/#ModalBasic')
    const dialog = page.locator('[data-rig-modal]')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('role', 'dialog')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog).toHaveAttribute('aria-label', 'Basic modal')
  })

  test('closes on Escape', async ({ page }) => {
    await page.goto('/#ModalBasic')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-rig-modal-overlay]')).toBeHidden()
  })

  test('closes on overlay click', async ({ page }) => {
    await page.goto('/#ModalBasic')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()
    // Click the overlay at (5, 5) — outside the dialog content
    await page.locator('[data-rig-modal-overlay]').click({ position: { x: 5, y: 5 } })
    await expect(page.locator('[data-rig-modal-overlay]')).toBeHidden()
  })

  test('does NOT close on overlay click when persistent', async ({ page }) => {
    await page.goto('/#ModalPersistent')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()
    await page.locator('[data-rig-modal-overlay]').click({ position: { x: 5, y: 5 } })
    // Should still be visible
    await expect(page.locator('[data-rig-modal]')).toBeVisible()
  })

  test('reopens after being closed', async ({ page }) => {
    await page.goto('/#ModalBasic')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-rig-modal-overlay]')).toBeHidden()
    await page.locator('#open-btn').click()
    await expect(page.locator('[data-rig-modal]')).toBeVisible()
  })

  test('traps focus — Tab wraps from last to first', async ({ page }) => {
    await page.goto('/#ModalFocusTrap')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()

    // Focus the last button
    await page.locator('#last-btn').focus()
    await expect(page.locator('#last-btn')).toBeFocused()

    // Tab should wrap to first focusable element inside modal
    await page.keyboard.press('Tab')
    const activeId = await page.evaluate(() => document.activeElement?.id)
    expect(activeId).toBe('first-btn')
  })

  test('traps focus — Shift+Tab wraps from first to last', async ({ page }) => {
    await page.goto('/#ModalFocusTrap')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()

    await page.locator('#first-btn').focus()
    await expect(page.locator('#first-btn')).toBeFocused()

    await page.keyboard.press('Shift+Tab')
    const activeId = await page.evaluate(() => document.activeElement?.id)
    expect(activeId).toBe('last-btn')
  })

  test('focus does not escape to elements outside modal', async ({ page }) => {
    await page.goto('/#ModalFocusTrap')
    await expect(page.locator('[data-rig-modal]')).toBeVisible()

    // Try tabbing through all elements — focus should never land on #outside-btn
    const focusedIds: string[] = []
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const id = await page.evaluate(() => document.activeElement?.id ?? '')
      focusedIds.push(id)
    }
    expect(focusedIds).not.toContain('outside-btn')
  })
})
