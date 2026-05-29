import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingProgress from './ReadingProgress.vue'

describe('ReadingProgress', () => {
  it('renders with data-rig-reading-progress attribute', () => {
    const wrapper = mount(ReadingProgress)
    expect(wrapper.find('[data-rig-reading-progress]').exists()).toBe(true)
  })

  it('has role="progressbar"', () => {
    const wrapper = mount(ReadingProgress)
    expect(wrapper.attributes('role')).toBe('progressbar')
  })

  it('has aria-label="Reading progress"', () => {
    const wrapper = mount(ReadingProgress)
    expect(wrapper.attributes('aria-label')).toBe('Reading progress')
  })

  it('has aria-valuemin="0" and aria-valuemax="100"', () => {
    const wrapper = mount(ReadingProgress)
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('100')
  })

  it('renders progress bar child element', () => {
    const wrapper = mount(ReadingProgress)
    expect(wrapper.find('[data-rig-reading-progress-bar]').exists()).toBe(true)
  })

  it('initial aria-valuenow is "0"', () => {
    const wrapper = mount(ReadingProgress)
    expect(wrapper.attributes('aria-valuenow')).toBe('0')
  })
})
