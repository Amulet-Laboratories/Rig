import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import Transfer from './Transfer.vue'

const source = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
]
const target = [{ id: 'c', label: 'Gamma' }]

describe('Transfer', () => {
  it('renders data-rig-transfer with source and target items', () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source, targetItems: target } })
    expect(wrapper.attributes('data-rig-transfer')).toBe('')
    expect(wrapper.findAll('[data-rig-transfer-source] [data-rig-transfer-item]')).toHaveLength(2)
    expect(wrapper.findAll('[data-rig-transfer-target] [data-rig-transfer-item]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Alpha')
    expect(wrapper.text()).toContain('Gamma')
  })

  it('applies aria-labels to the two listboxes', () => {
    const wrapper = mount(Transfer, {
      props: { sourceItems: source, sourceLabel: 'Available', targetLabel: 'Chosen' },
    })
    expect(wrapper.find('[data-rig-transfer-source]').attributes('aria-label')).toBe('Available')
    expect(wrapper.find('[data-rig-transfer-target]').attributes('aria-label')).toBe('Chosen')
  })

  it('toggles source item selection on click', async () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source } })
    const first = wrapper.find('[data-rig-transfer-source] [data-rig-transfer-item]')
    await first.trigger('click')
    expect(first.attributes('data-selected')).toBe('true')
    expect(first.attributes('aria-selected')).toBe('true')
    await first.trigger('click')
    expect(first.attributes('data-selected')).toBeUndefined()
  })

  it('disables move-right until a source item is selected', async () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source } })
    const right = wrapper.find('[data-rig-transfer-move-right]')
    expect((right.element as HTMLButtonElement).disabled).toBe(true)
    await wrapper.find('[data-rig-transfer-source] [data-rig-transfer-item]').trigger('click')
    expect((right.element as HTMLButtonElement).disabled).toBe(false)
  })

  it('moves selected items right and emits the updated lists', async () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source, targetItems: target } })
    await wrapper.find('[data-rig-transfer-source] [data-rig-transfer-item]').trigger('click') // 'a'
    await wrapper.find('[data-rig-transfer-move-right]').trigger('click')
    expect(wrapper.emitted('update:sourceItems')?.[0]?.[0]).toEqual([{ id: 'b', label: 'Beta' }])
    expect(wrapper.emitted('update:targetItems')?.[0]?.[0]).toEqual([
      { id: 'c', label: 'Gamma' },
      { id: 'a', label: 'Alpha' },
    ])
    expect(wrapper.emitted('move')?.[0]).toEqual(['right', [{ id: 'a', label: 'Alpha' }]])
  })

  it('moves selected items left and emits the updated lists', async () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source, targetItems: target } })
    await wrapper.find('[data-rig-transfer-target] [data-rig-transfer-item]').trigger('click') // 'c'
    await wrapper.find('[data-rig-transfer-move-left]').trigger('click')
    expect(wrapper.emitted('update:targetItems')?.[0]?.[0]).toEqual([])
    expect(wrapper.emitted('update:sourceItems')?.[0]?.[0]).toEqual([
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
      { id: 'c', label: 'Gamma' },
    ])
    expect(wrapper.emitted('move')?.[0]).toEqual(['left', [{ id: 'c', label: 'Gamma' }]])
  })

  it('toggles selection via keyboard (Space and Enter)', async () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source } })
    const first = wrapper.find('[data-rig-transfer-source] [data-rig-transfer-item]')
    await first.trigger('keydown', { key: ' ' })
    expect(first.attributes('data-selected')).toBe('true')
    await first.trigger('keydown', { key: 'Enter' })
    expect(first.attributes('data-selected')).toBeUndefined()
  })

  it('does not select or move when disabled', async () => {
    const wrapper = mount(Transfer, { props: { sourceItems: source, disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBe('true')
    const first = wrapper.find('[data-rig-transfer-source] [data-rig-transfer-item]')
    await first.trigger('click')
    expect(first.attributes('data-selected')).toBeUndefined()
    const right = wrapper.find('[data-rig-transfer-move-right]').element as HTMLButtonElement
    expect(right.disabled).toBe(true)
  })

  it('renders a custom item slot with selection state', () => {
    const wrapper = mount(Transfer, {
      props: { sourceItems: source },
      slots: {
        'source-item': (p: { item: { label: string }; selected: boolean }) =>
          h('span', { class: 'custom' }, `${p.item.label}:${p.selected}`),
      },
    })
    expect(wrapper.find('.custom').text()).toBe('Alpha:false')
  })
})
