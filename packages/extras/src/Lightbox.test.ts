import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Lightbox from './Lightbox.vue'
import type { LightboxItem } from './Lightbox.vue'

const items: LightboxItem[] = [
  { src: '/a.png', alt: 'A', caption: 'First' },
  { src: '/b.png', alt: 'B', caption: 'Second' },
  { src: '/c.png', alt: 'C' },
]

function make(props: Record<string, unknown> = {}) {
  return mount(Lightbox, {
    props: { items, open: true, ...props },
    attachTo: document.body,
  })
}

// Modal teleports to body, so queries go through document — and the body must
// be cleared between tests or a query finds the previous mount's dialog.
const q = (sel: string) => document.body.querySelector(sel)

describe('Lightbox', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the current image inside a dialog', () => {
    make()
    expect(q('[data-rig-lightbox]')).not.toBeNull()
    expect(q('[role="dialog"]')).not.toBeNull()
    expect(
      (q('[data-rig-image-preview] img, [data-rig-lightbox] img') as HTMLImageElement).src,
    ).toContain('/a.png')
  })

  it('renders nothing when closed', () => {
    make({ open: false })
    const overlay = q('[data-rig-modal-overlay]') as HTMLElement
    expect(overlay.getAttribute('data-state')).toBe('closed')
  })

  it('shows caption and counter', () => {
    make({ index: 1 })
    expect(q('[data-rig-lightbox-caption]')!.textContent).toContain('Second')
    expect(q('[data-rig-lightbox-counter]')!.textContent).toContain('2 / 3')
  })

  it('next/prev buttons navigate and emit change', async () => {
    const wrapper = make()
    ;(q('[data-rig-lightbox-nav="next"]') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:index')?.at(-1)).toEqual([1])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([1])
  })

  it('prev is disabled at the first item', () => {
    make({ index: 0 })
    expect((q('[data-rig-lightbox-nav="prev"]') as HTMLButtonElement).disabled).toBe(true)
    expect((q('[data-rig-lightbox-nav="next"]') as HTMLButtonElement).disabled).toBe(false)
  })

  it('next is disabled at the last item', () => {
    make({ index: 2 })
    expect((q('[data-rig-lightbox-nav="next"]') as HTMLButtonElement).disabled).toBe(true)
    expect((q('[data-rig-lightbox-nav="prev"]') as HTMLButtonElement).disabled).toBe(false)
  })

  it('arrow keys navigate', async () => {
    const wrapper = make()
    const box = q('[data-rig-lightbox]') as HTMLElement
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:index')?.at(-1)).toEqual([0 + 1])
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:index')?.at(-1)).toEqual([2])
  })

  it('does not navigate past either end', async () => {
    const wrapper = make({ index: 0 })
    const box = q('[data-rig-lightbox]') as HTMLElement
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:index')).toBeUndefined()
  })

  it('close button closes', async () => {
    const wrapper = make()
    ;(q('[data-rig-lightbox-close]') as HTMLButtonElement).click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('caption slot receives the current item', () => {
    mount(Lightbox, {
      props: { items, open: true },
      slots: {
        caption: `<template #caption="{ item, index }">cap:{{ index }}:{{ item.alt }}</template>`,
      },
      attachTo: document.body,
    })
    expect(q('[data-rig-lightbox-caption]')!.textContent).toContain('cap:0:A')
  })

  it('extra slot replaces the image', () => {
    mount(Lightbox, {
      props: { items, open: true },
      slots: {
        extra: `<template #extra="{ item }"><video class="vid" :data-src="item.src" /></template>`,
      },
      attachTo: document.body,
    })
    expect(q('.vid')).not.toBeNull()
    expect(q('[data-rig-lightbox] img')).toBeNull()
  })
})
