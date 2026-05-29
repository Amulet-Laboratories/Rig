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

  it('paddingBottom is computed for initial state', () => {
    const H = makeHarness(() => ITEMS, 20, 0)
    const wrapper = mount(H)
    const { paddingBottom, items: _items, totalHeight } = wrapper.vm.virtualState
    // paddingBottom = totalHeight - (lastVisibleItem.offsetTop + itemHeight)
    expect(paddingBottom).toBeGreaterThanOrEqual(0)
    expect(paddingBottom).toBeLessThanOrEqual(totalHeight)
  })

  it('handles short list shorter than viewport', () => {
    const shortItems = [1, 2, 3]
    const H = makeHarness(() => shortItems, 20, 5)
    const wrapper = mount(H)
    const { items, totalHeight } = wrapper.vm.virtualState
    expect(totalHeight).toBe(60)
    // All 3 items should be visible (fewer than overscan window)
    expect(items).toHaveLength(3)
  })

  it('items have correct data for single-item list', () => {
    const H = makeHarness(() => [42], 30, 0)
    const wrapper = mount(H)
    const {
      items,
      totalHeight,
      paddingTop,
      paddingBottom: _paddingBottom,
    } = wrapper.vm.virtualState
    expect(totalHeight).toBe(30)
    expect(items).toHaveLength(1)
    expect(items[0]!.item).toBe(42)
    expect(items[0]!.index).toBe(0)
    expect(items[0]!.offsetTop).toBe(0)
    expect(paddingTop).toBe(0)
  })

  it('overscan larger than total items shows all items', () => {
    const fiveItems = [1, 2, 3, 4, 5]
    const H = makeHarness(() => fiveItems, 20, 100)
    const wrapper = mount(H)
    const { items } = wrapper.vm.virtualState
    expect(items).toHaveLength(5)
  })

  it('containerRef is available', () => {
    const H = makeHarness(() => ITEMS, 20)
    const wrapper = mount(H)
    // containerRef should be a template ref (may or may not be set in jsdom)
    expect(wrapper.vm.containerRef).toBeDefined()
  })

  it('onScroll is a function', () => {
    const H = makeHarness(() => ITEMS, 20)
    const wrapper = mount(H)
    expect(wrapper.vm.onScroll).toBeTypeOf('function')
  })

  it('handles items with different types', () => {
    const stringItems = ['a', 'b', 'c', 'd', 'e']
    const H = makeHarness(() => stringItems, 25, 0)
    const wrapper = mount(H)
    const { items, totalHeight } = wrapper.vm.virtualState
    expect(totalHeight).toBe(125)
    expect(items[0]!.item).toBe('a')
  })
})
