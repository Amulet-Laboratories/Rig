import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaybackControls from './PlaybackControls.vue'

describe('PlaybackControls mount', () => {
  bench('default mount', () => {
    const w = mount(PlaybackControls)
    w.unmount()
  })
})
