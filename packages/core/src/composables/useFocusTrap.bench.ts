import { describe, bench } from 'vitest'
import { ref } from 'vue'
import { useFocusTrap } from './useFocusTrap'

const el = ref<HTMLElement | null>(null)

describe('useFocusTrap', () => {
  bench('invoke useFocusTrap', () => {
    useFocusTrap({ containerRef: el })
  })
})
