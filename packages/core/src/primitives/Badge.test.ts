import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from './Badge.vue'

describe('Badge', () => {
  it('renders with data-rig-badge', () => {
    const wrapper = mount(Badge, { slots: { default: '3' } })
    expect(wrapper.attributes('data-rig-badge')).toBeDefined()
    expect(wrapper.text()).toBe('3')
  })

  it('sets variant and size data attributes', () => {
    const wrapper = mount(Badge, {
      props: { variant: 'info', size: 'sm' },
    })
    expect(wrapper.attributes('data-variant')).toBe('info')
    expect(wrapper.attributes('data-size')).toBe('sm')
  })
})
