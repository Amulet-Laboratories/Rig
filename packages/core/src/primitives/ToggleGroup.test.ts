import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleGroup from './ToggleGroup.vue'
import { h } from 'vue'

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

  it('has group role', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('has descriptive aria-label', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    expect(wrapper.attributes('aria-label')).toContain('Toggle group')
  })

  it('sets data-disabled when disabled', async () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '' } })
    await wrapper.setProps({ disabled: true })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })

  it('sets aria-label with type', () => {
    const wrapper = mount(ToggleGroup, { props: { modelValue: '', type: 'multiple' } })
    expect(wrapper.attributes('aria-label')).toBe('Toggle group (multiple)')
  })

  describe('multiple mode toggle', () => {
    it('adds item to array', () => {
      let exposed: { toggle: (v: string) => void } = { toggle: () => {} }
      const wrapper = mount(ToggleGroup, {
        props: { modelValue: ['bold'], type: 'multiple' },
        slots: {
          default: ({ toggle }: { toggle: (v: string) => void }) => {
            exposed = { toggle }
            return ''
          },
        },
      })
      exposed.toggle('italic')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['bold', 'italic']])
    })

    it('removes item from array', () => {
      let exposed: { toggle: (v: string) => void } = { toggle: () => {} }
      const wrapper = mount(ToggleGroup, {
        props: { modelValue: ['bold', 'italic'], type: 'multiple' },
        slots: {
          default: ({ toggle }: { toggle: (v: string) => void }) => {
            exposed = { toggle }
            return ''
          },
        },
      })
      exposed.toggle('bold')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['italic']])
    })

    it('handles non-array modelValue in multiple mode', () => {
      let exposed: { toggle: (v: string) => void } = { toggle: () => {} }
      const wrapper = mount(ToggleGroup, {
        props: { modelValue: 'bold' as unknown as string[], type: 'multiple' },
        slots: {
          default: ({ toggle }: { toggle: (v: string) => void }) => {
            exposed = { toggle }
            return ''
          },
        },
      })
      exposed.toggle('italic')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['italic']])
    })
  })

  describe('keyboard navigation', () => {
    function createWithButtons(orientation: 'horizontal' | 'vertical' = 'horizontal') {
      return mount(ToggleGroup, {
        props: { modelValue: '', orientation },
        attachTo: document.body,
        slots: {
          default: [
            h('button', { id: 'b1' }, 'Bold'),
            h('button', { id: 'b2' }, 'Italic'),
            h('button', { id: 'b3' }, 'Underline'),
          ],
        },
      })
    }

    function pressKey(el: HTMLElement, key: string) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    }

    it('ArrowRight focuses next button in horizontal mode', () => {
      const wrapper = createWithButtons('horizontal')
      const b1 = document.getElementById('b1')!
      b1.focus()
      pressKey(b1, 'ArrowRight')
      expect(document.activeElement?.id).toBe('b2')
      wrapper.unmount()
    })

    it('ArrowLeft focuses previous button in horizontal mode', () => {
      const wrapper = createWithButtons('horizontal')
      const b2 = document.getElementById('b2')!
      b2.focus()
      pressKey(b2, 'ArrowLeft')
      expect(document.activeElement?.id).toBe('b1')
      wrapper.unmount()
    })

    it('wraps from last to first', () => {
      const wrapper = createWithButtons('horizontal')
      const b3 = document.getElementById('b3')!
      b3.focus()
      pressKey(b3, 'ArrowRight')
      expect(document.activeElement?.id).toBe('b1')
      wrapper.unmount()
    })

    it('wraps from first to last', () => {
      const wrapper = createWithButtons('horizontal')
      const b1 = document.getElementById('b1')!
      b1.focus()
      pressKey(b1, 'ArrowLeft')
      expect(document.activeElement?.id).toBe('b3')
      wrapper.unmount()
    })

    it('ArrowDown focuses next button in vertical mode', () => {
      const wrapper = createWithButtons('vertical')
      const b1 = document.getElementById('b1')!
      b1.focus()
      pressKey(b1, 'ArrowDown')
      expect(document.activeElement?.id).toBe('b2')
      wrapper.unmount()
    })

    it('ArrowUp focuses previous button in vertical mode', () => {
      const wrapper = createWithButtons('vertical')
      const b2 = document.getElementById('b2')!
      b2.focus()
      pressKey(b2, 'ArrowUp')
      expect(document.activeElement?.id).toBe('b1')
      wrapper.unmount()
    })

    it('ignores non-navigation keys', () => {
      const wrapper = createWithButtons()
      const b1 = document.getElementById('b1')!
      b1.focus()
      pressKey(b1, 'Enter')
      expect(document.activeElement?.id).toBe('b1')
      wrapper.unmount()
    })

    it('does nothing when target is not a child button', async () => {
      const wrapper = mount(ToggleGroup, {
        props: { modelValue: '' },
        attachTo: document.body,
        slots: { default: h('span', 'not a button') },
      })
      await wrapper.trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })
})

// ── Items mode (replaces standalone Toggle) ──────────────────────────────────

const items = [
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' },
]

describe('ToggleGroup items mode', () => {
  it('renders toggle buttons from items prop', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items },
    })
    expect(wrapper.findAll('[data-rig-toggle]')).toHaveLength(3)
  })

  it('renders labels from items', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items },
    })
    expect(wrapper.text()).toContain('Bold')
    expect(wrapper.text()).toContain('Italic')
  })

  it('sets aria-pressed on active item', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: 'bold', items },
    })
    const buttons = wrapper.findAll('[data-rig-toggle]')
    expect(buttons[0]!.attributes('aria-pressed')).toBe('true')
    expect(buttons[1]!.attributes('aria-pressed')).toBe('false')
  })

  it('sets data-state on active item', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: 'italic', items },
    })
    const buttons = wrapper.findAll('[data-rig-toggle]')
    expect(buttons[1]!.attributes('data-state')).toBe('on')
    expect(buttons[0]!.attributes('data-state')).toBe('off')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items },
    })
    await wrapper.findAll('[data-rig-toggle]')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bold'])
  })

  it('toggles off when clicking active item', async () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: 'bold', items },
    })
    await wrapper.findAll('[data-rig-toggle]')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('disables all buttons when group disabled', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items, disabled: true },
    })
    const buttons = wrapper.findAll('[data-rig-toggle]')
    buttons.forEach((b) => {
      expect(b.attributes('disabled')).toBeDefined()
    })
  })

  it('disables individual items', () => {
    const opts = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ]
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items: opts },
    })
    const buttons = wrapper.findAll('[data-rig-toggle]')
    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
    expect(buttons[1]!.attributes('disabled')).toBeDefined()
  })

  it('falls back to value as label', () => {
    const opts = [{ value: 'hello' }]
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items: opts },
    })
    expect(wrapper.text()).toContain('hello')
  })

  it('applies variant and size to rendered buttons', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: '', items, variant: 'ghost', size: 'sm' },
    })
    const btn = wrapper.find('[data-rig-toggle]')
    expect(btn.attributes('data-variant')).toBe('ghost')
    expect(btn.attributes('data-size')).toBe('sm')
  })

  it('uses slot mode when items not provided', () => {
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
  })
})
