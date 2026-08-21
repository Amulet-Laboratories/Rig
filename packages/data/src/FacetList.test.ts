import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FacetList from './FacetList.vue'
import type { FacetOption } from './FacetList.vue'

const options: FacetOption[] = [
  { value: 'cc0', count: 15385 },
  { value: 'licensed', count: 10672 },
  { value: 'reference', count: 28495 },
  { value: 'ghost', count: 0 },
]

describe('FacetList', () => {
  it('renders with data-rig-facet-list and group role', () => {
    const wrapper = mount(FacetList, { props: { options, title: 'Rights' } })
    expect(wrapper.attributes('data-rig-facet-list')).toBe('')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Rights')
    expect(wrapper.find('[data-rig-facet-list-title]').text()).toContain('Rights')
  })

  it('renders one row per option with label and formatted count', () => {
    const wrapper = mount(FacetList, { props: { options } })
    const rows = wrapper.findAll('[data-rig-facet-list-option]')
    expect(rows).toHaveLength(4)
    expect(rows[0]!.find('[data-rig-facet-list-label]').text()).toBe('cc0')
    expect(rows[0]!.find('[data-rig-facet-list-count]').text()).toBe((15385).toLocaleString())
  })

  it('dims zero-count options instead of hiding them', () => {
    const wrapper = mount(FacetList, { props: { options } })
    const rows = wrapper.findAll('[data-rig-facet-list-option]')
    expect(rows[3]!.attributes('data-empty')).not.toBeUndefined()
    expect(rows[0]!.attributes('data-empty')).toBeUndefined()
  })

  it('checking an option updates the model and emits change', async () => {
    const wrapper = mount(FacetList, { props: { options } })
    await wrapper.findAll('input[type=checkbox]')[1]!.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['licensed']])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([['licensed'], 'licensed'])
  })

  it('unchecking removes only that value', async () => {
    const wrapper = mount(FacetList, {
      props: { options, modelValue: ['cc0', 'licensed'] },
    })
    await wrapper.findAll('input[type=checkbox]')[0]!.setValue(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['licensed']])
  })

  it('marks checked rows', () => {
    const wrapper = mount(FacetList, { props: { options, modelValue: ['reference'] } })
    const rows = wrapper.findAll('[data-rig-facet-list-option]')
    expect(rows[2]!.attributes('data-checked')).not.toBeUndefined()
    expect(rows[0]!.attributes('data-checked')).toBeUndefined()
  })

  it('clear button empties the model', async () => {
    const wrapper = mount(FacetList, {
      props: { options, title: 'Rights', modelValue: ['cc0', 'licensed'] },
    })
    await wrapper.find('[data-rig-facet-list-clear]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('hides the clear button when nothing is checked', () => {
    const wrapper = mount(FacetList, { props: { options, title: 'Rights' } })
    expect(wrapper.find('[data-rig-facet-list-clear]').exists()).toBe(false)
  })

  it('folds unchecked options past the limit and shows them on demand', async () => {
    const wrapper = mount(FacetList, { props: { options, limit: 2 } })
    expect(wrapper.findAll('[data-rig-facet-list-option]')).toHaveLength(2)
    const more = wrapper.find('[data-rig-facet-list-more]')
    expect(more.text()).toBe('Show all (4)')
    await more.trigger('click')
    expect(wrapper.findAll('[data-rig-facet-list-option]')).toHaveLength(4)
    expect(wrapper.find('[data-rig-facet-list-more]').text()).toBe('Show fewer')
  })

  it('checked options stay visible above the fold', () => {
    const wrapper = mount(FacetList, {
      props: { options, limit: 1, modelValue: ['ghost'] },
    })
    const labels = wrapper
      .findAll('[data-rig-facet-list-option]')
      .map((r) => r.find('[data-rig-facet-list-label]').text())
    expect(labels).toContain('ghost')
    expect(labels).toHaveLength(2) // 1 unchecked + the checked one
  })

  it('search filters the options', async () => {
    const wrapper = mount(FacetList, { props: { options, searchable: true, title: 'Rights' } })
    await wrapper.find('input[type=search]').setValue('lic')
    expect(wrapper.findAll('[data-rig-facet-list-option]')).toHaveLength(1)
    expect(wrapper.find('[data-rig-facet-list-label]').text()).toBe('licensed')
  })

  it('option slot replaces row content', () => {
    const wrapper = mount(FacetList, {
      props: { options },
      slots: {
        option: `<template #option="{ option, checked }"><em class="x">{{ option.value }}:{{ checked }}</em></template>`,
      },
    })
    expect(wrapper.find('.x').text()).toBe('cc0:false')
  })

  it('label falls back to value and prefers label when given', () => {
    const wrapper = mount(FacetList, {
      props: { options: [{ value: 'cc0', label: 'Public domain', count: 3 }] },
    })
    expect(wrapper.find('[data-rig-facet-list-label]').text()).toBe('Public domain')
  })
})
