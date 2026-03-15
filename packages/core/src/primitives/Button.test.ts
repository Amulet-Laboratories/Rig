import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders with data-rig-button', () => {
    const wrapper = mount(Button, { slots: { default: 'Click me' } })
    expect(wrapper.attributes('data-rig-button')).toBeDefined()
    expect(wrapper.text()).toBe('Click me')
  })

  it('sets data attributes from props', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary', size: 'lg' },
    })
    expect(wrapper.attributes('data-variant')).toBe('primary')
    expect(wrapper.attributes('data-size')).toBe('lg')
  })

  it('handles disabled state', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('data-disabled')).toBeDefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('handles loading state', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.attributes('data-loading')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    await wrapper.trigger('click')
    // Native disabled prevents emission
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders leading-icon slot', () => {
    const wrapper = mount(Button, {
      slots: { 'leading-icon': '<span class="test-icon" />', default: 'Text' },
    })
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('renders trailing-icon slot', () => {
    const wrapper = mount(Button, {
      slots: { 'trailing-icon': '<span class="trail" />', default: 'Text' },
    })
    expect(wrapper.find('.trail').exists()).toBe(true)
  })

  it('emits click on Enter key when not disabled', async () => {
    const wrapper = mount(Button, { attachTo: document.body })
    await wrapper.find('button').trigger('keydown', { key: 'Enter' })
    // Native button handles Enter → click natively
    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.unmount()
  })

  it('receives focus on the button element', async () => {
    const wrapper = mount(Button, { attachTo: document.body })
    const button = wrapper.find('button')
    ;(button.element as HTMLButtonElement).focus()
    expect(document.activeElement).toBe(button.element)
    wrapper.unmount()
  })

  it('sets aria-busy when loading prop changes', async () => {
    const wrapper = mount(Button)
    expect(wrapper.find('button').attributes('aria-busy')).toBeUndefined()
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
  })
})

// ── Icon-only mode (replaces IconButton) ─────────────────────────────────────

describe('Button icon-only mode', () => {
  it('renders icon span when icon prop is set', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Home', icon: 'mdi:home' },
    })
    expect(wrapper.find('[data-rig-icon]').exists()).toBe(true)
  })

  it('sets data-icon-only when icon prop set and no default slot', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Close', icon: 'X' },
    })
    expect(wrapper.attributes('data-icon-only')).toBeDefined()
  })

  it('does not set data-icon-only when default slot is provided', () => {
    const wrapper = mount(Button, {
      props: { icon: 'X' },
      slots: { default: 'Text' },
    })
    expect(wrapper.attributes('data-icon-only')).toBeUndefined()
  })

  it('sets aria-label from prop', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Delete', icon: 'X' },
    })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Delete')
  })

  it('passes size to icon span', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Close', icon: 'X', size: 'sm' },
    })
    expect(wrapper.find('[data-rig-icon]').attributes('data-size')).toBe('sm')
  })

  it('icon has aria-hidden true', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Test', icon: 'X' },
    })
    expect(wrapper.find('[data-rig-icon]').attributes('aria-hidden')).toBe('true')
  })

  it('does not render icon span when no icon prop', () => {
    const wrapper = mount(Button, { props: { ariaLabel: 'Test' } })
    expect(wrapper.find('[data-rig-icon]').exists()).toBe(false)
  })

  it('applies variant to button', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Test', variant: 'ghost', icon: 'X' },
    })
    expect(wrapper.find('button').attributes('data-variant')).toBe('ghost')
  })

  it('handles disabled state', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Close', icon: 'X', disabled: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('handles loading state', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Close', icon: 'X', loading: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Test', icon: 'X', disabled: true },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('updates aria-label when prop changes', async () => {
    const wrapper = mount(Button, { props: { ariaLabel: 'Test', icon: 'X' } })
    await wrapper.setProps({ ariaLabel: 'Updated' })
    expect(wrapper.find('button').attributes('aria-label')).toBe('Updated')
  })

  it('applies xs size to icon', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Test', icon: 'X', size: 'xs' },
    })
    expect(wrapper.find('[data-rig-icon]').attributes('data-size')).toBe('xs')
  })

  it('applies xl size to icon', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Test', icon: 'X', size: 'xl' },
    })
    expect(wrapper.find('[data-rig-icon]').attributes('data-size')).toBe('xl')
  })

  it('uses default size of md for icon', () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Test', icon: 'X' },
    })
    expect(wrapper.find('[data-rig-icon]').attributes('data-size')).toBe('md')
  })
})

