// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { useZoom } from './useZoom'
import { effectScope, type EffectScope } from 'vue'

describe('useZoom', () => {
  let scope: EffectScope

  beforeEach(() => {
    localStorage.clear()
    scope = effectScope()
  })

  it('returns zoomLevel ref with default value', () => {
    scope.run(() => {
      const { zoomLevel } = useZoom({ defaultZoom: 0.9, storageKey: 'test:zoom' })
      expect(zoomLevel.value).toBe(0.9)
    })
    scope.stop()
  })

  it('loads persisted zoom from localStorage', () => {
    localStorage.setItem('test:zoom', '1.2')
    scope.run(() => {
      const { zoomLevel } = useZoom({ storageKey: 'test:zoom' })
      expect(zoomLevel.value).toBe(1.2)
    })
    scope.stop()
  })

  it('defaults to 1.0 when no options provided', () => {
    scope.run(() => {
      const { zoomLevel } = useZoom({ storageKey: 'test:zoom2' })
      expect(zoomLevel.value).toBe(1.0)
    })
    scope.stop()
  })

  it('exposes zoomIn, zoomOut, zoomReset methods', () => {
    scope.run(() => {
      const result = useZoom({ storageKey: 'test:zoom3' })
      expect(typeof result.zoomIn).toBe('function')
      expect(typeof result.zoomOut).toBe('function')
      expect(typeof result.zoomReset).toBe('function')
    })
    scope.stop()
  })
})
