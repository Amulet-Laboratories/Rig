import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Accordion from './Accordion.vue'
import { h } from 'vue'

describe('Accordion', () => {
  it('renders with data-rig-accordion', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '' } })
    expect(wrapper.attributes('data-rig-accordion')).toBe('')
  })

  it('sets data-type attribute', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '', type: 'multiple' } })
    expect(wrapper.attributes('data-type')).toBe('multiple')
  })

  it('sets data-disabled when disabled', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '', disabled: true } })
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
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
    const headerId = (exposed.headerId as (v: string) => string)('section-1')
    const panelId = (exposed.panelId as (v: string) => string)('section-1')
    // IDs are prefixed with a unique instance ID from useId()
    expect(headerId).toContain('accordion-header-section-1')
    expect(panelId).toContain('accordion-panel-section-1')
    // Header and panel IDs share the same prefix
    expect(headerId.replace('header', '')).toEqual(panelId.replace('panel', ''))
  })

  it('does not emit on keyboard navigation alone', async () => {
    const wrapper = mount(Accordion, {
      props: { modelValue: '' },
      attachTo: document.body,
      slots: {
        default: [
          h('button', { 'data-rig-accordion-trigger': '' }, 'A'),
          h('button', { 'data-rig-accordion-trigger': '' }, 'B'),
        ],
      },
    })
    const trigger = wrapper.find('[data-rig-accordion-trigger]')
    ;(trigger.element as HTMLElement).focus()
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('root element does not have tabindex', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '' } })
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })

  it('updates data-type when type prop changes', async () => {
    const wrapper = mount(Accordion, { props: { modelValue: '', type: 'single' } })
    expect(wrapper.attributes('data-type')).toBe('single')
    await wrapper.setProps({ type: 'multiple' })
    expect(wrapper.attributes('data-type')).toBe('multiple')
  })

  it('sets aria-label with type', () => {
    const wrapper = mount(Accordion, { props: { modelValue: '', type: 'multiple' } })
    expect(wrapper.attributes('aria-label')).toBe('Accordion (multiple)')
  })

  it('returns false for isOpen when modelValue is undefined', () => {
    let exposed: { isOpen: (v: string) => boolean } = { isOpen: () => false }
    mount(Accordion, {
      props: { type: 'single' },
      slots: {
        default: ({ isOpen }: { isOpen: (v: string) => boolean }) => {
          exposed = { isOpen }
          return ''
        },
      },
    })
    expect(exposed.isOpen('a')).toBe(false)
  })

  describe('multiple mode toggle', () => {
    it('adds item to array', () => {
      let exposed: { toggle: (v: string) => void } = { toggle: () => {} }
      const wrapper = mount(Accordion, {
        props: { modelValue: ['a'], type: 'multiple' },
        slots: {
          default: ({ toggle }: { toggle: (v: string) => void }) => {
            exposed = { toggle }
            return ''
          },
        },
      })
      exposed.toggle('b')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a', 'b']])
    })

    it('removes item from array', () => {
      let exposed: { toggle: (v: string) => void } = { toggle: () => {} }
      const wrapper = mount(Accordion, {
        props: { modelValue: ['a', 'b'], type: 'multiple' },
        slots: {
          default: ({ toggle }: { toggle: (v: string) => void }) => {
            exposed = { toggle }
            return ''
          },
        },
      })
      exposed.toggle('a')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['b']])
    })

    it('handles non-array modelValue in multiple mode', () => {
      let exposed: { toggle: (v: string) => void } = { toggle: () => {} }
      const wrapper = mount(Accordion, {
        props: { modelValue: 'a' as unknown as string[], type: 'multiple' },
        slots: {
          default: ({ toggle }: { toggle: (v: string) => void }) => {
            exposed = { toggle }
            return ''
          },
        },
      })
      exposed.toggle('b')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['b']])
    })
  })

  describe('keyboard navigation', () => {
    function createWithHeaders() {
      return mount(Accordion, {
        props: { modelValue: '' },
        attachTo: document.body,
        slots: {
          default: [
            h('button', { 'data-rig-accordion-trigger': '', id: 'h1' }, 'Section 1'),
            h('button', { 'data-rig-accordion-trigger': '', id: 'h2' }, 'Section 2'),
            h('button', { 'data-rig-accordion-trigger': '', id: 'h3' }, 'Section 3'),
          ],
        },
      })
    }

    function pressKey(el: HTMLElement, key: string) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    }

    it('ArrowDown focuses next header', () => {
      const wrapper = createWithHeaders()
      const h1 = document.getElementById('h1')!
      h1.focus()
      pressKey(h1, 'ArrowDown')
      expect(document.activeElement?.id).toBe('h2')
      wrapper.unmount()
    })

    it('ArrowUp focuses previous header', () => {
      const wrapper = createWithHeaders()
      const h2 = document.getElementById('h2')!
      h2.focus()
      pressKey(h2, 'ArrowUp')
      expect(document.activeElement?.id).toBe('h1')
      wrapper.unmount()
    })

    it('wraps from last to first with ArrowDown', () => {
      const wrapper = createWithHeaders()
      const h3 = document.getElementById('h3')!
      h3.focus()
      pressKey(h3, 'ArrowDown')
      expect(document.activeElement?.id).toBe('h1')
      wrapper.unmount()
    })

    it('wraps from first to last with ArrowUp', () => {
      const wrapper = createWithHeaders()
      const h1 = document.getElementById('h1')!
      h1.focus()
      pressKey(h1, 'ArrowUp')
      expect(document.activeElement?.id).toBe('h3')
      wrapper.unmount()
    })

    it('Home focuses first header', () => {
      const wrapper = createWithHeaders()
      const h3 = document.getElementById('h3')!
      h3.focus()
      pressKey(h3, 'Home')
      expect(document.activeElement?.id).toBe('h1')
      wrapper.unmount()
    })

    it('End focuses last header', () => {
      const wrapper = createWithHeaders()
      const h1 = document.getElementById('h1')!
      h1.focus()
      pressKey(h1, 'End')
      expect(document.activeElement?.id).toBe('h3')
      wrapper.unmount()
    })

    it('ignores unhandled keys', () => {
      const wrapper = createWithHeaders()
      const h1 = document.getElementById('h1')!
      h1.focus()
      pressKey(h1, 'Enter')
      expect(document.activeElement?.id).toBe('h1')
      wrapper.unmount()
    })

    it('does nothing when target is not a trigger', async () => {
      const wrapper = mount(Accordion, {
        props: { modelValue: '' },
        attachTo: document.body,
        slots: { default: h('span', 'not a trigger') },
      })
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })
})
