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

  it('panel element can receive programmatic focus', () => {
    const wrapper = mount(Panel, {
      props: { open: true, size: 200 },
      attachTo: document.body,
    })
    const panel = wrapper.find('[data-rig-panel]')
    ;(panel.element as HTMLElement).focus()
    expect(document.activeElement).toBe(panel.element)
    wrapper.unmount()
  })

  it('updates data-state when open prop changes', async () => {
    const wrapper = mount(Panel, { props: { open: false, size: 200 } })
    expect(wrapper.find('[data-rig-panel]').attributes('data-state')).toBe('closed')
    await wrapper.setProps({ open: true })
    expect(wrapper.find('[data-rig-panel]').attributes('data-state')).toBe('open')
  })

  it('applies size as width for left panel', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'left', size: 250 },
    })
    expect(wrapper.find('[data-rig-panel]').attributes('style')).toContain('width: 250px')
  })

  it('renders header slot content', () => {
    const wrapper = mount(Panel, {
      props: { open: true, size: 200 },
      slots: { header: 'Panel Title' },
    })
    expect(wrapper.find('[data-rig-panel-header]').text()).toBe('Panel Title')
  })

  it('renders default slot content', () => {
    const wrapper = mount(Panel, {
      props: { open: true, size: 200 },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('[data-rig-panel-content]').text()).toBe('Content')
  })

  it('hides resizer when not resizable', () => {
    const wrapper = mount(Panel, {
      props: { open: true, resizable: false, size: 200 },
    })
    expect(wrapper.find('[data-rig-resizer]').exists()).toBe(false)
  })

  it('has region role and aria-label', () => {
    const wrapper = mount(Panel, { props: { open: true, size: 200 } })
    expect(wrapper.find('[data-rig-panel]').attributes('role')).toBe('region')
    expect(wrapper.find('[data-rig-panel]').attributes('aria-label')).toBe('Panel')
  })

  it('uses default size of 200', () => {
    const wrapper = mount(Panel, { props: { open: true } })
    expect(wrapper.find('[data-rig-panel]').attributes('style')).toContain('200px')
  })

  it('emits update:size on resize for bottom panel', async () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'bottom', size: 200, minSize: 100 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    resizer.vm.$emit('dragstart')
    resizer.vm.$emit('drag', { delta: -50 })
    await wrapper.vm.$nextTick()
    // bottom: factor = -1, so newSize = 200 + (-50)*(-1) = 250
    expect(wrapper.emitted('update:size')?.[0]).toEqual([250])
  })

  it('emits update:size on resize for right panel', async () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'right', size: 200, minSize: 100 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    resizer.vm.$emit('dragstart')
    resizer.vm.$emit('drag', { delta: -50 })
    await wrapper.vm.$nextTick()
    // right: multiplier = -1, factor = -1, newSize = 200 + (-50)*(-1) = 250
    expect(wrapper.emitted('update:size')?.[0]).toEqual([250])
  })

  it('emits update:size on resize for left panel', async () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'left', size: 200, minSize: 100 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    resizer.vm.$emit('dragstart')
    resizer.vm.$emit('drag', { delta: 50 })
    await wrapper.vm.$nextTick()
    // left: multiplier = 1, factor = 1, newSize = 200 + 50*1 = 250
    expect(wrapper.emitted('update:size')?.[0]).toEqual([250])
  })

  it('clamps size to minSize on resize', async () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'bottom', size: 150, minSize: 100 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    // delta 200 with factor -1 => newSize = 150 + 200*(-1) = -50 => clamped to 100
    resizer.vm.$emit('dragstart')
    resizer.vm.$emit('drag', { delta: 200 })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:size')?.[0]).toEqual([100])
  })

  it('clamps size to maxSize on resize', async () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'bottom', size: 200, minSize: 100, maxSize: 300 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    // delta -200 with factor -1 => newSize = 200 + (-200)*(-1) = 400 => clamped to 300
    resizer.vm.$emit('dragstart')
    resizer.vm.$emit('drag', { delta: -200 })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:size')?.[0]).toEqual([300])
  })

  it('sets vertical orientation resizer for bottom panel', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'bottom', resizable: true, size: 200 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    expect(resizer.props('orientation')).toBe('vertical')
  })

  it('sets horizontal orientation resizer for right panel', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'right', resizable: true, size: 200 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    expect(resizer.props('orientation')).toBe('horizontal')
  })

  it('sets horizontal orientation resizer for left panel', () => {
    const wrapper = mount(Panel, {
      props: { open: true, position: 'left', resizable: true, size: 200 },
    })
    const resizer = wrapper.findComponent({ name: 'Resizer' })
    expect(resizer.props('orientation')).toBe('horizontal')
  })
})
