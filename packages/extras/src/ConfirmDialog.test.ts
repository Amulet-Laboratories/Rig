import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { requestConfirm, useConfirm } from '@core/composables/useConfirm'

function cleanUpOverlays() {
  document.querySelectorAll('[data-rig-modal-overlay]').forEach((el) => el.remove())
}

function factory() {
  return mount(ConfirmDialog, { attachTo: document.body })
}

describe('ConfirmDialog', () => {
  afterEach(() => {
    const { cancel } = useConfirm()
    cancel()
    cleanUpOverlays()
  })

  it('does not show dialog content when no pending confirmation', () => {
    const wrapper = factory()
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.style.display).toBe('none')
    wrapper.unmount()
  })

  it('renders dialog when a confirmation is requested', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Delete this item?' })
    await nextTick()
    await nextTick()
    const dialog = document.querySelector('[data-rig-confirm-dialog]')
    expect(dialog).not.toBeNull()
    wrapper.unmount()
  })

  it('displays the message text', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Are you sure you want to proceed?' })
    await nextTick()
    await nextTick()
    const message = document.querySelector('[data-rig-confirm-dialog-message]')
    expect(message?.textContent).toContain('Are you sure you want to proceed?')
    wrapper.unmount()
  })

  it('uses default title "Confirm" when no title provided', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Test message' })
    await nextTick()
    await nextTick()
    const title = document.querySelector('[data-rig-confirm-dialog-title]')
    expect(title?.textContent?.trim()).toBe('Confirm')
    wrapper.unmount()
  })

  it('renders custom title when provided', async () => {
    const wrapper = factory()
    requestConfirm({ title: 'Delete item', message: 'This cannot be undone.' })
    await nextTick()
    await nextTick()
    const title = document.querySelector('[data-rig-confirm-dialog-title]')
    expect(title?.textContent?.trim()).toBe('Delete item')
    wrapper.unmount()
  })

  it('uses default confirm label "Confirm" when none provided', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Proceed?' })
    await nextTick()
    await nextTick()
    const actions = document.querySelector('[data-rig-confirm-dialog-actions]')
    const buttons = actions?.querySelectorAll('button')
    const confirmBtn = buttons?.[buttons.length - 1]
    expect(confirmBtn?.textContent?.trim()).toBe('Confirm')
    wrapper.unmount()
  })

  it('renders custom confirm label', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Delete?', confirmLabel: 'Yes, delete' })
    await nextTick()
    await nextTick()
    const actions = document.querySelector('[data-rig-confirm-dialog-actions]')
    const buttons = actions?.querySelectorAll('button')
    const confirmBtn = buttons?.[buttons.length - 1]
    expect(confirmBtn?.textContent?.trim()).toBe('Yes, delete')
    wrapper.unmount()
  })

  it('has role="alertdialog" and aria-modal="true"', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Alert test' })
    await nextTick()
    await nextTick()
    const dialog = document.querySelector('[data-rig-confirm-dialog]')
    expect(dialog?.getAttribute('role')).toBe('alertdialog')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    wrapper.unmount()
  })

  it('has aria-describedby pointing to the message', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Described by test' })
    await nextTick()
    await nextTick()
    const dialog = document.querySelector('[data-rig-confirm-dialog]')
    expect(dialog?.getAttribute('aria-describedby')).toBe('rig-confirm-desc')
    const desc = document.getElementById('rig-confirm-desc')
    expect(desc?.textContent).toContain('Described by test')
    wrapper.unmount()
  })

  it('resolves to true when confirm is clicked', async () => {
    const wrapper = factory()
    const result = requestConfirm({ message: 'Confirm this?' })
    await nextTick()
    await nextTick()
    const actions = document.querySelector('[data-rig-confirm-dialog-actions]')
    const buttons = actions?.querySelectorAll('button')
    const confirmBtn = buttons?.[buttons.length - 1] as HTMLButtonElement
    confirmBtn.click()
    await nextTick()
    expect(await result).toBe(true)
    wrapper.unmount()
  })

  it('resolves to false when cancel is clicked', async () => {
    const wrapper = factory()
    const result = requestConfirm({ message: 'Cancel this?' })
    await nextTick()
    await nextTick()
    const actions = document.querySelector('[data-rig-confirm-dialog-actions]')
    const buttons = actions?.querySelectorAll('button')
    const cancelBtn = buttons?.[0] as HTMLButtonElement
    cancelBtn.click()
    await nextTick()
    expect(await result).toBe(false)
    wrapper.unmount()
  })

  it('closes dialog after confirming', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Close after confirm' })
    await nextTick()
    await nextTick()
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.style.display).not.toBe('none')
    const actions = document.querySelector('[data-rig-confirm-dialog-actions]')
    const buttons = actions?.querySelectorAll('button')
    const confirmBtn = buttons?.[buttons.length - 1] as HTMLButtonElement
    confirmBtn.click()
    await nextTick()
    await nextTick()
    expect(overlay?.style.display).toBe('none')
    wrapper.unmount()
  })

  it('closes dialog after cancelling', async () => {
    const wrapper = factory()
    requestConfirm({ message: 'Close after cancel' })
    await nextTick()
    await nextTick()
    const overlay = document.querySelector('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay?.style.display).not.toBe('none')
    const actions = document.querySelector('[data-rig-confirm-dialog-actions]')
    const buttons = actions?.querySelectorAll('button')
    const cancelBtn = buttons?.[0] as HTMLButtonElement
    cancelBtn.click()
    await nextTick()
    await nextTick()
    expect(overlay?.style.display).toBe('none')
    wrapper.unmount()
  })
})
