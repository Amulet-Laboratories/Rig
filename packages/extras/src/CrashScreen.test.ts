import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import CrashScreen from './CrashScreen.vue'

/** A child that throws on demand, so the boundary has something to capture. */
const Bomb = defineComponent({
  props: { boom: { type: Boolean, default: false } },
  setup(props) {
    return () => {
      if (props.boom) throw new Error('detonated')
      return h('p', { 'data-child': '' }, 'all good')
    }
  },
})

describe('CrashScreen', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // The component logs the captured error by design; keep test output clean.
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('renders slot content while nothing has thrown', () => {
    const wrapper = mount(CrashScreen, { slots: { default: '<p data-child>all good</p>' } })
    expect(wrapper.find('[data-child]').exists()).toBe(true)
    expect(wrapper.find('[data-rig-crash-screen]').exists()).toBe(false)
  })

  it('shows the crash screen when a child throws', async () => {
    const wrapper = mount(CrashScreen, {
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()

    const screen = wrapper.find('[data-rig-crash-screen]')
    expect(screen.exists()).toBe(true)
    expect(screen.attributes('role')).toBe('alert')
    expect(wrapper.find('[data-rig-crash-screen-message]').text()).toBe('detonated')
    expect(wrapper.find('[data-child]').exists()).toBe(false)
  })

  it('logs the captured error', async () => {
    mount(CrashScreen, { slots: { default: () => h(Bomb, { boom: true }) } })
    await nextTick()
    expect(consoleError).toHaveBeenCalled()
    expect(consoleError.mock.calls[0]?.[0]).toBe('[CrashScreen]')
  })

  it('renders both recovery actions', async () => {
    const wrapper = mount(CrashScreen, {
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()

    const actions = wrapper.find('[data-rig-crash-screen-actions]')
    expect(actions.exists()).toBe(true)
    const labels = actions.findAll('button').map((b) => b.text())
    expect(labels).toEqual(['Try Again', 'Reload App'])
  })

  it('exposes the stack and lifecycle hook in the details block', async () => {
    const wrapper = mount(CrashScreen, {
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()
    const details = wrapper.find('[data-rig-crash-screen-details]')
    expect(details.exists()).toBe(true)
    expect(details.text()).toContain('Lifecycle:')
  })

  it('Try Again clears the error and restores the slot', async () => {
    // The bomb stops throwing before the retry, mirroring a transient failure.
    const boom = ref(true)
    const wrapper = mount(CrashScreen, {
      slots: { default: () => h(Bomb, { boom: boom.value }) },
    })
    await nextTick()
    expect(wrapper.find('[data-rig-crash-screen]').exists()).toBe(true)

    boom.value = false
    await wrapper.find('[data-rig-crash-screen-actions] button').trigger('click')
    await nextTick()

    expect(wrapper.find('[data-rig-crash-screen]').exists()).toBe(false)
    expect(wrapper.find('[data-child]').exists()).toBe(true)
  })

  it('does not let the error escape to the parent', async () => {
    // onErrorCaptured returns false, so mounting must not reject.
    expect(() =>
      mount(CrashScreen, { slots: { default: () => h(Bomb, { boom: true }) } }),
    ).not.toThrow()
  })
})
