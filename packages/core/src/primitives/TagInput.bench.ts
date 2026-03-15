import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import TagInput from './TagInput.vue'

describe('TagInput mount', () => {
  bench('default mount', () => {
    const w = mount(TagInput, { props: { modelValue: [] as string[] } })
    w.unmount()
  })
})
