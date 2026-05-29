import { describe, bench } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from './Accordion.vue'

function makeSlotContent(count: number) {
  const items = Array.from({ length: count }, (_, i) => `item-${i}`)
  const template = items
    .map(
      (id) =>
        `<div>
          <button data-rig-accordion-trigger @click="toggle('${id}')"
            :id="headerId('${id}')" :aria-expanded="isOpen('${id}')"
            :aria-controls="panelId('${id}')">
            Header ${id}
          </button>
          <div v-if="isOpen('${id}')" :id="panelId('${id}')" role="region"
            :aria-labelledby="headerId('${id}')">
            Content for ${id}
          </div>
        </div>`,
    )
    .join('\n')

  return {
    default: `<template #default="{ isOpen, toggle, headerId, panelId }">${template}</template>`,
  }
}

describe('Accordion mount', () => {
  bench('single mode, 3 items', () => {
    const w = mount(Accordion, {
      props: { modelValue: '' },
      slots: makeSlotContent(3),
    })
    w.unmount()
  })

  bench('single mode, 10 items', () => {
    const w = mount(Accordion, {
      props: { modelValue: '' },
      slots: makeSlotContent(10),
    })
    w.unmount()
  })

  bench('single mode, 50 items', () => {
    const w = mount(Accordion, {
      props: { modelValue: '' },
      slots: makeSlotContent(50),
    })
    w.unmount()
  })

  bench('multiple mode, 10 items, 5 open', () => {
    const w = mount(Accordion, {
      props: {
        modelValue: ['item-0', 'item-2', 'item-4', 'item-6', 'item-8'],
        type: 'multiple',
      },
      slots: makeSlotContent(10),
    })
    w.unmount()
  })
})

describe('Accordion toggle', () => {
  bench('toggle item in single mode', async () => {
    const w = mount(Accordion, {
      props: { modelValue: '', type: 'single' },
      slots: makeSlotContent(10),
    })
    await w.setProps({ modelValue: 'item-3' })
    w.unmount()
  })

  bench('toggle item in multiple mode', async () => {
    const w = mount(Accordion, {
      props: { modelValue: ['item-0'], type: 'multiple' },
      slots: makeSlotContent(10),
    })
    await w.setProps({ modelValue: ['item-0', 'item-5'] })
    w.unmount()
  })
})
