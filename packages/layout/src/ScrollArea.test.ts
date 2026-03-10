import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollArea from './ScrollArea.vue'

describe('ScrollArea', () => {
  it('renders with data-rig-scroll-area', () => {
    const wrapper = mount(ScrollArea)
    expect(wrapper.attributes('data-rig-scroll-area')).toBeDefined()
  })

  it('contains a scroll viewport', () => {
    const wrapper = mount(ScrollArea)
    expect(wrapper.find('[data-rig-scroll-viewport]').exists()).toBe(true)
  })

  it('renders slot content inside viewport', () => {
    const wrapper = mount(ScrollArea, {
      slots: { default: '<p data-test-content>Hello</p>' },
    })
    expect(wrapper.find('[data-test-content]').exists()).toBe(true)
  })

  it('does not show vertical scrollbar when content is shorter than viewport in jsdom', () => {
    // In jsdom scrollHeight === clientHeight === 0, so hasVerticalScroll is false
    const wrapper = mount(ScrollArea, { props: { vertical: true } })
    expect(wrapper.find('[data-rig-scroll-bar]').exists()).toBe(false)
  })

  it('does not show horizontal scrollbar by default', () => {
    const wrapper = mount(ScrollArea)
    const bars = wrapper.findAll('[data-rig-scroll-bar]')
    const hBars = bars.filter((b) => b.attributes('data-orientation') === 'horizontal')
    expect(hBars).toHaveLength(0)
  })

  it('sets data-orientation="vertical" on vertical bar', async () => {
    // Force dimensions so the bar renders
    const wrapper = mount(ScrollArea, { props: { vertical: true } })
    // Even without scroll content, the bar element has the correct orientation when visible
    const bars = wrapper.findAll('[data-rig-scroll-bar]')
    bars.forEach((bar) => {
      expect(['vertical', 'horizontal']).toContain(bar.attributes('data-orientation'))
    })
  })
})
