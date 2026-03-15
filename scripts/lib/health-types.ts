// ── Health Manifest Types ────────────────────────────────────────────
// Extracted from demo/src/lab/types.ts for use by the health pipeline.
// These types are consumed by generate-health-manifest.mjs (at runtime
// via JSDoc), score-computer.ts, and collect-intelligence.ts.

export interface HealthManifest {
  generated: string
  version: number
  summary: ManifestSummary
  components: ComponentHealth[]
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
  /** TypeScript strictness signals */
  tsStrictness: TsStrictnessMetrics
  /** Documentation coverage */
  documentation: DocumentationMetrics
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

export interface HexMetrics {
  hasStyles: boolean
  selectors: string[]
}

export interface TsStrictnessMetrics {
  isStrict: boolean
  anyCasts: number
  anyTypes: number
  tsIgnores: number
  tsExpectErrors: number
  nonNullAssertions: number
  totalIssues: number
}

export interface DocumentationMetrics {
  jsdocCount: number
  hasPropsDoc: boolean
  hasEmitsDoc: boolean
  hasParamDocs: boolean
  hasReturnDocs: boolean
  hasExportDoc: boolean
  documentedFeatures: number
  docCoverageRatio: number
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

// ── Intelligence types ───────────────────────────────────────────────

export interface IntelligenceManifest {
  generated: string
  rig: RigSnapshot
  libraries: LibraryRecord[]
}

export interface RigSnapshot {
  componentCount: number
  packageCount: number
  testCoverage: number
  bundleSize: BundleStats
  a11yScore: number
}

export interface BundleStats {
  fullGzip: number
  fullMinified: number
  cssGzip: number
  jsGzip: number
}

export interface LibraryRecord {
  id: string
  name: string
  framework: 'vue' | 'react' | 'svelte' | 'agnostic'
  paradigm: 'styled' | 'headless' | 'hybrid'
  url: string
  npm: string
  github: string
  ecosystem: EcosystemStats
  size: SizeStats
  coverage: CoverageStats
  performance: PerformanceStats
  accessibility: AccessibilityStats
  typescript: TypescriptStats
  theming: ThemingStats
  dx: DxStats
  rigComparison: RigComparisonStats
  scores: ScoreRecord
  collectedAt: string
  collectionMethod: 'auto' | 'manual' | 'partial'
  notes: string
}

export interface EcosystemStats {
  githubStars: number
  weeklyDownloads: number
  monthlyDownloads: number
  releaseCount: number
  daysSinceLastRelease: number
  openIssues: number
  contributorCount: number
  ageInDays: number
  license: string
}

export interface SizeStats {
  fullGzip: number
  fullMinified: number
  perComponentAvgGzip: number
  cssGzip: number
  jsGzip: number
  treeShakenButtonGzip: number
  treeShakenInputGzip: number
}

export interface CoverageStats {
  totalComponents: number
  primitiveCount: number
  compositeCount: number
  formComponents: number
  dataDisplayComponents: number
  layoutComponents: number
  feedbackComponents: number
  navigationComponents: number
  hasDataGrid: boolean
  hasDatePicker: boolean
  hasColorPicker: boolean
  hasVirtualList: boolean
  hasCommandPalette: boolean
  hasDragDrop: boolean
  hasCharts: boolean
  hasRichText: boolean
}

export interface PerformanceStats {
  mountTimeMs: number
  mountTimeWarmMs: number
  rerenderTimeMs: number
  timeToInteractiveMs: number
  memoryFootprintMb: number
  fps100Components: number
}

export interface AccessibilityStats {
  axeViolationsButton: number
  axeViolationsInput: number
  axeViolationsModal: number
  axeViolationsTable: number
  axeViolationsAvg: number
  keyboardNavScore: number
  wcagLevel: 'A' | 'AA' | 'AAA' | 'unknown'
  ariaPatternsCovered: number
}

export interface TypescriptStats {
  strictMode: boolean
  exportedTypeCount: number
  avgPropsPerComponent: number
  hasIntelliSense: boolean
  genericsUsed: boolean
}

export interface ThemingStats {
  cssVariableCount: number
  darkModeNative: boolean
  rtlSupport: boolean
  runtimeSwitching: boolean
  tokenDepthScore: number
  customizabilityScore: number
}

export interface DxStats {
  documentationScore: number
  playgroundAvailable: boolean
  figmaKitAvailable: boolean
  cliTooling: boolean
  aiToolingScore: number
  migrationPathScore: number
  errorMessageScore: number
}

export interface RigComparisonStats {
  componentsRigHas: string[]
  componentsLibraryOnlyHas: string[]
  componentsRigOnlyHas: string[]
  featureParityPct: number
  apiSimilarityScore: number
}

export interface ScoreRecord {
  size: number
  performance: number
  accessibility: number
  coverage: number
  typescript: number
  theming: number
  dx: number
  ecosystem: number
  composite: number
}
