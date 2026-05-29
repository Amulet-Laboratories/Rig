import { describe, bench } from 'vitest'
import { ref } from 'vue'
import { useMediaPlayback } from './useMediaPlayback'

describe('useMediaPlayback', () => {
  bench('invoke useMediaPlayback', () => {
    const mediaRef = ref<HTMLMediaElement | null>(null)
    const playWhen = ref(false)
    useMediaPlayback(mediaRef, { playWhen })
  })
})
