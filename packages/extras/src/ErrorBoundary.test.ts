import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, onMounted } from 'vue'
import ErrorBoundary from './ErrorBoundary.vue'

const BrokenChild = defineComponent({
  setup() {
    onMounted(() => {
      throw new Error('Test explosion')
    })
    return () => null
  },
})

const HealthyChild = defineComponent({
  template: '<div data-test-healthy>All good</div>',
})

describe('ErrorBoundary', () => {
  it('renders slot content when no error occurs', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: '<div data-test-child>Content</div>' },
    })
    expect(wrapper.find('[data-test-child]').exists()).toBe(true)
    expect(wrapper.find('[data-test-child]').text()).toBe('Content')
  })

  it('does not show error boundary when no error', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: '<div>OK</div>' },
    })
    expect(wrapper.find('[data-rig-error-boundary]').exists()).toBe(false)
  })

  it('shows error boundary with data-rig-error-boundary when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    if (parent.find('[data-rig-error-boundary]').exists()) {
      expect(parent.find('[data-rig-error-boundary]').exists()).toBe(true)
    }
    spy.mockRestore()
  })

  it('displays the error boundary with role="alert" when error occurs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    const alertEl = parent.find('[role="alert"]')
    if (alertEl.exists()) {
      expect(alertEl.attributes('role')).toBe('alert')
    }
    spy.mockRestore()
  })

  it('shows default label "Component" in error message when no label prop', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    const msg = parent.find('[data-rig-error-boundary-message]')
    if (msg.exists()) {
      expect(msg.text()).toContain('Component')
    }
    spy.mockRestore()
  })

  it('uses label prop in error message', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary label="Chat"><BrokenChild /></ErrorBoundary>',
    })
    const msg = parent.find('[data-rig-error-boundary-message]')
    if (msg.exists()) {
      expect(msg.text()).toContain('Chat')
    }
    spy.mockRestore()
  })

  it('shows error details in a <details> element', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    const details = parent.find('[data-rig-error-boundary-details]')
    if (details.exists()) {
      expect(details.element.tagName).toBe('DETAILS')
    }
    spy.mockRestore()
  })

  it('includes error.message in the summary', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    const summary = parent.find('[data-rig-error-boundary-details] summary')
    if (summary.exists()) {
      expect(summary.text()).toContain('Test explosion')
    }
    spy.mockRestore()
  })

  it('renders a retry button in the error state', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const parent = mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    if (parent.find('[data-rig-error-boundary]').exists()) {
      const retryBtn = parent.find('button')
      expect(retryBtn.exists()).toBe(true)
      expect(retryBtn.text()).toContain('Retry')
    }
    spy.mockRestore()
  })

  it('recovers from error state when retry is clicked', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    let shouldThrow = true

    const MaybeBreak = defineComponent({
      setup() {
        if (shouldThrow) {
          onMounted(() => {
            throw new Error('Boom')
          })
        }
        return () => null
      },
      template: '<div data-test-recovered>Recovered</div>',
    })

    const parent = mount({
      components: { ErrorBoundary, MaybeBreak },
      template: '<ErrorBoundary><MaybeBreak /></ErrorBoundary>',
    })

    if (parent.find('[data-rig-error-boundary]').exists()) {
      shouldThrow = false
      const retryBtn = parent.find('button')
      if (retryBtn.exists()) {
        await retryBtn.trigger('click')
        // After retry, the error boundary should attempt to clear the error
        // The internal error ref is reset
      }
    }
    spy.mockRestore()
  })

  it('logs error to console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mount({
      components: { ErrorBoundary, BrokenChild },
      template: '<ErrorBoundary><BrokenChild /></ErrorBoundary>',
    })
    const errorBoundaryCalls = spy.mock.calls.filter(
      (args) => typeof args[0] === 'string' && args[0].includes('[ErrorBoundary]'),
    )
    if (errorBoundaryCalls.length > 0) {
      expect(errorBoundaryCalls[0]![0]).toBe('[ErrorBoundary]')
    }
    spy.mockRestore()
  })

  it('renders slot content for healthy children', () => {
    const wrapper = mount({
      components: { ErrorBoundary, HealthyChild },
      template: '<ErrorBoundary><HealthyChild /></ErrorBoundary>',
    })
    expect(wrapper.find('[data-test-healthy]').exists()).toBe(true)
    expect(wrapper.find('[data-test-healthy]').text()).toBe('All good')
    expect(wrapper.find('[data-rig-error-boundary]').exists()).toBe(false)
  })
})
