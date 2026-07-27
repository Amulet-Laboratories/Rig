/**
 * Offline, palette-matched image placeholder for demo showcase sites.
 *
 * The demos hotlink Unsplash photos; some are dead (404) or hotlink-blocked and
 * render as broken boxes. Rather than ship broken imagery, any failed image (or
 * an intentionally-blanked one) falls back to a clean SVG tile in the demo's own
 * palette, labelled with the product/subject name. Fully self-contained — no
 * network, no external asset — so it can never itself break.
 */

export interface PlaceholderColors {
  /** Tile background (use a subtle surface tint of the demo palette). */
  bg?: string
  /** Label text colour (a muted foreground). */
  fg?: string
  /** Thin accent bar along the top. */
  accent?: string
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;',
  )
}

/** Wrap a label onto up to 3 centred lines of ~18 chars for the tile. */
function wrap(label: string): string[] {
  const words = label.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    if (`${line} ${w}`.trim().length > 18 && line) {
      lines.push(line)
      line = w
    } else {
      line = `${line} ${w}`.trim()
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 3)
}

/**
 * Build an `data:image/svg+xml` URI for a labelled placeholder tile.
 * Square 400×400 (object-fit handles the container's real aspect ratio).
 */
export function demoPlaceholder(label: string, colors: PlaceholderColors = {}): string {
  const bg = colors.bg ?? '#e9e6e1'
  const fg = colors.fg ?? '#8a8378'
  const accent = colors.accent ?? fg
  const lines = wrap(label || 'Image')
  const lineHeight = 26
  const startY = 200 - ((lines.length - 1) * lineHeight) / 2
  const tspans = lines
    .map(
      (l, i) =>
        `<text x="200" y="${startY + i * lineHeight}" fill="${fg}" font-family="system-ui, sans-serif" font-size="19" font-weight="600" text-anchor="middle" dominant-baseline="middle">${escapeXml(l)}</text>`,
    )
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="${bg}"/>` +
    `<rect width="400" height="5" fill="${accent}"/>` +
    `<circle cx="200" cy="${startY - 46}" r="17" fill="none" stroke="${fg}" stroke-width="2" opacity="0.55"/>` +
    `<circle cx="194" cy="${startY - 52}" r="4" fill="${fg}" opacity="0.55"/>` +
    `<path d="M186 ${startY - 36} l10 -12 l7 8 l6 -6 l9 10 z" fill="${fg}" opacity="0.55"/>${
      tspans
    }</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * `@error` handler: swap a failed <img> for the labelled placeholder.
 * Clears its own handler first to avoid a reload loop.
 */
export function onDemoImgError(event: Event, label: string, colors?: PlaceholderColors): void {
  const img = event.target as HTMLImageElement | null
  if (!img) return
  img.onerror = null
  img.src = demoPlaceholder(label, colors)
}

/**
 * App-wide safety net: any <img> that fails to load (dead/hotlink-blocked
 * Unsplash URL, etc.) is swapped for a placeholder tinted from the nearest
 * theme's own `--color-*` tokens, labelled with the image's alt text. One
 * registration covers every demo without touching each <img>. The `error`
 * event doesn't bubble, so we listen in the capture phase.
 */
export function installGlobalImageFallback(): void {
  if (typeof document === 'undefined') return
  document.addEventListener(
    'error',
    (event) => {
      const img = event.target
      if (!(img instanceof HTMLImageElement)) return
      if (img.dataset.phApplied || img.src.startsWith('data:')) return
      img.dataset.phApplied = '1'
      const cs = getComputedStyle(img)
      const tok = (name: string, fallback: string): string => {
        const v = cs.getPropertyValue(name).trim()
        return v || fallback
      }
      img.onerror = null
      img.src = demoPlaceholder(img.alt || 'Image', {
        bg: tok('--color-muted', tok('--color-card', '#e9e6e1')),
        fg: tok('--color-muted-foreground', tok('--color-foreground', '#8a8378')),
        accent: tok('--color-primary', tok('--color-accent', '#b0a99c')),
      })
    },
    true,
  )
}
