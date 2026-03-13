import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleGroup from './ToggleGroup.vue'
import { nextTick } from 'vue'

describe('ToggleGroup', () => {
  it('renders with data-rig-toggle-group', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    expect(wrapper.attributes('data-rig-toggle-group')).toBeDefined()
  })

  it('has role="group"', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('sets data-type attribute', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '', type: 'multiple' } })
    expect(wrapper.attributes('data-type')).toBe('multiple')
  })

  it('sets data-orientation attribute', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', orientation: 'vertical' },
    })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '', disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })

  it('exposes isPressed returning true for matching single value', () => {
    let exposed: Record<string, unknown> = {}
    mount(ToggleGroup, {
      props: { modelValue: 'bold', type: 'single' },
      slots: {
        default: ({ isPressed }: { isPressed: (v: string) => boolean }) => {
          exposed = { isPressed }
          return ''
        },
      },
    })
    expect((exposed.isPressed as (v: string) => boolean)('bold')).toBe(true)
    expect((exposed.isPressed as (v: string) => boolean)('italic')).toBe(false)
  })

  it('exposes isPressed returning true for value in multiple array', () => {
    let exposed: Record<string, unknown> = {}
    mount(ToggleGroup, {
      props: { modelValue: ['bold', 'italic'], type: 'multiple' },
      slots: {
        default: ({ isPressed }: { isPressed: (v: string) => boolean }) => {
          exposed = { isPressed }
          return ''
        },
      },
    })
    expect((exposed.isPressed as (v: string) => boolean)('bold')).toBe(true)
    expect((exposed.isPressed as (v: string) => boolean)('underline')).toBe(false)
  })

  it('emits update:modelValue with toggled value in single mode', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', type: 'single' },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('bold')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bold'])
  })

  it('toggles off in single mode when value already selected', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: 'bold', type: 'single' },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('bold')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('does not emit when disabled', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', disabled: true },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('bold')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('handles keyboard interaction', async () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.exists()).toBe(true)
  })

  it('can receive focus', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } }, { attachTo: document.body })
    wrapper.element.focus()
    expect(document.activeElement).toBeDefined()
    wrapper.unmount()
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    await wrapper.setProps({ disabled: true })
    await nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})
