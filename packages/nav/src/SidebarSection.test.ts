import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarSection from './SidebarSection.vue'

const rows = [
  { label: 'Active', value: 12, tone: 'info' as const },
  { label: 'Critical', value: 1, tone: 'danger' as const },
  { label: 'Plain', value: '✓' },
]

describe('SidebarSection', () => {
  it('renders with data-rig-sidebar-section', () => {
    const wrapper = mount(SidebarSection, { props: { title: 'Counts', rows } })
    expect(wrapper.find('[data-rig-sidebar-section]').exists()).toBe(true)
  })

  it('renders the title', () => {
    const wrapper = mount(SidebarSection, { props: { title: 'Status' } })
    expect(wrapper.find('[data-rig-sidebar-section-label]').text()).toBe('Status')
  })

  it('omits the title block when no title is set', () => {
    const wrapper = mount(SidebarSection, { props: { rows } })
    expect(wrapper.find('[data-rig-sidebar-section-title]').exists()).toBe(false)
  })

  it('renders every row', () => {
    const wrapper = mount(SidebarSection, { props: { title: 'X', rows } })
    expect(wrapper.findAll('[data-rig-sidebar-row]')).toHaveLength(3)
  })

  it('writes tones as data-tone attributes', () => {
    const wrapper = mount(SidebarSection, { props: { title: 'X', rows } })
    const rowEls = wrapper.findAll('[data-rig-sidebar-row]')
    expect(rowEls[0]!.attributes('data-tone')).toBe('info')
    expect(rowEls[1]!.attributes('data-tone')).toBe('danger')
    // Untoned rows should not carry a data-tone attribute.
    expect(rowEls[2]!.attributes('data-tone')).toBeUndefined()
  })

  it('marks bordered by default', () => {
    const wrapper = mount(SidebarSection, { props: { title: 'X' } })
    expect(wrapper.find('[data-rig-sidebar-section]').attributes('data-bordered')).toBe('true')
  })

  it('drops the border attribute when border=false', () => {
    const wrapper = mount(SidebarSection, { props: { title: 'X', border: false } })
    expect(wrapper.find('[data-rig-sidebar-section]').attributes('data-bordered')).toBeUndefined()
  })

  it('renders title-suffix slot when title is present', () => {
    const wrapper = mount(SidebarSection, {
      props: { title: 'X' },
      slots: { 'title-suffix': '<span class="suffix">!</span>' },
    })
    expect(wrapper.find('.suffix').exists()).toBe(true)
  })

  it('renders default slot below rows', () => {
    const wrapper = mount(SidebarSection, {
      props: { title: 'X', rows },
      slots: { default: '<p class="custom">extra</p>' },
    })
    expect(wrapper.find('.custom').text()).toBe('extra')
  })
})
