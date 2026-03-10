import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from './Accordion.vue'

describe('Accordion', () => {
  it('renders with data-rig-accordion', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '' } })
    expect(wrapper.attributes('data-rig-accordion')).toBeDefined()
  })

  it('sets data-type attribute', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '', type: 'multiple' } })
    expect(wrapper.attributes('data-type')).toBe('multiple')
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '', disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })

  it('exposes isOpen returning true for open item in single mode', () => {
    let exposed: Record<string, unknown> = {}
    mount(Accordion, {
      props: { modelValue: 'a', type: 'single' },
      slots: {
        default: ({ isOpen }: { isOpen: (v: string) => boolean }) => {
          exposed = { isOpen }
          return ''
        },
      },
    })
    expect((exposed.isOpen as (v: string) => boolean)('a')).toBe(true)
    expect((exposed.isOpen as (v: string) => boolean)('b')).toBe(false)
  })

  it('exposes isOpen for multiple mode', () => {
    let exposed: Record<string, unknown> = {}
    mount(Accordion, {
      props: { modelValue: ['a', 'b'], type: 'multiple' },
      slots: {
        default: ({ isOpen }: { isOpen: (v: string) => boolean }) => {
          exposed = { isOpen }
          return ''
        },
      },
    })
    expect((exposed.isOpen as (v: string) => boolean)('a')).toBe(true)
    expect((exposed.isOpen as (v: string) => boolean)('c')).toBe(false)
  })

  it('emits update:modelValue when toggling item in single mode', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(Accordion, {
      props: { modelValue: '', type: 'single', collapsible: true },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('a')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('collapses open item in single mode when collapsible=true', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(Accordion, {
      props: { modelValue: 'a', type: 'single', collapsible: true },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('a')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('does not collapse when collapsible=false', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(Accordion, {
      props: { modelValue: 'a', type: 'single', collapsible: false },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('a')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not emit when disabled', () => {
    let exposed: Record<string, unknown> = {}
    const wrapper = mount(Accordion, {
      props: { modelValue: '', disabled: true },
      slots: {
        default: ({ toggle }: { toggle: (v: string) => void }) => {
          exposed = { toggle }
          return ''
        },
      },
    })
    ;(exposed.toggle as (v: string) => void)('a')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('exposes headerId and panelId for ARIA linkage', () => {
    let exposed: Record<string, unknown> = {}
    mount(Accordion, {
      props: { modelValue: '' },
      slots: {
        default: (scope: { headerId: (v: string) => string; panelId: (v: string) => string }) => {
          exposed = { headerId: scope.headerId, panelId: scope.panelId }
          return ''
        },
      },
    })
    expect((exposed.headerId as (v: string) => string)('section-1')).toBe('rig-accordion-header-section-1')
    expect((exposed.panelId as (v: string) => string)('section-1')).toBe('rig-accordion-panel-section-1')
  })
})
