/**
 * Append an alpha channel to a hex color string.
 *
 * ```ts
 * withAlpha('#22c55e', 0.12) // '#22c55e1f'
 * ```
 */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  return hex + a.toString(16).padStart(2, '0')
}

/**
 * Read a CSS custom property value from the document root (or a given element).
 * Returns the trimmed string value, or the fallback if the property is unset.
 *
 * ```ts
 * resolveToken('--color-success')          // '#22c55e'
 * resolveToken('--color-missing', '#000')  // '#000'
 * ```
 */
export function resolveToken(property: string, fallback = '', el?: Element): string {
  if (typeof window === 'undefined') return fallback
  const target = el ?? document.documentElement
  const value = getComputedStyle(target).getPropertyValue(property).trim()
  return value || fallback
}

/**
 * Convenience: resolve a CSS custom property and apply alpha in one call.
 *
 * ```ts
 * resolveTokenWithAlpha('--color-success', 0.12) // '#22c55e1f'
 * ```
 */
export function resolveTokenWithAlpha(
  property: string,
  alpha: number,
  fallback = '',
  el?: Element,
): string {
  const hex = resolveToken(property, fallback, el)
  return hex ? withAlpha(hex, alpha) : fallback
}