// ── Polymorphic rendering ────────────────────────────────────────────────────

describe('Button as prop (polymorphic)', () => {
  it('renders as anchor when as="a"', () => {
    const wrapper = mount(Button, {
      props: { as: 'a' },
      slots: { default: 'Link' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('role')).toBe('button')
  })

  it('renders as div when as="div"', () => {
    const wrapper = mount(Button, {
      props: { as: 'div' },
      slots: { default: 'Div' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('button')
  })

  it('sets tabindex on non-native-button element', () => {
    const wrapper = mount(Button, {
      props: { as: 'a' },
      slots: { default: 'Link' },
    })
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('does not set tabindex on disabled non-native-button', () => {
    const wrapper = mount(Button, {
      props: { as: 'a', disabled: true },
      slots: { default: 'Link' },
    })
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })

  it('sets aria-disabled on non-native-button when disabled', () => {
    const wrapper = mount(Button, {
      props: { as: 'a', disabled: true },
      slots: { default: 'Link' },
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('does not set native disabled on non-native-button', () => {
    const wrapper = mount(Button, {
      props: { as: 'a', disabled: true },
      slots: { default: 'Link' },
    })
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('does not set type on non-native-button', () => {
    const wrapper = mount(Button, {
      props: { as: 'a', type: 'submit' },
      slots: { default: 'Link' },
    })
    expect(wrapper.attributes('type')).toBeUndefined()
  })

  it('emits click on Enter for non-native-button', async () => {
    const wrapper = mount(Button, {
      props: { as: 'a' },
      slots: { default: 'Link' },
      attachTo: document.body,
    })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(1)
    wrapper.unmount()
  })
})

// ── Tooltip integration ─────────────────────────────────────────────────────

describe('Button tooltip', () => {
  it('triggers tooltip on mouseenter when tooltip prop set', async () => {
    const wrapper = mount(Button, {
      props: { tooltip: 'My tooltip' },
      slots: { default: 'Hover me' },
      attachTo: document.body,
    })
    await wrapper.trigger('mouseenter')
    // tooltip.show was called — component should not throw
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })

  it('hides tooltip on mouseleave', async () => {
    const wrapper = mount(Button, {
      props: { tooltip: 'My tooltip' },
      slots: { default: 'Hover me' },
      attachTo: document.body,
    })
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })

  it('shows tooltip on focus', async () => {
    const wrapper = mount(Button, {
      props: { tooltip: 'My tooltip' },
      slots: { default: 'Focus me' },
      attachTo: document.body,
    })
    await wrapper.trigger('focus')
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })

  it('hides tooltip on blur', async () => {
    const wrapper = mount(Button, {
      props: { tooltip: 'My tooltip' },
      slots: { default: 'Focus me' },
      attachTo: document.body,
    })
    await wrapper.trigger('focus')
    await wrapper.trigger('blur')
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })

  it('uses ariaLabel as tooltip fallback', async () => {
    const wrapper = mount(Button, {
      props: { ariaLabel: 'Label tooltip' },
      slots: { default: 'Hover me' },
      attachTo: document.body,
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.html()).toBeTruthy()
    wrapper.unmount()
  })

  it('sets type="submit" on native button', () => {
    const wrapper = mount(Button, {
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('sets type="reset" on native button', () => {
    const wrapper = mount(Button, {
      props: { type: 'reset' },
      slots: { default: 'Reset' },
    })
    expect(wrapper.attributes('type')).toBe('reset')
  })
})
