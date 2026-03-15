export const SCORE_WEIGHTS = {
  size: 0.1,
  performance: 0.15,
  accessibility: 0.2,
  coverage: 0.15,
  typescript: 0.1,
  theming: 0.1,
  dx: 0.1,
  ecosystem: 0.1,
} as const

export type ScoreWeights = typeof SCORE_WEIGHTS
