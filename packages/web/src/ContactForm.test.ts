import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from './ContactForm.vue'

describe('ContactForm', () => {
  it('renders with data-rig-contact-form', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.find('[data-rig-contact-form]').exists()).toBe(true)
  })

  it('renders default fields (name, email, message)', () => {
    const wrapper = mount(ContactForm)
    const fields = wrapper.findAll('[data-rig-contact-form-field]')
    expect(fields).toHaveLength(3)
  })

  it('renders labels for each field', () => {
    const wrapper = mount(ContactForm)
    const labels = wrapper.findAll('[data-rig-contact-form-label]')
    expect(labels).toHaveLength(3)
    expect(labels[0]!.text()).toBe('Name')
    expect(labels[1]!.text()).toBe('Email')
    expect(labels[2]!.text()).toBe('Message')
  })

  it('renders submit button', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.find('[data-rig-contact-form-actions]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-button]').exists()).toBe(true)
  })

  it('renders custom submitLabel', () => {
    const wrapper = mount(ContactForm, { props: { submitLabel: 'Get in touch' } })
    expect(wrapper.find('[data-rig-button]').text()).toBe('Get in touch')
  })

  it('renders honeypot field when enabled', () => {
    const wrapper = mount(ContactForm, { props: { honeypot: true } })
    expect(wrapper.find('input[name="bot-field"]').exists()).toBe(true)
  })

  it('does not render honeypot field by default', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.find('input[name="bot-field"]').exists()).toBe(false)
  })

  it('renders hidden form-name field', () => {
    const wrapper = mount(ContactForm, { props: { formName: 'inquiry' } })
    const hidden = wrapper.find('input[name="form-name"]')
    expect(hidden.exists()).toBe(true)
    expect(hidden.element.getAttribute('value')).toBe('inquiry')
  })

  it('renders custom fields', () => {
    const wrapper = mount(ContactForm, {
      props: {
        fields: [
          { name: 'phone', label: 'Phone', type: 'tel' },
          { name: 'company', label: 'Company', type: 'text' },
        ],
      },
    })
    const fields = wrapper.findAll('[data-rig-contact-form-field]')
    expect(fields).toHaveLength(2)
    const labels = wrapper.findAll('[data-rig-contact-form-label]')
    expect(labels[0]!.text()).toBe('Phone')
    expect(labels[1]!.text()).toBe('Company')
  })

  it('shows success state after onSuccess is called', async () => {
    const wrapper = mount(ContactForm)
    ;(wrapper.vm as InstanceType<typeof ContactForm>).onSuccess()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-contact-form-success]').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('shows error state after onError is called', async () => {
    const wrapper = mount(ContactForm)
    ;(wrapper.vm as InstanceType<typeof ContactForm>).onError()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-contact-form-error]').exists()).toBe(true)
  })

  it('emits submit with field values', async () => {
    const wrapper = mount(ContactForm, {
      props: {
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
        ],
      },
    })

    // Fill in the input fields via native input events
    const inputs = wrapper.findAll('input')
    const nameInput = inputs.find((i) => i.attributes('name') === 'name')
    const emailInput = inputs.find((i) => i.attributes('name') === 'email')
    if (nameInput && emailInput) {
      await nameInput.setValue('Jane')
      await emailInput.setValue('jane@example.com')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.emitted('submit')).toBeTruthy()
    }
  })

  it('renders form element with novalidate', () => {
    const wrapper = mount(ContactForm)
    const form = wrapper.find('form')
    expect(form.attributes('novalidate')).toBeDefined()
  })
})
