export interface HealthManifest {
  generated: string
  version: number
  summary: ManifestSummary
  components: ComponentHealth[]
  showcases: ShowcaseHealth[]
  diagnostics: ShowcaseHealth[]
}

export interface ShowcaseHealth {
  name: string
  id: string
  source: string
  componentsUsed: string[]
  componentCount: number
  packagesUsed: string[]
  packageCount: number
  loc: number
  hasE2e: boolean
  /** Average health score of imported Rig components (0-100) */
  avgComponentScore: number
  /** Percentage of total library components this showcase exercises */
  coverageReach: number
  /** Percentage of used components that have unit tests */
  testedRatio: number
  /** Average statement coverage of used components */
  avgCoverage: number
  /** Count of used components with a11y attributes */
  a11yCount: number
  /** Percentage of available packages used (0-100) */
  packageBreadth: number
}

export interface ManifestSummary {
  totalComponents: number
  totalComposables: number
  totalTests: number
  totalPassed: number
  totalFailed: number
  overallCoverage: CoverageMetrics | null
  averageScore: number
  gradeDistribution: Record<Grade, number>
  packages: PackageSummary[]
  scoreDistribution: ScoreBucket[]
  dimensionFill: Record<string, { filled: number; total: number }>
  totalGaps: number
  avgGapsPerComponent: number
  totalLoc: number
  avgLoc: number
  /** Average test depth ratio across all components with tests (0..1) */
  avgTestDepth: number
}

export interface ScoreBucket {
  min: number
  max: number
  count: number
}

export interface PackageSummary {
  name: string
  count: number
  avgScore: number
}

export interface ComponentHealth {
  name: string
  package: string
  type: 'component' | 'composable'
  source: string
  sourceMetrics: SourceMetrics
  tests: TestMetrics | null
  coverage: CoverageMetrics | null
  benchmark: BenchmarkMetrics
  a11y: A11yMetrics | null
  /** Runtime axe-core results from comparison benchmarks */
  axeRuntime: AxeRuntimeMetrics | null
  /** Interaction test quality signals from test file scanning */
  interactionTests: InteractionTestMetrics
  /** Test depth ratio (0..1): test count / expected tests based on complexity */
  testDepth: number
  story: StoryMetrics
  hexCoverage: HexMetrics
  score: number
  grade: Grade
  gaps: GapItem[]
  nextGrade: NextGradeInfo
}

export interface SourceMetrics {
  loc: number
  fileSize: number
  propCount: number
  emitCount: number
  depCount: number
}

export interface GapItem {
  dimension: string
  label: string
  impact: number
}

export interface NextGradeInfo {
  current: Grade
  target: Grade
  pointsNeeded: number
  totalGapImpact: number
}

export interface TestMetrics {
  total: number
  passed: number
  failed: number
  duration: number
  names: TestEntry[]
}

export interface TestEntry {
  name: string
  status: 'passed' | 'failed'
  duration: number
}

export interface CoverageMetrics {
  statements: number
  branches: number
  functions: number
  lines: number
}

export interface BenchmarkMetrics {
  available: boolean
  results: BenchmarkResult[]
}

export interface BenchmarkResult {
  name: string
  hz: number
  mean: number
  p99: number
}

export interface A11yMetrics {
  hasAriaAttributes: boolean
  hasKeyboardNav: boolean
  hasFocusManagement: boolean
  hasReducedMotion: boolean
  patterns: string[]
}

export interface AxeRuntimeMetrics {
  violations: number
  passes: number
  score: number
}

export interface InteractionTestMetrics {
  hasKeyboardTests: boolean
  hasFocusTests: boolean
  hasEmitTests: boolean
  hasSlotTests: boolean
  hasReactivityTests: boolean
  interactionPatterns: string[]
}

export interface StoryMetrics {
  exists: boolean
  path: string | null
  variants: number
}

export interface HexMetrics {
  hasStyles: boolean
  selectors: string[]
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

export const GRADE_COLORS: Record<Grade, string> = {
  A: '#4ade80',
  B: '#a3e635',
  C: '#facc15',
  D: '#fb923c',
  F: '#f87171',
}

export const GRADE_BG: Record<Grade, string> = {
  A: 'rgba(74, 222, 128, 0.12)',
  B: 'rgba(163, 230, 53, 0.12)',
  C: 'rgba(250, 204, 21, 0.12)',
  D: 'rgba(251, 146, 60, 0.12)',
  F: 'rgba(248, 113, 113, 0.12)',
}

// ── History types ────────────────────────────────────────────────────

export interface HealthHistory {
  snapshots: HistorySnapshot[]
}

export interface HistorySnapshot {
  timestamp: string
  averageScore: number
  gradeDistribution: Record<Grade, number>
  totalTests: number
  totalPassed: number
  totalFailed: number
  totalComponents: number
  totalComposables: number
  totalGaps: number
  totalLoc: number
  overallCoverage: CoverageMetrics | null
  dimensionFill: Record<string, number>
  packages: { name: string; avgScore: number }[]
  componentScores: Record<string, number>
}

// ── Competitor types ─────────────────────────────────────────────────

export interface CompetitorMatrix {
  competitors: string[]
  matrix: CompetitorRow[]
}

export interface CompetitorRow {
  name: string
  package: string
  type: 'component' | 'composable'
  has: number[]
}

// ── Comparison benchmark types ───────────────────────────────────────

export interface ComparisonOutput {
  timestamp: string
  iterations: number
  comparisons: ComparisonResult[]
  /** Summary stats across all benchmark results */
  stats?: {
    totalResults: number
    reliableResults: number
    warningResults: number
    errorResults: number
  }
}

export interface ComparisonResult {
  rigComponent: string
  rigPackage: string
  results: MountResult[]
}

export interface MountResult {
  lib: string
  libName: string
  componentName: string
  mountMedianMs: number
  mountP95Ms: number
  unmountMedianMs: number
  domNodeCount: number
  a11yViolations: number
  a11yPasses: number
  a11yScore: number
  /** Whether this result represents a clean, meaningful render */
  reliable: boolean
  error?: string
  renderWarning?: string
}

// ── Static analysis types ────────────────────────────────────────────

export interface StaticAnalysisOutput {
  timestamp: string
  packages: PackageAnalysis[]
}

export interface PackageAnalysis {
  key: string
  name: string
  version: string
  installSizeBytes: number
  installSizeFormatted: string
  directDeps: number
  peerDeps: number
  hasTypeScript: boolean
  estimatedComponents: number
  isVueNative: boolean
  framework: 'vue' | 'react'
}
