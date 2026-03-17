/**
 * Generates Netlify security headers configuration.
 * Override specific directives by passing a partial CSP object.
 */

export interface CspOverrides {
  'default-src'?: string
  'script-src'?: string
  'style-src'?: string
  'img-src'?: string
  'font-src'?: string
  'connect-src'?: string
  'frame-ancestors'?: string
  'base-uri'?: string
  'form-action'?: string
}

const defaultCsp: Record<string, string> = {
  'default-src': "'self'",
  'script-src': "'self'",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data:",
  'font-src': "'self'",
  'connect-src': "'self'",
  'frame-ancestors': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'",
}

export function buildCsp(overrides: CspOverrides = {}): string {
  const merged = { ...defaultCsp, ...overrides }
  return Object.entries(merged)
    .map(([key, value]) => `${key} ${value}`)
    .join('; ')
}

export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'off',
}
