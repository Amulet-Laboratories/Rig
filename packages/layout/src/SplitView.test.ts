import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SplitView from './SplitView.vue'

describe('SplitView', () => {
  it('renders with data-rig-split-view', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [200, 400] },
    })
    expect(wrapper.find('[data-rig-split-view]').exists()).toBe(true)
  })

  it('defaults to horizontal orientation', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [200, 400] },
    })
    expect(wrapper.find('[data-rig-split-view]').attributes('data-orientation')).toBe('horizontal')
  })

  it('sets vertical orientation', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [200, 400], orientation: 'vertical' },
    })
    expect(wrapper.find('[data-rig-split-view]').attributes('data-orientation')).toBe('vertical')
  })

  it('renders panes for each size', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [100, 200, 300] },
    })
    const panes = wrapper.findAll('[data-rig-split-pane]')
    expect(panes).toHaveLength(3)
  })

  it('applies flex-basis from sizes', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [150, 350] },
    })
    const panes = wrapper.findAll('[data-rig-split-pane]')
    expect(panes[0]!.attributes('style')).toContain('flex-basis: 150px')
    expect(panes[1]!.attributes('style')).toContain('flex-basis: 350px')
  })

  it('renders resizer between panes when resizable', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [200, 400], resizable: true },
    })
    expect(wrapper.findAll('[data-rig-resizer]')).toHaveLength(1)
  })

  it('renders n-1 resizers for n panes', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [100, 200, 300], resizable: true },
    })
    expect(wrapper.findAll('[data-rig-resizer]')).toHaveLength(2)
  })

  it('does not render resizers when not resizable', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [200, 400], resizable: false },
    })
    expect(wrapper.findAll('[data-rig-resizer]')).toHaveLength(0)
  })

  it('defaults to resizable', () => {
    const wrapper = mount(SplitView, {
      props: { sizes: [200, 400] },
    })
    expect(wrapper.findAll('[data-rig-resizer]')).toHaveLength(1)
  })
})
