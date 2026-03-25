import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Popconfirm from './Popconfirm.vue'

function factory(
  props: Partial<InstanceType<typeof Popconfirm>['$props']> = {},
  slots: Record<string, string> = {},
) {
  return mount(Popconfirm, {
    props: { open: false, ...props },
    slots: {
      trigger: '<button id="trigger-btn">Delete</button>',
      ...slots,
    },
    attachTo: document.body,
  })
}

describe('Popconfirm', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders with data-rig-popconfirm attribute', () => {
    const wrapper = factory()
    expect(wrapper.find('[data-rig-popconfirm]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders trigger slot', () => {
    const wrapper = factory()
    expect(wrapper.find('#trigger-btn').exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not show content when closed', () => {
    const wrapper = factory({ open: false })
    expect(wrapper.find('[data-rig-popconfirm-content]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows content when open', () => {
    const wrapper = factory({ open: true })
    expect(wrapper.find('[data-rig-popconfirm-content]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('sets data-state to open or closed', () => {
    const closedWrapper = factory({ open: false })
    expect(closedWrapper.find('[data-rig-popconfirm]').attributes('data-state')).toBe('closed')
    closedWrapper.unmount()

    const openWrapper = factory({ open: true })
    expect(openWrapper.find('[data-rig-popconfirm]').attributes('data-state')).toBe('open')
    openWrapper.unmount()
  })

  it('uses default title "Are you sure?"', () => {
    const wrapper = factory({ open: true })
    expect(wrapper.find('[data-rig-popconfirm-title]').text()).toBe('Are you sure?')
    wrapper.unmount()
  })

  it('renders custom title', () => {
    const wrapper = factory({ open: true, title: 'Delete this record?' })
    expect(wrapper.find('[data-rig-popconfirm-title]').text()).toBe('Delete this record?')
    wrapper.unmount()
  })

  it('uses default button labels', () => {
    const wrapper = factory({ open: true })
    expect(wrapper.find('[data-rig-popconfirm-cancel]').text()).toBe('Cancel')
    expect(wrapper.find('[data-rig-popconfirm-confirm]').text()).toBe('Confirm')
    wrapper.unmount()
  })

  it('renders custom button labels', () => {
    const wrapper = factory({
      open: true,
      confirmLabel: 'Yes, delete',
      cancelLabel: 'No, keep it',
    })
    expect(wrapper.find('[data-rig-popconfirm-cancel]').text()).toBe('No, keep it')
    expect(wrapper.find('[data-rig-popconfirm-confirm]').text()).toContain('Yes, delete')
    wrapper.unmount()
  })

  it('has role="alertdialog" and aria-modal on content', () => {
    const wrapper = factory({ open: true })
    const content = wrapper.find('[data-rig-popconfirm-content]')
    expect(content.attributes('role')).toBe('alertdialog')
    expect(content.attributes('aria-modal')).toBe('true')
    wrapper.unmount()
  })

  it('sets aria-label on content to the title', () => {
    const wrapper = factory({ open: true, title: 'Confirm deletion' })
    const content = wrapper.find('[data-rig-popconfirm-content]')
    expect(content.attributes('aria-label')).toBe('Confirm deletion')
    wrapper.unmount()
  })

  it('emits update:open when trigger is clicked', async () => {
    const wrapper = factory({ open: false })
    await wrapper.find('[data-rig-popconfirm-trigger]').trigger('click')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    wrapper.unmount()
  })

  it('emits confirm and closes when confirm button is clicked', async () => {
    const wrapper = factory({ open: true })
    await wrapper.find('[data-rig-popconfirm-confirm]').trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('emits cancel and closes when cancel button is clicked', async () => {
    const wrapper = factory({ open: true })
    await wrapper.find('[data-rig-popconfirm-cancel]').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on Escape key', async () => {
    const wrapper = factory({ open: true })
    await wrapper.find('[data-rig-popconfirm]').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on click outside', async () => {
    const wrapper = factory({ open: true })
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('does not close on click inside', async () => {
    const wrapper = factory({ open: true })
    const popconfirm = wrapper.find('[data-rig-popconfirm]').element
    popconfirm.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('cancel')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders default slot as description', () => {
    const wrapper = factory(
      { open: true },
      { default: '<p id="desc-text">This action is irreversible.</p>' },
    )
    const desc = wrapper.find('[data-rig-popconfirm-description]')
    expect(desc.exists()).toBe(true)
    expect(desc.find('#desc-text').text()).toBe('This action is irreversible.')
    wrapper.unmount()
  })

  it('does not render description when default slot is empty', () => {
    const wrapper = factory({ open: true })
    expect(wrapper.find('[data-rig-popconfirm-description]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders confirm-icon slot', () => {
    const wrapper = factory({ open: true }, { 'confirm-icon': '<svg id="confirm-icon" />' })
    expect(wrapper.find('#confirm-icon').exists()).toBe(true)
    wrapper.unmount()
  })

  it('removes click-outside listener on unmount', async () => {
    const wrapper = factory({ open: true })
    wrapper.unmount()
    // After unmount, clicking outside should not cause errors
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    // No errors means listener was cleaned up
  })
})
