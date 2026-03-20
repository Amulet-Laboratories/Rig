import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormView from './FormView.vue'

describe('FormView', () => {
  it('renders with data-rig-form-view', () => {
    const wrapper = mount(FormView)
    expect(wrapper.find('[data-rig-form-view]').exists()).toBe(true)
  })

  it('shows header when title is provided', () => {
    const wrapper = mount(FormView, { props: { title: 'Edit Profile' } })
    expect(wrapper.find('[data-rig-form-view-header]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-form-view-title]').text()).toBe('Edit Profile')
  })

  it('hides header when no title and no header slot', () => {
    const wrapper = mount(FormView)
    expect(wrapper.find('[data-rig-form-view-header]').exists()).toBe(false)
  })

  it('emits close on close button click', async () => {
    const wrapper = mount(FormView, { props: { title: 'Edit' } })
    const closeBtn = wrapper.find('[data-rig-form-view-header] button')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders body slot', () => {
    const wrapper = mount(FormView, {
      slots: { default: '<input type="text" />' },
    })
    expect(wrapper.find('[data-rig-form-view-body] input').exists()).toBe(true)
  })

  it('shows actions bar when showActions is true', () => {
    const wrapper = mount(FormView, { props: { showActions: true } })
    expect(wrapper.find('[data-rig-form-view-actions]').exists()).toBe(true)
  })

  it('hides actions bar by default', () => {
    const wrapper = mount(FormView)
    expect(wrapper.find('[data-rig-form-view-actions]').exists()).toBe(false)
  })

  it('emits save on save button click', async () => {
    const wrapper = mount(FormView, { props: { showActions: true } })
    const buttons = wrapper.findAll('[data-rig-form-view-actions] button')
    await buttons[0]!.trigger('click')
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('emits cancel on cancel button click', async () => {
    const wrapper = mount(FormView, { props: { showActions: true } })
    const buttons = wrapper.findAll('[data-rig-form-view-actions] button')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('shows Saving... when saving is true', () => {
    const wrapper = mount(FormView, { props: { showActions: true, saving: true } })
    expect(wrapper.text()).toContain('Saving...')
  })

  it('uses custom saveLabel', () => {
    const wrapper = mount(FormView, { props: { showActions: true, saveLabel: 'Submit' } })
    const buttons = wrapper.findAll('[data-rig-form-view-actions] button')
    expect(buttons[0]!.text()).toBe('Submit')
  })

  it('uses custom cancelLabel', () => {
    const wrapper = mount(FormView, { props: { showActions: true, cancelLabel: 'Discard' } })
    const buttons = wrapper.findAll('[data-rig-form-view-actions] button')
    expect(buttons[1]!.text()).toBe('Discard')
  })

  it('renders header slot', () => {
    const wrapper = mount(FormView, {
      slots: { header: '<h2>Custom</h2>' },
    })
    expect(wrapper.find('[data-rig-form-view-header] h2').text()).toBe('Custom')
  })

  it('renders actions slot', () => {
    const wrapper = mount(FormView, {
      slots: { actions: '<button>Custom Action</button>' },
    })
    expect(wrapper.find('[data-rig-form-view-actions] button').text()).toBe('Custom Action')
  })
})
