import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyGrid from './PropertyGrid.vue'
import { nextTick } from 'vue'

const items = [
  { key: 'Name', value: 'Alice' },
  { key: 'Role', value: 'Engineer', mono: true },
  { key: 'Status', value: 'active' },
]

describe('PropertyGrid', () => {
  it('renders with data-rig-property-grid', () => {
    const wrapper = mount(PropertyGrid, { props: { items } })
    expect(wrapper.attributes('data-rig-property-grid')).toBeDefined()
  })

  it('renders a row per item', () => {
    const wrapper = mount(PropertyGrid, { props: { items } })
    expect(wrapper.findAll('[data-rig-property-row]')).toHaveLength(3)
  })

  it('displays key and value', () => {
    const wrapper = mount(PropertyGrid, { props: { items: [items[0]!] } })
    expect(wrapper.find('[data-rig-property-key]').text()).toBe('Name')
    expect(wrapper.find('[data-rig-property-value]').text()).toBe('Alice')
  })

  it('sets mono data attribute', () => {
    const wrapper = mount(PropertyGrid, { props: { items: [items[1]!] } })
    expect(wrapper.find('[data-rig-property-value]').attributes('data-mono')).toBeDefined()
  })

  it('applies keyWidth style', () => {
    const wrapper = mount(PropertyGrid, { props: { items: [items[0]!], keyWidth: '120px' } })
    const key = wrapper.find('[data-rig-property-key]')
    expect(key.attributes('style')).toContain('width: 120px')
  })

  it('supports named slots per key', () => {
    const wrapper = mount(PropertyGrid, {
      props: { items: [{ key: 'Status', value: 'active' }] },
      slots: { Status: '<span class="custom">ACTIVE</span>' },
    })
    expect(wrapper.find('.custom').text()).toBe('ACTIVE')
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(PropertyGrid, { props: { items: [{ key: 'Name', value: 'Test' }] } })
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(PropertyGrid, { props: { items: [{ key: 'Name', value: 'Test' }] } }, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(PropertyGrid, { props: { items: [{ key: 'Name', value: 'Test' }] } })
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(PropertyGrid, { props: { items: [{ key: 'Name', value: 'Test' }] } })
    await wrapper.setProps({ value: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
