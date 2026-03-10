import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Collapsible from './Collapsible.vue'

describe('Collapsible', () => {
  it('renders with data-rig-collapsible', () => {
    const wrapper = mount(Collapsible)
    expect(wrapper.attributes('data-rig-collapsible')).toBeDefined()
  })

  it('reflects closed state by default', () => {
    const wrapper = mount(Collapsible)
    expect(wrapper.attributes('data-state')).toBe('closed')
  })

  it('reflects open state when open=true', () => {
    const wrapper = mount(Collapsible, { props: { open: true } })
    expect(wrapper.attributes('data-state')).toBe('open')
  })

  it('shows content when open', () => {
    const wrapper = mount(Collapsible, { props: { open: true } })
    const content = wrapper.find('[data-rig-collapsible-content]')
    expect(content.isVisible()).toBe(true)
  })

  it('hides content when closed (v-show)', () => {
    const wrapper = mount(Collapsible, { props: { open: false } })
    const content = wrapper.find('[data-rig-collapsible-content]')
    expect(content.isVisible()).toBe(false)
  })

  it('emits update:open via toggle from slot', async () => {
    let toggleFn: (() => void) | null = null
    const wrapper = mount(Collapsible, {
      props: { open: false },
      slots: {
        trigger: ({ toggle }: { toggle: () => void }) => {
          toggleFn = toggle
          return '<button>toggle</button>'
        },
      },
    })
    toggleFn!()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('does not emit when disabled', () => {
    let toggleFn: (() => void) | null = null
    const wrapper = mount(Collapsible, {
      props: { open: false, disabled: true },
      slots: {
        trigger: ({ toggle }: { toggle: () => void }) => {
          toggleFn = toggle
          return '<button>toggle</button>'
        },
      },
    })
    toggleFn!()
    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(Collapsible, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })
})
