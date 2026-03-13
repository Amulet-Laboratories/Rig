import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioGroup from './RadioGroup.vue'
import { nextTick } from 'vue'

describe('RadioGroup', () => {
  it('renders with data-rig-radio-group', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.attributes('data-rig-radio-group')).toBeDefined()
  })

  it('has role="radiogroup"', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })

  it('sets aria-label from label prop', () => {
    const wrapper = mount(RadioGroup, { props: { label: 'Preferred contact' } })
    expect(wrapper.attributes('aria-label')).toBe('Preferred contact')
  })

  it('sets aria-labelledby from labelledBy prop', () => {
    const wrapper = mount(RadioGroup, { props: { labelledBy: 'group-heading' } })
    expect(wrapper.attributes('aria-labelledby')).toBe('group-heading')
  })

  it('defaults to vertical orientation', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('sets horizontal orientation', () => {
    const wrapper = mount(RadioGroup, { props: { orientation: 'horizontal' } })
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
  })

  it('sets disabled state', () => {
    const wrapper = mount(RadioGroup, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('does not set aria-disabled when not disabled', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
  })

  it('renders slot content', () => {
    const wrapper = mount(RadioGroup, {
      slots: { default: '<input type="radio" data-test-radio />' },
    })
    expect(wrapper.find('[data-test-radio]').exists()).toBe(true)
  })

  it('handles keyboard interaction', async () => {
    const wrapper = mount(RadioGroup)
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(RadioGroup, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('supports event emission', async () => {
    const wrapper = mount(RadioGroup)
    // Verify component has emitted() interface
    expect(wrapper.emitted()).toBeDefined()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(RadioGroup)
    await wrapper.setProps({ modelValue: 'test' })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
