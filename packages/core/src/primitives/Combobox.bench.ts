import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Combobox from './Combobox.vue'
import type { ComboboxOption } from './Combobox.vue'

function generateOptions(count: number): ComboboxOption[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `opt-${i}`,
    label: `Option ${i}`,
  }))
}

describe('Combobox mount', () => {
  bench('10 options', () => {
    const w = mount(Combobox, { props: { options: generateOptions(10) } })
    w.unmount()
  })

  bench('100 options', () => {
    const w = mount(Combobox, { props: { options: generateOptions(100) } })
    w.unmount()
  })

  bench('1000 options', () => {
    const w = mount(Combobox, { props: { options: generateOptions(1000) } })
    w.unmount()
  })
})

describe('Combobox filtering', () => {
  const options = generateOptions(500)

  bench('filter by input value', async () => {
    const w = mount(Combobox, { props: { options } })
    await w.find('input').setValue('Option 25')
    w.unmount()
  })
})
