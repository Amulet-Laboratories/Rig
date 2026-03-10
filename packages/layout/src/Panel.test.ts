import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Panel from './Panel.vue'

describe('Panel', () => {
  it('is closed when open=false', () => {
    const wrapper = mount(Panel, { props: { open: false } })
    expect(wrapper.find('[data-rig-panel]').attributes('data-state')).toBe('closed')
  })

  it('renders when open', () => {
    const wrapper = mount(Panel, {
      props: { open: true, size: 200 },
      slots: { default: 'Panel content' },
    })
    expect(wrapper.find('[data-rig-panel]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Panel content')
  })

  it('sets position data attribute', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'right', size: 200 },
    })
    expect(wrapper.find('[data-rig-panel]').attributes('data-position')).toBe('right')
  })

  it('applies size as height for bottom panel', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'bottom', size: 300 },
    })
    expect(wrapper.find('[data-rig-panel]').attributes('style')).toContain('height: 300px')
  })

  it('applies size as width for right panel', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'right', size: 250 },
    })
    expect(wrapper.find('[data-rig-panel]').attributes('style')).toContain('width: 250px')
  })

  it('emits update:open false on Escape', async () => {
    const wrapper = mount(Panel, {
      props: { open: true, size: 200 },
    })
    await wrapper.find('[data-rig-panel]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('renders resizer when resizable', () => {
    const wrapper = mount(Panel, {
      props: { open: true, resizable: true, size: 200 },
    })
    expect(wrapper.find('[data-rig-resizer]').exists()).toBe(true)
  })
})
