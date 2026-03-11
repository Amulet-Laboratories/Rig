import { describe, it, expect } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useVirtualList } from './useVirtualList'

/** Minimal harness component to mount the composable */
function makeHarness<T>(source: () => T[], itemHeight: number, overscan = 5) {
  return defineComponent({
    setup() {
      const { containerRef, virtualState, onScroll } = useVirtualList(source, {
        itemHeight,
        overscan,
      })
      return { containerRef, virtualState, onScroll }
    },
    template: '<div ref="containerRef" />',
  })
}

const ITEMS = Array.from({ length: 100 }, (_, i) => i)

describe('useVirtualList', () => {
  it('computes totalHeight correctly', () => {
    const H = makeHarness(() => ITEMS, 20)
    const wrapper = mount(H)
    expect(wrapper.vm.virtualState.totalHeight).toBe(100 * 20)
  })

  it('returns empty items for empty source', () => {
    const H = makeHarness(() => [], 20)
    const wrapper = mount(H)
    expect(wrapper.vm.virtualState.items).toHaveLength(0)
    expect(wrapper.vm.virtualState.totalHeight).toBe(0)
  })

  it('renders initial visible slice plus overscan', () => {
    // containerHeight defaults to 300, itemHeight=20 → ~15 in view + 5 overscan
    const H = makeHarness(() => ITEMS, 20, 2)
    const wrapper = mount(H)
    // start=0, end = ceil(300/20)+2 = 17, items = 0..17 = 18 items
    expect(wrapper.vm.virtualState.items.length).toBeGreaterThan(0)
    // First item is at the beginning
    expect(wrapper.vm.virtualState.items[0]!.index).toBe(0)
    expect(wrapper.vm.virtualState.items[0]!.offsetTop).toBe(0)
  })

  it('paddingTop is 0 at start', () => {
    const H = makeHarness(() => ITEMS, 20)
    const wrapper = mount(H)
    expect(wrapper.vm.virtualState.paddingTop).toBe(0)
  })

  it('item offsetTop equals index * itemHeight', () => {
    const H = makeHarness(() => ITEMS, 20, 0)
    const wrapper = mount(H)
    const { items } = wrapper.vm.virtualState
    for (const { item, index, offsetTop } of items) {
      expect(offsetTop).toBe(index * 20)
      expect(item).toBe(ITEMS[index])
    }
  })

  it('exposes onScroll without throwing', () => {
    const H = makeHarness(() => ITEMS, 20)
    const wrapper = mount(H)
    expect(() => wrapper.vm.onScroll()).not.toThrow()
  })

  it('works with a reactive source', async () => {
    const source = ref<number[]>([1, 2, 3])
    const H = defineComponent({
      setup() {
        const { virtualState } = useVirtualList(() => source.value, { itemHeight: 20 })
        return { virtualState }
      },
      template: '<div />',
    })
    const wrapper = mount(H)
    expect(wrapper.vm.virtualState.totalHeight).toBe(3 * 20)
    source.value = Array.from({ length: 50 }, (_, i) => i)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.virtualState.totalHeight).toBe(50 * 20)
  })
})
