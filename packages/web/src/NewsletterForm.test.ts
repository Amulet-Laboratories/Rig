import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsletterForm from './NewsletterForm.vue'

describe('NewsletterForm', () => {
  it('renders with data-rig-newsletter-form', () => {
    const wrapper = mount(NewsletterForm)
    expect(wrapper.find('[data-rig-newsletter-form]').exists()).toBe(true)
  })

  it('renders email input and submit button', () => {
    const wrapper = mount(NewsletterForm)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-button]').exists()).toBe(true)
  })

  it('renders custom placeholder', () => {
    const wrapper = mount(NewsletterForm, { props: { placeholder: 'Your email' } })
    expect(wrapper.find('input[type="email"]').attributes('placeholder')).toBe('Your email')
  })

  it('renders custom buttonText', () => {
    const wrapper = mount(NewsletterForm, { props: { buttonText: 'Join' } })
    expect(wrapper.find('[data-rig-button]').text()).toBe('Join')
  })

  it('renders honeypot field when enabled', () => {
    const wrapper = mount(NewsletterForm, { props: { honeypot: true } })
    expect(wrapper.find('input[name="bot-field"]').exists()).toBe(true)
  })

  it('does not render honeypot field by default', () => {
    const wrapper = mount(NewsletterForm)
    expect(wrapper.find('input[name="bot-field"]').exists()).toBe(false)
  })

  it('renders inline form layout', () => {
    const wrapper = mount(NewsletterForm)
    expect(wrapper.find('[data-rig-newsletter-form-body]').exists()).toBe(true)
  })

  it('shows success state after onSuccess is called', async () => {
    const wrapper = mount(NewsletterForm)
    ;(wrapper.vm as InstanceType<typeof NewsletterForm>).onSuccess()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-newsletter-form-success]').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('renders custom success message', async () => {
    const wrapper = mount(NewsletterForm, { props: { successMessage: 'Welcome aboard.' } })
    ;(wrapper.vm as InstanceType<typeof NewsletterForm>).onSuccess()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-newsletter-form-success]').text()).toBe('Welcome aboard.')
  })

  it('shows error state after onError is called', async () => {
    const wrapper = mount(NewsletterForm)
    ;(wrapper.vm as InstanceType<typeof NewsletterForm>).onError()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-rig-newsletter-form-error]').exists()).toBe(true)
  })

  it('emits subscribe with email value', async () => {
    const wrapper = mount(NewsletterForm)
    const input = wrapper.find('input[type="email"]')
    await input.setValue('test@example.com')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('subscribe')).toBeTruthy()
    expect(wrapper.emitted('subscribe')![0]).toEqual(['test@example.com'])
  })

  it('does not emit when email is empty', async () => {
    const wrapper = mount(NewsletterForm)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('subscribe')).toBeFalsy()
  })

  it('renders default slot content', () => {
    const wrapper = mount(NewsletterForm, {
      slots: { default: '<p>Get updates</p>' },
    })
    expect(wrapper.text()).toContain('Get updates')
  })

  it('renders form with novalidate', () => {
    const wrapper = mount(NewsletterForm)
    const form = wrapper.find('form')
    expect(form.attributes('novalidate')).toBeDefined()
  })
})
