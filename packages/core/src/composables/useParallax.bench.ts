import { describe, bench } from 'vitest'
import { useParallax } from './useParallax'

describe('useParallax', () => {
  bench('invoke useParallax', () => {
    useParallax({
      layers: [
        { id: 'bg', src: '/bg.webp', depth: 0 },
        { id: 'fg', src: '/fg.webp', depth: 0.8 },
      ],
    })
  })
})
