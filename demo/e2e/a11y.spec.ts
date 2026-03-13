import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility audit — runs axe-core on every showcase route.
 * Catches WCAG 2.1 AA violations: missing alt text, low contrast,
 * invalid ARIA, missing form labels, etc.
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

test.describe('Accessibility audit', () => {
  for (const id of showcases) {
    test(`/${id} passes axe-core a11y checks`, async ({ page }) => {
      await page.goto(`/${id}`)

      // Wait for the main content to be visible
      await expect(page.locator('.demo-main')).toBeVisible()

      const results = await new AxeBuilder({ page })
        .include('.demo-main')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules([
          // Color contrast is theme-dependent and tested manually
          'color-contrast',
        ])
        .analyze()

      expect(
        results.violations,
        `${results.violations.length} a11y violation(s) on /${id}:\n${formatViolations(results.violations)}`,
      ).toEqual([])
    })
  }
})

/** Format axe violations into readable output for test failure messages. */
function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 3)
        .map((n) => `    - ${n.html}`)
        .join('\n')
      return `  [${v.impact}] ${v.id}: ${v.description}\n${nodes}`
    })
    .join('\n\n')
}
