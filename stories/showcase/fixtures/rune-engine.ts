/**
 * Rune Generator — Deterministic SVG rune engine
 * Generates radial/bilateral/free-form rune patterns from a seed string.
 */

export interface RuneConfig {
  seed: string
  segments: number
  layers: number
  symmetry: 'radial' | 'bilateral' | 'none'
  strokeWeight: number
  palette: string[]
  innerRadius: number
  complexity: number
  showGuides: boolean
}

// ---------------------------------------------------------------------------
// Deterministic PRNG from seed string
// ---------------------------------------------------------------------------

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return Math.abs(hash)
}

function createRng(seed: string) {
  let state = hashSeed(seed) || 1
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff
    return state / 0x7fffffff
  }
}

// ---------------------------------------------------------------------------
// SVG Generation
// ---------------------------------------------------------------------------

interface Point {
  x: number
  y: number
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number): Point {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  }
}

function generateRuneSVG(config: RuneConfig, size: number = 400): string {
  const rng = createRng(config.seed)
  const cx = size / 2
  const cy = size / 2
  const maxR = (size / 2) * 0.85
  const innerR = maxR * config.innerRadius
  const paths: string[] = []
  const guideLines: string[] = []

  const segAngle = (Math.PI * 2) / config.segments
  const paletteLen = config.palette.length

  // Guide circles for each layer
  if (config.showGuides) {
    for (let layer = 0; layer <= config.layers; layer++) {
      const r = innerR + ((maxR - innerR) * layer) / config.layers
      guideLines.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.15" />`,
      )
    }
    // Guide radial lines
    for (let seg = 0; seg < config.segments; seg++) {
      const angle = segAngle * seg
      const p = polarToCartesian(cx, cy, maxR, angle)
      guideLines.push(
        `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="currentColor" stroke-width="0.5" opacity="0.15" />`,
      )
    }
  }

  // Generate vertices for each layer/segment
  for (let layer = 0; layer < config.layers; layer++) {
    const r1 = innerR + ((maxR - innerR) * layer) / config.layers
    const r2 = innerR + ((maxR - innerR) * (layer + 1)) / config.layers
    const color = config.palette[layer % paletteLen]

    for (let seg = 0; seg < config.segments; seg++) {
      const a1 = segAngle * seg
      const a2 = segAngle * (seg + 1)

      // Generate complexity-based vertices along the segment
      const points: Point[] = []
      const steps = Math.max(2, config.complexity)

      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const angle = a1 + (a2 - a1) * t
        const rVariance = rng() * 0.3 + 0.7
        const r = r1 + (r2 - r1) * rVariance
        points.push(polarToCartesian(cx, cy, r, angle))
      }

      // Build path
      if (points.length >= 2) {
        let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`
        for (let i = 1; i < points.length; i++) {
          if (rng() > 0.5 && i < points.length - 1) {
            // Quadratic curve
            const cpR = r1 + (r2 - r1) * rng()
            const cpAngle = a1 + (a2 - a1) * ((i - 0.5) / steps)
            const cp = polarToCartesian(cx, cy, cpR, cpAngle)
            d += ` Q ${cp.x.toFixed(2)} ${cp.y.toFixed(2)} ${points[i]!.x.toFixed(2)} ${points[i]!.y.toFixed(2)}`
          } else {
            d += ` L ${points[i]!.x.toFixed(2)} ${points[i]!.y.toFixed(2)}`
          }
        }
        paths.push(
          `<path d="${d}" fill="none" stroke="${color}" stroke-width="${config.strokeWeight}" stroke-linecap="round" stroke-linejoin="round" />`,
        )
      }

      // Connecting arcs between layers
      if (rng() > 0.4) {
        const arcAngle = a1 + segAngle * rng()
        const p1 = polarToCartesian(cx, cy, r1, arcAngle)
        const p2 = polarToCartesian(cx, cy, r2, arcAngle)
        paths.push(
          `<line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}" x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}" stroke="${color}" stroke-width="${config.strokeWeight * 0.7}" stroke-linecap="round" />`,
        )
      }

      // Decorative dots at intersections
      if (rng() > 0.6) {
        const dotR = r1 + (r2 - r1) * rng()
        const dotAngle = a1 + segAngle * rng()
        const dot = polarToCartesian(cx, cy, dotR, dotAngle)
        paths.push(
          `<circle cx="${dot.x.toFixed(2)}" cy="${dot.y.toFixed(2)}" r="${config.strokeWeight * 1.2}" fill="${color}" />`,
        )
      }
    }

    // Mirror for bilateral symmetry
    if (config.symmetry === 'bilateral') {
      const mirrored = paths.slice(-config.segments * 3).map((p) =>
        p.replace(/x="([^"]+)"/g, (_, x) => `x="${(size - Number.parseFloat(x)).toFixed(2)}"`)
          .replace(/x1="([^"]+)"/g, (_, x) => `x1="${(size - Number.parseFloat(x)).toFixed(2)}"`)
          .replace(/x2="([^"]+)"/g, (_, x) => `x2="${(size - Number.parseFloat(x)).toFixed(2)}"`)
          .replace(/cx="([^"]+)"/g, (_, x) => {
            const val = Number.parseFloat(x)
            return val === cx ? `cx="${cx}"` : `cx="${(size - val).toFixed(2)}"`
          }),
      )
      paths.push(...mirrored)
    }
  }

  // Inner ring decoration
  const innerColor = config.palette[0]
  paths.push(
    `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="${innerColor}" stroke-width="${config.strokeWeight}" />`,
  )

  // Center dot
  paths.push(
    `<circle cx="${cx}" cy="${cy}" r="${config.strokeWeight * 2}" fill="${innerColor}" />`,
  )

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    ...guideLines,
    ...paths,
    '</svg>',
  ].join('\n')
}

export { generateRuneSVG }
