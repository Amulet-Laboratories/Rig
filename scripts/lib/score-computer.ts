/**
 * Composite score computer — reads raw data from the intelligence
 * manifest and computes weighted scores using the scoring module.
 */

import type { LibraryRecord, ScoreRecord } from './health-types'
import { computeScores } from './intelligence/scoring'
import { SCORE_WEIGHTS } from './intelligence/weights'

/**
 * Compute scores for all libraries in the manifest.
 * Returns a map of library ID → ScoreRecord.
 */
export function computeAllScores(
  libraries: Record<string, LibraryRecord>,
): Record<string, ScoreRecord> {
  const result: Record<string, ScoreRecord> = {}

  for (const [id, lib] of Object.entries(libraries)) {
    result[id] = computeScores(lib, SCORE_WEIGHTS)
  }

  return result
}

/**
 * Merge computed scores back into library records (mutates in-place).
 */
export function applyScores(
  libraries: Record<string, LibraryRecord>,
  scores: Record<string, ScoreRecord>,
): void {
  for (const [id, score] of Object.entries(scores)) {
    if (libraries[id]) {
      libraries[id].scores = score
    }
  }
}
