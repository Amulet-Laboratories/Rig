/**
 * Ecosystem health data — static fixture for the Health & Performance showcases.
 *
 * Regenerate with: node demo/scripts/generate-health-data.mjs
 * Or update these values manually after running vitest --coverage.
 */

export interface PackageStats {
  name: string
  components: number
  testFiles: number
  benchFiles: number
  coverage: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
}

export interface HexTheme {
  name: string
  sizeKB: number
}

export interface BenchmarkEntry {
  name: string
  package: string
}

export interface E2ECategory {
  name: string
  tests: number
}

export interface CoverageThresholds {
  statements: number
  branches: number
  functions: number
  lines: number
}

/** A point-in-time snapshot for historical tracking */
export interface HealthSnapshot {
  date: string
  totalTests: number
  totalFiles: number
  totalComponents: number
  e2eTests: number
  coverage: CoverageThresholds
  hexTotalKB: number
}

export interface HealthData {
  generated: string
  rig: {
    packages: PackageStats[]
    totalTests: number
    totalFiles: number
    totalComponents: number
    e2e: E2ECategory[]
    benchmarks: BenchmarkEntry[]
    coverageThresholds: CoverageThresholds
    overallCoverage: CoverageThresholds
  }
  hex: {
    themes: HexTheme[]
    buildTests: number
    sizeBudgetKB: number
  }
  /** Chronological snapshots for trend tracking */
  history: HealthSnapshot[]
}

export const healthData: HealthData = {
  generated: '2026-03-12T00:00:00.000Z',

  rig: {
    packages: [
      {
        name: 'core',
        components: 24,
        testFiles: 32,
        benchFiles: 3,
        coverage: { statements: 100, branches: 100, functions: 100, lines: 100 },
      },
      {
        name: 'layout',
        components: 9,
        testFiles: 9,
        benchFiles: 2,
        coverage: { statements: 51.04, branches: 44, functions: 55.1, lines: 51.86 },
      },
      {
        name: 'nav',
        components: 7,
        testFiles: 7,
        benchFiles: 0,
        coverage: { statements: 76.97, branches: 60.6, functions: 76.92, lines: 76.76 },
      },
      {
        name: 'editor',
        components: 2,
        testFiles: 2,
        benchFiles: 0,
        coverage: { statements: 81.81, branches: 89.58, functions: 75, lines: 80.48 },
      },
      {
        name: 'lists',
        components: 3,
        testFiles: 3,
        benchFiles: 2,
        coverage: { statements: 71.02, branches: 67.34, functions: 82.25, lines: 71.74 },
      },
      {
        name: 'menus',
        components: 6,
        testFiles: 6,
        benchFiles: 1,
        coverage: { statements: 61.85, branches: 55.42, functions: 81.92, lines: 62.5 },
      },
      {
        name: 'extras',
        components: 6,
        testFiles: 8,
        benchFiles: 0,
        coverage: { statements: 91.37, branches: 89.13, functions: 83.72, lines: 90.52 },
      },
      {
        name: 'shell',
        components: 1,
        testFiles: 2,
        benchFiles: 1,
        coverage: { statements: 89.25, branches: 80.95, functions: 81.81, lines: 90.09 },
      },
    ],
    totalTests: 619,
    totalFiles: 69,
    totalComponents: 58,
    e2e: [
      { name: 'Smoke', tests: 3 },
      { name: 'Theme', tests: 5 },
      { name: 'Accessibility', tests: 1 },
    ],
    benchmarks: [
      { name: 'Button', package: 'core' },
      { name: 'Select', package: 'core' },
      { name: 'Combobox', package: 'core' },
      { name: 'List', package: 'lists' },
      { name: 'TreeView', package: 'lists' },
      { name: 'CommandPalette', package: 'menus' },
      { name: 'SplitView', package: 'layout' },
      { name: 'Modal', package: 'layout' },
      { name: 'IdeShell', package: 'shell' },
    ],
    coverageThresholds: {
      statements: 70,
      branches: 65,
      functions: 70,
      lines: 70,
    },
    overallCoverage: {
      statements: 73.17,
      branches: 68.23,
      functions: 78.65,
      lines: 74.26,
    },
  },

  hex: {
    themes: [
      { name: 'hex', sizeKB: 112.7 },
      { name: 'obelisk', sizeKB: 112.7 },
      { name: 'obelisk-light', sizeKB: 112.7 },
      { name: 'calcite', sizeKB: 112.7 },
      { name: 'calcite-dark', sizeKB: 112.7 },
      { name: 'obsidian', sizeKB: 112.6 },
      { name: 'obsidian-light', sizeKB: 112.6 },
      { name: 'vscode', sizeKB: 113.2 },
      { name: 'vscode-light', sizeKB: 113.9 },
    ],
    buildTests: 25,
    sizeBudgetKB: 150,
  },

  history: [
    {
      date: '2025-03-01',
      totalTests: 214,
      totalFiles: 28,
      totalComponents: 32,
      e2eTests: 0,
      coverage: { statements: 41.2, branches: 33.5, functions: 48.1, lines: 42.0 },
      hexTotalKB: 0,
    },
    {
      date: '2025-06-01',
      totalTests: 412,
      totalFiles: 48,
      totalComponents: 45,
      e2eTests: 5,
      coverage: { statements: 59.3, branches: 51.7, functions: 64.2, lines: 60.1 },
      hexTotalKB: 820,
    },
    {
      date: '2025-09-01',
      totalTests: 510,
      totalFiles: 58,
      totalComponents: 52,
      e2eTests: 7,
      coverage: { statements: 65.4, branches: 57.9, functions: 71.8, lines: 66.2 },
      hexTotalKB: 910,
    },
    {
      date: '2026-01-01',
      totalTests: 580,
      totalFiles: 64,
      totalComponents: 55,
      e2eTests: 8,
      coverage: { statements: 69.8, branches: 63.1, functions: 74.5, lines: 70.1 },
      hexTotalKB: 990,
    },
    {
      date: '2026-03-12',
      totalTests: 619,
      totalFiles: 69,
      totalComponents: 58,
      e2eTests: 9,
      coverage: { statements: 73.17, branches: 68.23, functions: 78.65, lines: 74.26 },
      hexTotalKB: 1015,
    },
  ],
}
