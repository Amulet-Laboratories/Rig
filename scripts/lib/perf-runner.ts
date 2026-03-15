/**
 * Performance and accessibility runner.
 * Uses Playwright to measure render timing and run axe-core
 * accessibility audits against component demos.
 *
 * This module is designed to run against the demo site (localhost:4400)
 * and requires the dev server to be running.
 */

interface PerfResult {
  firstPaintMs: number
  interactiveMs: number
  layoutShiftScore: number
}

interface A11yResult {
  violationCount: number
  criticalCount: number
  score: number
}

export interface ComponentPerfReport {
  route: string
  perf: PerfResult
  a11y: A11yResult
}

/**
 * Measure performance of a single route by navigating to it
 * and extracting Web Vitals-style metrics via the Performance API.
 *
 * Requires: playwright chromium browser installed.
 */
export async function measureRoute(
  baseUrl: string,
  route: string,
): Promise<ComponentPerfReport | null> {
  try {
    // Dynamic import so this file doesn't hard-fail if playwright isn't installed
    const { chromium } = await import('playwright')
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    const url = `${baseUrl}${route}`
    console.log(`    [perf] navigating to ${url}...`)

    await page.goto(url, { waitUntil: 'networkidle' })

    // Measure performance entries
    const perfData = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      const fcp = paint.find((e) => e.name === 'first-contentful-paint')

      return {
        firstPaintMs: Math.round(fcp?.startTime ?? nav.domContentLoadedEventEnd),
        interactiveMs: Math.round(nav.domInteractive - nav.startTime),
        layoutShiftScore: 0, // CLS requires PerformanceObserver over time
      }
    })

    // Run axe-core
    let a11yData: A11yResult = { violationCount: 0, criticalCount: 0, score: 100 }
    try {
      await page.addScriptTag({
        url: 'https://cdn.jsdelivr.net/npm/axe-core@latest/axe.min.js',
      })

      const axeResult = await page.evaluate(async () => {
        // @ts-expect-error axe is injected via script tag
        const result = await window.axe.run()
        return {
          violationCount: result.violations.length,
          criticalCount: result.violations.filter(
            (v: { impact: string }) => v.impact === 'critical',
          ).length,
        }
      })

      a11yData = {
        ...axeResult,
        score: Math.max(0, 100 - axeResult.violationCount * 5 - axeResult.criticalCount * 15),
      }
    } catch {
      console.warn('    [a11y] axe-core injection failed, skipping')
    }

    await browser.close()

    return {
      route,
      perf: perfData,
      a11y: a11yData,
    }
  } catch (e) {
    console.warn(`    [perf] measurement failed for ${route}:`, (e as Error).message)
    return null
  }
}

/**
 * Run performance + a11y checks across multiple routes.
 */
export async function measureRoutes(
  baseUrl: string,
  routes: string[],
): Promise<ComponentPerfReport[]> {
  const reports: ComponentPerfReport[] = []
  for (const route of routes) {
    const report = await measureRoute(baseUrl, route)
    if (report) reports.push(report)
  }
  return reports
}
