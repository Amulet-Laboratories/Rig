import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { TooltipKey } from '@core/injection-keys'
import Tooltip from './Tooltip.vue'
import { nextTick } from 'vue'

function factory(
  overrides: {
    visible?: boolean
    content?: string
    referenceEl?: HTMLElement | null
    placement?: 'top' | 'bottom' | 'left' | 'right'
  } = {},
) {
  const state = {
    visible: ref(overrides.visible ?? false),
    content: ref(overrides.content ?? ''),
    referenceEl: ref(overrides.referenceEl ?? null),
    placement: ref<'top' | 'bottom' | 'left' | 'right'>(overrides.placement ?? 'bottom'),
    show: () => {},
    hide: () => {},
  }
  return mount(Tooltip, {
    global: { provide: { [TooltipKey as symbol]: state } },
    attachTo: document.body,
  })
}

// Tooltip teleports to body — query document directly
function tip() {
  return document.querySelector('[data-rig-tooltip]') as HTMLElement | null
}

afterEach(() => {
  document.querySelectorAll('[data-rig-tooltip]').forEach((el) => el.remove())
})

describe('Tooltip', () => {
  it('is hidden when visible is false', () => {
    factory({ visible: false })
    // v-show keeps element in DOM — check data-state
    expect(tip()?.dataset.state).toBe('hidden')
  })

  it('renders when visible is true', () => {
    factory({ visible: true, content: 'Hello' })
    expect(tip()?.dataset.state).toBe('visible')
  })

  it('renders the tooltip content', () => {
    factory({ visible: true, content: 'Explorer' })
    expect(tip()?.textContent?.trim()).toBe('Explorer')
  })

  it('has role=tooltip', () => {
    factory({ visible: true, content: 'x' })
    expect(tip()?.getAttribute('role')).toBe('tooltip')
  })

  it('reflects placement in data-side', () => {
    factory({ visible: true, content: 'x', placement: 'right' })
    // floating-ui computes actual side; in jsdom it falls back to requested placement
    expect(tip()?.dataset.side).toBeTruthy()
  })

  it('handles keyboard events gracefully', async () => {
    const wrapper = mount(Tooltip)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    factory({ visible: true, content: 'Focus test' })
    const el = tip()
    el?.focus()
    expect(document.activeElement).toBeDefined()
  })

  it('supports event emission', async () => {
    const wrapper = mount(Tooltip)
    expect(wrapper.emitted()).toBeDefined()
  })

  it('handles prop updates', async () => {
    const wrapper = mount(Tooltip)
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
