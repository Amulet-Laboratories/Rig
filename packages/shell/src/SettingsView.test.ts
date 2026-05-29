import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsView from './SettingsView.vue'

describe('SettingsView', () => {
  it('renders with data-rig-settings-view', () => {
    const wrapper = mount(SettingsView)
    expect(wrapper.find('[data-rig-settings-view]').exists()).toBe(true)
  })

  it('renders header', () => {
    const wrapper = mount(SettingsView)
    expect(wrapper.find('[data-rig-settings-view-header]').exists()).toBe(true)
  })

  it('displays Settings as default title', () => {
    const wrapper = mount(SettingsView)
    expect(wrapper.find('[data-rig-settings-view-title]').text()).toBe('Settings')
  })

  it('displays custom title', () => {
    const wrapper = mount(SettingsView, { props: { title: 'Preferences' } })
    expect(wrapper.find('[data-rig-settings-view-title]').text()).toBe('Preferences')
  })

  it('emits close on close button click', async () => {
    const wrapper = mount(SettingsView)
    const closeBtn = wrapper.find('[data-rig-settings-view-header] button')
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders default slot in body', () => {
    const wrapper = mount(SettingsView, {
      slots: { default: '<div class="setting">Theme</div>' },
    })
    expect(wrapper.find('[data-rig-settings-view-body] .setting').text()).toBe('Theme')
  })

  it('renders header slot', () => {
    const wrapper = mount(SettingsView, {
      slots: { header: '<h2>Custom Header</h2>' },
    })
    expect(wrapper.find('[data-rig-settings-view-header] h2').text()).toBe('Custom Header')
  })

  it('renders footer slot', () => {
    const wrapper = mount(SettingsView, {
      slots: { footer: '<span>v1.0.0</span>' },
    })
    expect(wrapper.find('[data-rig-settings-view-footer] span').text()).toBe('v1.0.0')
  })

  it('hides footer when no footer slot', () => {
    const wrapper = mount(SettingsView)
    expect(wrapper.find('[data-rig-settings-view-footer]').exists()).toBe(false)
  })
})
