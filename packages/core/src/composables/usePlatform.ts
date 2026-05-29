/**
 * Detect whether the current platform is macOS / iOS.
 *
 * Uses the modern `navigator.userAgentData.platform` API when available,
 * falling back to the (deprecated) `navigator.userAgent` string.
 *
 * SSR-safe — returns `false` when `navigator` is not available.
 */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false

  // Modern API (Chromium 93+)
  interface NavigatorUA {
    userAgentData?: { platform?: string }
  }
  const uaData = (navigator as NavigatorUA).userAgentData
  if (uaData?.platform) {
    return /mac/i.test(uaData.platform)
  }

  // Fallback — still works in Safari / Firefox
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
}

/**
 * Composable that exposes platform detection for rendering platform-aware UI
 * (e.g. showing `⌘` vs `Ctrl` in keyboard hints).
 *
 * SSR-safe — `isMac` is `false` on the server.
 */
export function usePlatform() {
  return { isMac: isMacPlatform() }
}
