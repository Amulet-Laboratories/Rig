import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Form from './Form.vue'

describe('Form', () => {
  const defaultProps = {
    initialValues: { name: '', email: '' },
  }

  it('renders with data-rig-form', () => {
    const wrapper = mount(Form, { props: defaultProps })
    expect(wrapper.find('[data-rig-form]').exists()).toBe(true)
  })

  it('renders as a <form> element', () => {
    const wrapper = mount(Form, { props: defaultProps })
    expect(wrapper.element.tagName).toBe('FORM')
  })

  it('sets novalidate attribute', () => {
    const wrapper = mount(Form, { props: defaultProps })
    expect(wrapper.attributes('novalidate')).toBe('')
  })

  it('exposes values through scoped slot', () => {
    const wrapper = mount(Form, {
      props: { initialValues: { name: 'Alice' } },
      slots: {
        default: `<template #default="{ values }">
          <span data-test-value>{{ values.name }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-value]').text()).toBe('Alice')
  })

  it('exposes isValid through scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ isValid }">
          <span data-test-valid>{{ isValid }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-valid]').text()).toBe('true')
  })

  it('exposes isDirty through scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ isDirty }">
          <span data-test-dirty>{{ isDirty }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-dirty]').text()).toBe('false')
  })

  it('exposes errors through scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ errors }">
          <span data-test-errors>{{ Object.keys(errors).length }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-errors]').text()).toBe('0')
  })

  it('emits submit with values when form is valid', async () => {
    const wrapper = mount(Form, {
      props: { initialValues: { name: 'Alice' } },
      slots: {
        default: `<template #default="{ values }">
          <button type="submit">Submit</button>
        </template>`,
      },
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')![0]).toEqual([{ name: 'Alice' }])
  })

  it('emits validation-error when form is invalid on submit', async () => {
    const required = (v: unknown) => (!v ? 'Required' : undefined)
    const wrapper = mount(Form, {
      props: {
        initialValues: { name: '' },
        rules: { name: [required] },
      },
      slots: {
        default: `<template #default>
          <button type="submit">Submit</button>
        </template>`,
      },
    })
    await wrapper.find('form').trigger('submit')
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.emitted('validation-error')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('does not emit submit when validation fails', async () => {
    const alwaysFail = () => 'Error'
    const wrapper = mount(Form, {
      props: {
        initialValues: { name: 'test' },
        rules: { name: [alwaysFail] },
      },
      slots: {
        default: `<template #default>
          <button type="submit">Submit</button>
        </template>`,
      },
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('sets data-valid when form has no errors', () => {
    const wrapper = mount(Form, { props: defaultProps })
    expect(wrapper.find('form').attributes('data-valid')).not.toBeUndefined()
  })

  it('does not set data-dirty initially', () => {
    const wrapper = mount(Form, { props: defaultProps })
    expect(wrapper.find('form').attributes('data-dirty')).toBeUndefined()
  })

  it('exposes validate function in scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ validate }">
          <span data-test-fn>{{ typeof validate }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-fn]').text()).toBe('function')
  })

  it('exposes reset function in scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ reset }">
          <span data-test-fn>{{ typeof reset }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-fn]').text()).toBe('function')
  })

  it('exposes setFieldValue function in scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ setFieldValue }">
          <span data-test-fn>{{ typeof setFieldValue }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-fn]').text()).toBe('function')
  })

  it('exposes fieldAttrs function in scoped slot', () => {
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: {
        default: `<template #default="{ fieldAttrs }">
          <span data-test-fn>{{ typeof fieldAttrs }}</span>
        </template>`,
      },
    })
    expect(wrapper.find('[data-test-fn]').text()).toBe('function')
  })

  it('prevents default on form submit', async () => {
    let defaultPrevented = false
    const wrapper = mount(Form, {
      props: defaultProps,
      slots: { default: '<button type="submit">Go</button>' },
    })
    const form = wrapper.find('form')
    form.element.addEventListener('submit', (e) => {
      defaultPrevented = e.defaultPrevented
    })
    await form.trigger('submit')
    expect(defaultPrevented).toBe(true)
  })
})
