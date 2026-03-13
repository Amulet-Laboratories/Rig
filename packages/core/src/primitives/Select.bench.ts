import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './Select.vue'
import type { SelectOption } from '../types'

function generateOptions(count: number): SelectOption[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `opt-${i}`,
    label: `Option ${i}`,
  }))
}

describe('Select mount', () => {
  bench('10 options', () => {
    const w = mount(Select, { props: { options: generateOptions(10) } })
    w.unmount()
  })

  bench('100 options', () => {
    const w = mount(Select, { props: { options: generateOptions(100) } })
    w.unmount()
  })

  bench('1000 options', () => {
    const w = mount(Select, { props: { options: generateOptions(1000) } })
    w.unmount()
  })
})

describe('Select option change', () => {
  const options = generateOptions(100)

  bench('change selected option', async () => {
    const w = mount(Select, { props: { options, modelValue: 'opt-0' } })
    await w.setProps({ modelValue: 'opt-50' })
    w.unmount()
  })
})
