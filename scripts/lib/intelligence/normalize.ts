export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)))
}
