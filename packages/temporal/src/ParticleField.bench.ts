import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import ParticleField from './ParticleField.vue'

describe('ParticleField mount', () => {
  bench('default mount', () => {
    const w = mount(ParticleField)
    w.unmount()
  })
})
