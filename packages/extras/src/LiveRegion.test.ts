import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import LiveRegion from './LiveRegion.vue'
import { AnnounceKey } from '@core/injection-keys'

function mountWithAnnounce(message = '') {
  const messageRef = ref(message)
  const announceFn = vi.fn((text: string) => {
    messageRef.value = text
  })

  const wrapper = mount(LiveRegion, {
    global: {
      provide: {
        [AnnounceKey as symbol]: {
          message: messageRef,
          announce: announceFn,
        },
      },
    },
  })

  return { wrapper, messageRef, announceFn }
}

describe('LiveRegion', () => {
  it('renders with data-rig-live-region', () => {
    const { wrapper } = mountWithAnnounce()
    expect(wrapper.find('[data-rig-live-region]').exists()).toBe(true)
  })

  it('sets aria-live to polite', () => {
    const { wrapper } = mountWithAnnounce()
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('sets aria-atomic to true', () => {
    const { wrapper } = mountWithAnnounce()
    expect(wrapper.attributes('aria-atomic')).toBe('true')
  })

  it('sets role to status', () => {
    const { wrapper } = mountWithAnnounce()
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('renders as a <div> element', () => {
    const { wrapper } = mountWithAnnounce()
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('displays the announce message', () => {
    const { wrapper } = mountWithAnnounce('Record saved')
    expect(wrapper.text()).toContain('Record saved')
  })

  it('is empty when no message is announced', () => {
    const { wrapper } = mountWithAnnounce('')
    expect(wrapper.text().trim()).toBe('')
  })

  it('updates text when message changes', async () => {
    const { wrapper, messageRef } = mountWithAnnounce('')
    expect(wrapper.text().trim()).toBe('')

    messageRef.value = 'Item deleted'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Item deleted')
  })

  it('clears text when message is reset to empty', async () => {
    const { wrapper, messageRef } = mountWithAnnounce('Hello')
    expect(wrapper.text()).toContain('Hello')

    messageRef.value = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.text().trim()).toBe('')
  })

  it('reflects the latest message after multiple updates', async () => {
    const { wrapper, messageRef } = mountWithAnnounce('')

    messageRef.value = 'First'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('First')

    messageRef.value = 'Second'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Second')

    messageRef.value = 'Third'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Third')
  })

  it('renders without errors when no provider is given', () => {
    // Falls back to module-level singleton from useAnnounce
    const wrapper = mount(LiveRegion)
    expect(wrapper.find('[data-rig-live-region]').exists()).toBe(true)
  })

  it('has all required ARIA attributes simultaneously', () => {
    const { wrapper } = mountWithAnnounce()
    const el = wrapper.find('[data-rig-live-region]')
    expect(el.attributes('aria-live')).toBe('polite')
    expect(el.attributes('aria-atomic')).toBe('true')
    expect(el.attributes('role')).toBe('status')
  })
})
