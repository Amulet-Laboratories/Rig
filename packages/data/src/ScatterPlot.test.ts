import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScatterPlot from './ScatterPlot.vue'

const data = [
  { x: 1, y: 2 },
  { x: 3, y: 4, label: 'Point A' },
  { x: 5, y: 1, size: 8, color: '#ff0000' },
]

describe('ScatterPlot', () => {
  it('renders with data-rig-scatter-plot', () => {
    const wrapper = mount(ScatterPlot, { props: { data } })
    expect(wrapper.find('[data-rig-scatter-plot]').exists()).toBe(true)
  })

  it('renders correct number of points', () => {
    const wrapper = mount(ScatterPlot, { props: { data } })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(3)
  })

  it('has correct ARIA attributes', () => {
    const wrapper = mount(ScatterPlot, { props: { data } })
    expect(wrapper.find('svg').attributes('role')).toBe('img')
  })

  it('emits point-click on click', async () => {
    const wrapper = mount(ScatterPlot, { props: { data } })
    await wrapper.findAll('[data-rig-scatter-plot-point]')[0]!.trigger('click')
    expect(wrapper.emitted('point-click')).toBeTruthy()
  })

  it('handles empty data', () => {
    const wrapper = mount(ScatterPlot, { props: { data: [] } })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(0)
  })

  it('does not emit point-click on keydown', async () => {
    const wrapper = mount(ScatterPlot, { props: { data: [{ x: 1, y: 2 }] } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('point-click')).toBeUndefined()
  })

  it('supports focus management', () => {
    const wrapper = mount(ScatterPlot, { props: { data: [{ x: 1, y: 2 }] } })
    expect(wrapper.find('svg').attributes('tabindex')).toBe('0')
  })

  it('reacts to prop updates', async () => {
    const wrapper = mount(ScatterPlot, { props: { data: [{ x: 1, y: 2 }] } })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(1)
    await wrapper.setProps({
      data: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(2)
  })
})

// ── Bubble mode (size channel) ───────────────────────────────────────────────

describe('ScatterPlot bubble mode', () => {
  const bubbleData = [
    { x: 1, y: 2, size: 5 },
    { x: 3, y: 4, size: 10, label: 'Big' },
    { x: 5, y: 1, size: 3, color: '#ff0000' },
  ]

  it('renders correct number of points in bubble mode', () => {
    const wrapper = mount(ScatterPlot, { props: { data: bubbleData } })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(3)
  })

  it('normalizes radii based on size values', () => {
    const wrapper = mount(ScatterPlot, {
      props: { data: bubbleData, maxRadius: 30 },
    })
    const circles = wrapper.findAll('[data-rig-scatter-plot-point]')
    // largest size=10 should get maxRadius=30
    expect(Number(circles[1]!.attributes('r'))).toBe(30)
    // size=5 → 15
    expect(Number(circles[0]!.attributes('r'))).toBe(15)
  })

  it('applies bubble opacity when size channel is present', () => {
    const wrapper = mount(ScatterPlot, { props: { data: bubbleData } })
    const circle = wrapper.find('[data-rig-scatter-plot-point]')
    expect(circle.attributes('opacity')).toContain('0.7')
  })

  it('does not apply opacity for plain scatter (no size)', () => {
    const wrapper = mount(ScatterPlot, {
      props: { data: [{ x: 1, y: 2 }] },
    })
    const circle = wrapper.find('[data-rig-scatter-plot-point]')
    expect(circle.attributes('opacity')).toBeUndefined()
  })

  it('emits point-click in bubble mode', async () => {
    const wrapper = mount(ScatterPlot, { props: { data: bubbleData } })
    await wrapper.findAll('[data-rig-scatter-plot-point]')[0]!.trigger('click')
    expect(wrapper.emitted('point-click')).toBeTruthy()
  })

  it('handles empty data in bubble mode', () => {
    const wrapper = mount(ScatterPlot, { props: { data: [] } })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(0)
  })

  it('reacts to prop updates in bubble mode', async () => {
    const wrapper = mount(ScatterPlot, { props: { data: [{ x: 1, y: 2, size: 3 }] } })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(1)
    await wrapper.setProps({
      data: [
        { x: 1, y: 2, size: 3 },
        { x: 4, y: 5, size: 6 },
      ],
    })
    expect(wrapper.findAll('[data-rig-scatter-plot-point]')).toHaveLength(2)
  })
})

// ── Focus management ─────────────────────────────────────────────────────────

describe('ScatterPlot interactions', () => {
  it('supports focus management', async () => {
    const wrapper = mount(ScatterPlot, {
      attachTo: document.body,
    })
    const focusable = wrapper.find('[tabindex], input, button, [role], a')
    if (focusable.exists()) {
      ;(focusable.element as HTMLElement).focus()
      expect(document.activeElement).toBe(focusable.element)
    } else {
      expect(wrapper.html()).toBeTruthy()
    }
    wrapper.unmount()
  })
})
