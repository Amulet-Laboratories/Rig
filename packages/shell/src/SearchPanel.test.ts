import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchPanel from './SearchPanel.vue'

describe('SearchPanel', () => {
  it('renders with data-rig-search-panel', () => {
    const wrapper = mount(SearchPanel)
    expect(wrapper.find('[data-rig-search-panel]').exists()).toBe(true)
  })

  it('renders header with default title', () => {
    const wrapper = mount(SearchPanel)
    expect(wrapper.find('[data-rig-sidebar-header]').text()).toBe('Search')
  })

  it('renders custom title', () => {
    const wrapper = mount(SearchPanel, { props: { title: 'Find' } })
    expect(wrapper.find('[data-rig-sidebar-header]').text()).toBe('Find')
  })

  it('renders search input', () => {
    const wrapper = mount(SearchPanel)
    expect(wrapper.find('[data-rig-search-panel-input] input').exists()).toBe(true)
  })

  it('shows idle state when query is empty', () => {
    const wrapper = mount(SearchPanel)
    expect(wrapper.text()).toContain('Search')
  })

  it('shows no results state when query has no matches', () => {
    const wrapper = mount(SearchPanel, {
      props: { modelValue: 'xyz', results: [] },
    })
    expect(wrapper.text()).toContain('No results')
    expect(wrapper.text()).toContain("No matches for 'xyz'")
  })

  it('renders results when provided', () => {
    const results = [
      { id: '1', label: 'Result 1' },
      { id: '2', label: 'Result 2' },
    ]
    const wrapper = mount(SearchPanel, {
      props: { modelValue: 'test', results },
    })
    expect(wrapper.find('[data-rig-search-panel-results]').exists()).toBe(true)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SearchPanel)
    const input = wrapper.find('[data-rig-search-panel-input] input')
    await input.setValue('hello')
    expect(wrapper.emitted('update:modelValue')).toBeDefined()
  })

  it('renders header slot', () => {
    const wrapper = mount(SearchPanel, {
      slots: { header: '<span>Custom</span>' },
    })
    expect(wrapper.find('[data-rig-sidebar-header] span').text()).toBe('Custom')
  })

  it('uses custom noResultsTitle', () => {
    const wrapper = mount(SearchPanel, {
      props: { modelValue: 'xyz', results: [], noResultsTitle: 'Nothing found' },
    })
    expect(wrapper.text()).toContain('Nothing found')
  })

  it('uses custom placeholder', () => {
    const wrapper = mount(SearchPanel, { props: { placeholder: 'Type here...' } })
    const input = wrapper.find('[data-rig-search-panel-input] input')
    expect(input.attributes('placeholder')).toBe('Type here...')
  })
})
