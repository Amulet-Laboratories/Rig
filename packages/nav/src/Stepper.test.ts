import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Stepper from './Stepper.vue'

describe('Stepper', () => {
  const steps = [
    { label: 'Account', description: 'Create account' },
    { label: 'Profile', description: 'Set up profile' },
    { label: 'Confirm' },
  ]

  it('renders with data-rig-stepper', () => {
    const wrapper = mount(Stepper, { props: { steps } })
    expect(wrapper.attributes('data-rig-stepper')).toBeDefined()
  })

  it('renders all steps', () => {
    const wrapper = mount(Stepper, { props: { steps } })
    expect(wrapper.findAll('[data-rig-stepper-step]')).toHaveLength(3)
  })

  it('marks current step as active', () => {
    const wrapper = mount(Stepper, { props: { steps, current: 1 } })
    const items = wrapper.findAll('[data-rig-stepper-step]')
    expect(items[0]!.attributes('data-state')).toBe('completed')
    expect(items[1]!.attributes('data-state')).toBe('active')
    expect(items[2]!.attributes('data-state')).toBe('pending')
  })

  it('sets aria-current on active step', () => {
    const wrapper = mount(Stepper, { props: { steps, current: 1 } })
    const items = wrapper.findAll('[data-rig-stepper-step]')
    expect(items[1]!.attributes('aria-current')).toBe('step')
  })

  it('emits select on step click', async () => {
    const wrapper = mount(Stepper, { props: { steps } })
    await wrapper.findAll('[data-rig-stepper-step]')[1]!.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([1])
  })

  it('supports both orientations', () => {
    const h = mount(Stepper, { props: { steps, orientation: 'horizontal' } })
    expect(h.attributes('data-orientation')).toBe('horizontal')
  })

  it('emits select on Enter keypress on a step', async () => {
    const wrapper = mount(Stepper, { props: { steps } })
    const stepEls = wrapper.findAll('[data-rig-stepper-step]')
    await stepEls[1]!.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0]).toEqual([1])
  })

  it('can focus a step element', () => {
    const wrapper = mount(Stepper, { props: { steps }, attachTo: document.body })
    const step = wrapper.find('[data-rig-stepper-step]')
    ;(step.element as HTMLElement).focus()
    expect(document.activeElement).toBe(step.element)
    wrapper.unmount()
  })

  it('updates data-state when current prop changes', async () => {
    const wrapper = mount(Stepper, { props: { steps, current: 0 } })
    const stepEls = wrapper.findAll('[data-rig-stepper-step]')
    expect(stepEls[0]!.attributes('data-state')).toBe('active')
    expect(stepEls[1]!.attributes('data-state')).toBe('pending')
    await wrapper.setProps({ current: 1 })
    expect(stepEls[0]!.attributes('data-state')).toBe('completed')
    expect(stepEls[1]!.attributes('data-state')).toBe('active')
  })
})
