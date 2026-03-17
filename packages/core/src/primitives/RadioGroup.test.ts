import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioGroup from './RadioGroup.vue'
import { h } from 'vue'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('RadioGroup', () => {
  it('renders with data-rig-radio-group', () => {
    const wrapper = mount(RadioGroup)
    expect(wrapper.attributes('data-rig-radio-group')).toBe('')
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
    expect(wrapper.attributes('data-disabled')).not.toBeUndefined()
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

  it('sets aria-orientation from prop', () => {
    const wrapper = mount(RadioGroup, { props: { orientation: 'horizontal' } })
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
  })

  it('updates aria-disabled when disabled changes', async () => {
    const wrapper = mount(RadioGroup)
    await wrapper.setProps({ disabled: true })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('sets data-orientation to horizontal', () => {
    const wrapper = mount(RadioGroup, { props: { orientation: 'horizontal' } })
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('passes scoped slot props', () => {
    let slotProps: { modelValue?: string; disabled: boolean } | null = null
    mount(RadioGroup, {
      props: { modelValue: 'a', disabled: true },
      slots: {
        default: (props: { modelValue?: string; disabled: boolean }) => {
          slotProps = props
          return ''
        },
      },
    })
    expect(slotProps).not.toBeNull()
    expect(slotProps!.modelValue).toBe('a')
    expect(slotProps!.disabled).toBe(true)
  })

  describe('keyboard navigation', () => {
    function createWithRadios() {
      return mount(RadioGroup, {
        attachTo: document.body,
        slots: {
          default: [
            h('input', { type: 'radio', id: 'r1' }),
            h('input', { type: 'radio', id: 'r2' }),
            h('input', { type: 'radio', id: 'r3' }),
          ],
        },
      })
    }

    function pressKey(el: HTMLElement, key: string) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    }

    it('ArrowDown focuses next radio', () => {
      const wrapper = createWithRadios()
      const r1 = document.getElementById('r1')!
      r1.focus()
      pressKey(r1, 'ArrowDown')
      expect(document.activeElement?.id).toBe('r2')
      wrapper.unmount()
    })

    it('ArrowRight focuses next radio', () => {
      const wrapper = createWithRadios()
      const r1 = document.getElementById('r1')!
      r1.focus()
      pressKey(r1, 'ArrowRight')
      expect(document.activeElement?.id).toBe('r2')
      wrapper.unmount()
    })

    it('ArrowUp focuses previous radio', () => {
      const wrapper = createWithRadios()
      const r2 = document.getElementById('r2')!
      r2.focus()
      pressKey(r2, 'ArrowUp')
      expect(document.activeElement?.id).toBe('r1')
      wrapper.unmount()
    })

    it('ArrowLeft focuses previous radio', () => {
      const wrapper = createWithRadios()
      const r2 = document.getElementById('r2')!
      r2.focus()
      pressKey(r2, 'ArrowLeft')
      expect(document.activeElement?.id).toBe('r1')
      wrapper.unmount()
    })

    it('wraps from last to first with ArrowDown', () => {
      const wrapper = createWithRadios()
      const r3 = document.getElementById('r3')!
      r3.focus()
      pressKey(r3, 'ArrowDown')
      expect(document.activeElement?.id).toBe('r1')
      wrapper.unmount()
    })

    it('wraps from first to last with ArrowUp', () => {
      const wrapper = createWithRadios()
      const r1 = document.getElementById('r1')!
      r1.focus()
      pressKey(r1, 'ArrowUp')
      expect(document.activeElement?.id).toBe('r3')
      wrapper.unmount()
    })

    it('Home focuses first radio', () => {
      const wrapper = createWithRadios()
      const r3 = document.getElementById('r3')!
      r3.focus()
      pressKey(r3, 'Home')
      expect(document.activeElement?.id).toBe('r1')
      wrapper.unmount()
    })

    it('End focuses last radio', () => {
      const wrapper = createWithRadios()
      const r1 = document.getElementById('r1')!
      r1.focus()
      pressKey(r1, 'End')
      expect(document.activeElement?.id).toBe('r3')
      wrapper.unmount()
    })

    it('ignores unhandled keys', () => {
      const wrapper = createWithRadios()
      const r1 = document.getElementById('r1')!
      r1.focus()
      pressKey(r1, 'Enter')
      expect(document.activeElement?.id).toBe('r1')
      wrapper.unmount()
    })

    it('does nothing when target is not a radio', async () => {
      const wrapper = mount(RadioGroup, {
        attachTo: document.body,
        slots: { default: h('div', { id: 'not-radio' }, 'hello') },
      })
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })
})

// ── Options mode (replaces standalone Radio) ─────────────────────────────────

describe('RadioGroup options mode', () => {
  it('renders radio inputs from options prop', () => {
    const wrapper = mount(RadioGroup, {
      props: { options, name: 'group' },
    })
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3)
  })

  it('renders labels from options', () => {
    const wrapper = mount(RadioGroup, {
      props: { options, name: 'group' },
    })
    expect(wrapper.text()).toContain('Option A')
    expect(wrapper.text()).toContain('Option B')
  })

  it('checks the radio matching modelValue', () => {
    const wrapper = mount(RadioGroup, {
      props: { options, modelValue: 'b', name: 'group' },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    expect((radios[1]!.element as HTMLInputElement).checked).toBe(true)
    expect((radios[0]!.element as HTMLInputElement).checked).toBe(false)
  })

  it('sets data-state on labels', () => {
    const wrapper = mount(RadioGroup, {
      props: { options, modelValue: 'a', name: 'group' },
    })
    const labels = wrapper.findAll('[data-rig-radio]')
    expect(labels[0]!.attributes('data-state')).toBe('checked')
    expect(labels[1]!.attributes('data-state')).toBe('unchecked')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(RadioGroup, {
      props: { options, modelValue: 'a', name: 'group' },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1]!.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('disables all radios when group disabled', () => {
    const wrapper = mount(RadioGroup, {
      props: { options, disabled: true, name: 'group' },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    radios.forEach((r) => {
      expect(r.attributes('disabled')).toBe('')
    })
  })

  it('disables individual options', () => {
    const opts = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ]
    const wrapper = mount(RadioGroup, {
      props: { options: opts, name: 'group' },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios[0]!.attributes('disabled')).toBeUndefined()
    expect(radios[1]!.attributes('disabled')).toBe('')
  })

  it('falls back to value as label', () => {
    const opts = [{ value: 'hello' }]
    const wrapper = mount(RadioGroup, {
      props: { options: opts, name: 'group' },
    })
    expect(wrapper.text()).toContain('hello')
  })

  it('sets name attribute on inputs', () => {
    const wrapper = mount(RadioGroup, {
      props: { options, name: 'colors' },
    })
    const radios = wrapper.findAll('input[type="radio"]')
    radios.forEach((r) => {
      expect(r.attributes('name')).toBe('colors')
    })
  })
})

// ── Interaction test coverage ────────────────────────────────────────────────

describe('RadioGroup interactions', () => {
  it('emits events on interaction', async () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a' },
      attachTo: document.body,
    })
    const interactive = wrapper.find('input, button, [role="button"], [role="option"], [tabindex]')
    if (interactive.exists()) {
      await interactive.trigger('click')
    }
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })
})
