import { describe, it, expect } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useVirtualGrid } from './useVirtualGrid'
import type { VirtualGridOptions } from './useVirtualGrid'

/** Minimal harness component to mount the composable */
function makeHarness<T>(source: () => T[], options: VirtualGridOptions) {
  return defineComponent({
    setup() {
      const grid = useVirtualGrid(source, options)
      return { ...grid }
    },
    template: '<div ref="containerRef" />',
  })
}

const ITEMS = Array.from({ length: 100 }, (_, i) => i)

// jsdom never measures, so the container defaults hold: width 600, height 300.
describe('useVirtualGrid', () => {
  it('derives column count from minColumnWidth and container width', () => {
    // floor((600 + 8) / (140 + 8)) = 4
    const wrapper = mount(makeHarness(() => ITEMS, { minColumnWidth: 140, rowHeight: 100 }))
    expect(wrapper.vm.columnCount).toBe(4)
  })

  it('never returns fewer than one column', () => {
    const wrapper = mount(makeHarness(() => ITEMS, { minColumnWidth: 5000, rowHeight: 100 }))
    expect(wrapper.vm.columnCount).toBe(1)
  })

  it('fixed columns wins over minColumnWidth', () => {
    const wrapper = mount(
      makeHarness(() => ITEMS, { columns: 3, minColumnWidth: 50, rowHeight: 100 }),
    )
    expect(wrapper.vm.columnCount).toBe(3)
  })

  it('computes column width from count and gap', () => {
    // (600 - (4-1)*8) / 4 = 144
    const wrapper = mount(makeHarness(() => ITEMS, { minColumnWidth: 140, rowHeight: 100 }))
    expect(wrapper.vm.columnWidth).toBe(144)
  })

  it('rowHeight can be a function of the measured column width', () => {
    const wrapper = mount(
      makeHarness(() => ITEMS, { minColumnWidth: 140, rowHeight: (w) => w + 38 }),
    )
    expect(wrapper.vm.rowHeight).toBe(144 + 38)
  })

  it('computes totalHeight as rowCount * (rowHeight + gap)', () => {
    // 100 items / 4 cols = 25 rows; stride = 100 + 8
    const wrapper = mount(makeHarness(() => ITEMS, { minColumnWidth: 140, rowHeight: 100 }))
    expect(wrapper.vm.virtualState.totalHeight).toBe(25 * 108)
  })

  it('is empty for an empty source', () => {
    const wrapper = mount(makeHarness(() => [], { minColumnWidth: 140, rowHeight: 100 }))
    expect(wrapper.vm.virtualState.rows).toHaveLength(0)
    expect(wrapper.vm.virtualState.totalHeight).toBe(0)
  })

  it('renders the visible window plus overscan, no more', () => {
    // viewport 300 / stride 108 → endRow = ceil(300/108) + 1 = 4; rows 0..4
    const wrapper = mount(
      makeHarness(() => ITEMS, { minColumnWidth: 140, rowHeight: 100, overscan: 1 }),
    )
    const rows = wrapper.vm.virtualState.rows
    expect(rows[0]!.row).toBe(0)
    expect(rows.length).toBeLessThan(25)
    expect(wrapper.vm.virtualState.paddingTop).toBe(0)
    expect(wrapper.vm.virtualState.paddingBottom).toBe(
      wrapper.vm.virtualState.totalHeight - rows.length * 108,
    )
  })

  it('cells carry the item and its flat index', () => {
    const wrapper = mount(makeHarness(() => ITEMS, { columns: 4, rowHeight: 100, overscan: 0 }))
    const second = wrapper.vm.virtualState.rows[1]!
    expect(second.cells.map((c) => c.index)).toEqual([4, 5, 6, 7])
    expect(second.cells[0]!.item).toBe(ITEMS[4])
    expect(second.offsetTop).toBe(108)
  })

  it('last row holds the remainder', () => {
    const wrapper = mount(
      makeHarness(() => ITEMS.slice(0, 10), { columns: 4, rowHeight: 100, overscan: 0 }),
    )
    const rows = wrapper.vm.virtualState.rows
    expect(rows).toHaveLength(3)
    expect(rows[2]!.cells).toHaveLength(2)
  })

  it('windows forward when scrolled', async () => {
    const wrapper = mount(makeHarness(() => ITEMS, { columns: 4, rowHeight: 100, overscan: 0 }))
    const el = wrapper.vm.containerRef as HTMLElement
    el.scrollTop = 1080 // row 10
    wrapper.vm.onScroll()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.virtualState.rows[0]!.row).toBe(10)
    expect(wrapper.vm.virtualState.paddingTop).toBe(10 * 108)
  })

  it('scrollToIndex lands the row in view', async () => {
    const wrapper = mount(makeHarness(() => ITEMS, { columns: 4, rowHeight: 100, overscan: 0 }))
    wrapper.vm.scrollToIndex(41) // row 10, below the fold
    await wrapper.vm.$nextTick()
    const el = wrapper.vm.containerRef as HTMLElement
    // bottom of row 10 = 10*108 + 100 = 1180; viewport 300 → scrollTop 880
    expect(el.scrollTop).toBe(880)
    wrapper.vm.scrollToIndex(0)
    expect(el.scrollTop).toBe(0)
  })

  it('scrollToIndex centers when asked', () => {
    const wrapper = mount(makeHarness(() => ITEMS, { columns: 4, rowHeight: 100, overscan: 0 }))
    wrapper.vm.scrollToIndex(41, 'center')
    const el = wrapper.vm.containerRef as HTMLElement
    // top of row 10 = 1080; centered = 1080 - (300 - 100)/2 = 980
    expect(el.scrollTop).toBe(980)
  })

  it('reacts to a growing source', async () => {
    const source = ref<number[]>([1, 2, 3])
    const H = defineComponent({
      setup() {
        const grid = useVirtualGrid(() => source.value, { columns: 4, rowHeight: 100 })
        return { ...grid }
      },
      template: '<div ref="containerRef" />',
    })
    const wrapper = mount(H)
    expect(wrapper.vm.virtualState.totalHeight).toBe(108)
    source.value = Array.from({ length: 12 }, (_, i) => i)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.virtualState.totalHeight).toBe(3 * 108)
  })
})
