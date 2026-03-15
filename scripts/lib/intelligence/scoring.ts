import type { LibraryRecord, ScoreRecord } from '../health-types'
import type { ScoreWeights } from './weights'
import { normalize } from './normalize'

export function computeScores(lib: LibraryRecord, weights: ScoreWeights): ScoreRecord {
  const size = scoreSize(lib)
  const performance = scorePerformance(lib)
  const accessibility = scoreAccessibility(lib)
  const coverage = scoreCoverage(lib)
  const typescript = scoreTypescript(lib)
  const theming = scoreTheming(lib)
  const dx = scoreDx(lib)
  const ecosystem = scoreEcosystem(lib)

  const composite = Math.round(
    size * weights.size +
      performance * weights.performance +
      accessibility * weights.accessibility +
      coverage * weights.coverage +
      typescript * weights.typescript +
      theming * weights.theming +
      dx * weights.dx +
      ecosystem * weights.ecosystem,
  )

  return {
    size,
    performance,
    accessibility,
    coverage,
    typescript,
    theming,
    dx,
    ecosystem,
    composite,
  }
}

// Size: lower gzip = higher score. 10kb -> 100, 100kb -> 50, 500kb -> 10
function scoreSize(lib: LibraryRecord): number {
  const gzip = lib.size?.fullGzip
  if (!gzip) return 50
  return Math.max(0, Math.min(100, Math.round(100 - (gzip / 1000) * 0.18)))
}

// Performance: lower mount time = higher score. 10ms = 80 score
function scorePerformance(lib: LibraryRecord): number {
  const mt = lib.performance?.mountTimeMs
  if (!mt) return 50
  return Math.max(0, Math.min(100, Math.round(100 - mt * 3)))
}

// Accessibility: lower axe violations = higher score
function scoreAccessibility(lib: LibraryRecord): number {
  const violations = lib.accessibility?.axeViolationsAvg
  if (violations === undefined || violations === null) return 50
  const base = Math.max(0, 100 - violations * 15)
  const wcagBonus =
    lib.accessibility.wcagLevel === 'AAA' ? 5 : lib.accessibility.wcagLevel === 'AA' ? 3 : 0
  return Math.min(100, Math.round(base + wcagBonus))
}

// Coverage: component count + key component presence
function scoreCoverage(lib: LibraryRecord): number {
  if (!lib.coverage) return 50
  const countScore = normalize(lib.coverage.totalComponents, 0, 120)
  const keyComponents = [
    lib.coverage.hasDataGrid,
    lib.coverage.hasDatePicker,
    lib.coverage.hasColorPicker,
    lib.coverage.hasVirtualList,
    lib.coverage.hasCommandPalette,
    lib.coverage.hasDragDrop,
    lib.coverage.hasCharts,
    lib.coverage.hasRichText,
  ].filter(Boolean).length
  const keyScore = (keyComponents / 8) * 100
  return Math.round(countScore * 0.6 + keyScore * 0.4)
}

// TypeScript: strict mode + exports + generics
function scoreTypescript(lib: LibraryRecord): number {
  if (!lib.typescript) return 50
  let score = 0
  if (lib.typescript.strictMode) score += 40
  if (lib.typescript.hasIntelliSense) score += 25
  if (lib.typescript.genericsUsed) score += 20
  score += normalize(lib.typescript.exportedTypeCount || 0, 0, 200) * 0.15
  return Math.min(100, Math.round(score))
}

// Theming: token depth + capabilities
function scoreTheming(lib: LibraryRecord): number {
  if (!lib.theming) return 50
  let score = 0
  score += lib.theming.darkModeNative ? 20 : 0
  score += lib.theming.rtlSupport ? 10 : 0
  score += lib.theming.runtimeSwitching ? 15 : 0
  score += (lib.theming.tokenDepthScore || 0) * 3
  score += (lib.theming.customizabilityScore || 0) * 2.5
  return Math.min(100, Math.round(score))
}

// DX: manual scores
function scoreDx(lib: LibraryRecord): number {
  if (!lib.dx) return 50
  let score = 0
  score += (lib.dx.documentationScore || 0) * 4
  score += lib.dx.playgroundAvailable ? 10 : 0
  score += lib.dx.figmaKitAvailable ? 5 : 0
  score += lib.dx.cliTooling ? 5 : 0
  score += (lib.dx.aiToolingScore || 0) * 2
  score += (lib.dx.migrationPathScore || 0) * 1
  score += (lib.dx.errorMessageScore || 0) * 1
  return Math.min(100, Math.round(score))
}

// Ecosystem: popularity + health signals
function scoreEcosystem(lib: LibraryRecord): number {
  if (!lib.ecosystem) return 50
  const stars = normalize(lib.ecosystem.githubStars || 0, 0, 100000)
  const downloads = normalize(lib.ecosystem.weeklyDownloads || 0, 0, 5000000)
  const freshness =
    (lib.ecosystem.daysSinceLastRelease || 999) < 30
      ? 100
      : lib.ecosystem.daysSinceLastRelease < 90
        ? 70
        : lib.ecosystem.daysSinceLastRelease < 180
          ? 40
          : 20
  const issueHealth = Math.max(0, 100 - normalize(lib.ecosystem.openIssues || 0, 0, 2000))
  return Math.round(stars * 0.3 + downloads * 0.3 + freshness * 0.25 + issueHealth * 0.15)
}
