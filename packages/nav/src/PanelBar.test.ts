import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PanelBar from './PanelBar.vue'
import type { TabItem } from '@core/types'

const tabs: TabItem[] = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'output', label: 'Output' },
  { id: 'problems', label: 'Problems', closable: true },
]

describe('PanelBar', () => {
  it('renders with data-rig-panel-bar', () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    expect(wrapper.find('[data-rig-panel-bar]').exists()).toBe(true)
  })

  it('renders all tabs', () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    const tabEls = wrapper.findAll('[data-rig-panel-bar-tab]')
    expect(tabEls).toHaveLength(3)
    expect(tabEls[0].text()).toContain('Terminal')
    expect(tabEls[1].text()).toContain('Output')
  })

  it('has tablist role', () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
  })

  it('marks active tab with aria-selected and data-state', () => {
    const wrapper = mount(PanelBar, {
      props: { tabs, activeId: 'output' },
    })
    const tabEls = wrapper.findAll('[data-rig-panel-bar-tab]')
    expect(tabEls[1].attributes('aria-selected')).toBe('true')
    expect(tabEls[1].attributes('data-state')).toBe('active')
    expect(tabEls[0].attributes('aria-selected')).toBe('false')
  })

  it('emits update:activeId on tab click', async () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    await wrapper.findAll('[data-rig-panel-bar-tab]')[1].trigger('click')
    expect(wrapper.emitted('update:activeId')?.[0]).toEqual(['output'])
  })

  it('renders close button for closable tabs', () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    const closeBtns = wrapper.findAll('[data-rig-panel-bar-close]')
    expect(closeBtns).toHaveLength(1)
  })

  it('emits close on close button click', async () => {
    const wrapper = mount(PanelBar, {
      props: { tabs, activeId: 'problems' },
    })
    await wrapper.find('[data-rig-panel-bar-close]').trigger('click')
    expect(wrapper.emitted('close')?.[0]).toEqual(['problems'])
  })

  it('has tabpanel role for content area', () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(true)
  })

  it('supports roving tabindex', () => {
    const wrapper = mount(PanelBar, { props: { tabs } })
    const tabEls = wrapper.findAll('[data-rig-panel-bar-tab]')
    expect(tabEls[0].attributes('tabindex')).toBe('0')
    expect(tabEls[1].attributes('tabindex')).toBe('-1')
    expect(tabEls[2].attributes('tabindex')).toBe('-1')
  })
})
