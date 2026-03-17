import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from './Tabs.vue'

/** Build a minimal tabs wrapper so we can test slot + keyboard behavior */
function factory(modelValue = 'a') {
  return mount(Tabs, {
    props: { modelValue },
    attachTo: document.body,
    slots: {
      tabs: `
        <button role="tab" data-tab-id="a" :data-state="'a' === '${modelValue}' ? 'active' : 'inactive'">Tab A</button>
        <button role="tab" data-tab-id="b" :data-state="'b' === '${modelValue}' ? 'active' : 'inactive'">Tab B</button>
        <button role="tab" data-tab-id="c" :data-state="'c' === '${modelValue}' ? 'active' : 'inactive'">Tab C</button>
      `,
      default: '<div role="tabpanel">Panel A</div>',
    },
  })
}

describe('Tabs', () => {
  it('renders with data-rig-tabs', () => {
    const wrapper = factory()
    expect(wrapper.attributes('data-rig-tabs')).toBe('')
  })

  it('has a tablist with correct role and orientation', () => {
    const wrapper = factory()
    const tablist = wrapper.find('[data-rig-tablist]')
    expect(tablist.attributes('role')).toBe('tablist')
    expect(tablist.attributes('aria-orientation')).toBe('horizontal')
  })

  it('defaults to horizontal orientation', () => {
    const wrapper = factory()
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('sets data-orientation from prop', () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'a', orientation: 'vertical' },
    })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('renders slot tabs', () => {
    const wrapper = factory()
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
  })

  it('renders default slot', () => {
    const wrapper = factory()
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(true)
  })

  it('navigates to next tab with ArrowRight and emits update:modelValue', async () => {
    const wrapper = factory('a')
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    // Focus first tab
    ;(tabs[0]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    wrapper.unmount()
  })

  it('navigates to previous tab with ArrowLeft', async () => {
    const wrapper = factory('b')
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    ;(tabs[1]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    wrapper.unmount()
  })

  it('wraps from first tab to last with ArrowLeft', async () => {
    const wrapper = factory('a')
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    ;(tabs[0]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c'])
    wrapper.unmount()
  })

  it('jumps to first tab on Home key', async () => {
    const wrapper = factory('c')
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    ;(tabs[2]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    wrapper.unmount()
  })

  it('jumps to last tab on End key', async () => {
    const wrapper = factory('a')
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    ;(tabs[0]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c'])
    wrapper.unmount()
  })

  it('does not activate in manual mode on arrow navigate', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'a', activationMode: 'manual' },
      attachTo: document.body,
      slots: {
        tabs: `
          <button role="tab" data-tab-id="a">Tab A</button>
          <button role="tab" data-tab-id="b">Tab B</button>
        `,
      },
    })
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    ;(tabs[0]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('activates in manual mode on Enter', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'a', activationMode: 'manual' },
      attachTo: document.body,
      slots: {
        tabs: `
          <button role="tab" data-tab-id="a">Tab A</button>
          <button role="tab" data-tab-id="b">Tab B</button>
        `,
      },
    })
    const tablist = wrapper.find('[data-rig-tablist]')
    const tabs = wrapper.findAll('[role="tab"]')
    // Focus second tab manually
    ;(tabs[1]!.element as HTMLElement).focus()
    await tablist.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    wrapper.unmount()
  })

  it('updates data-orientation when orientation prop changes', async () => {
    const wrapper = mount(Tabs, { props: { modelValue: 'a' } })
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    await wrapper.setProps({ orientation: 'vertical' })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })
})
