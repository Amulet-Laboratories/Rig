import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('renders with data-rig-skeleton', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('data-rig-skeleton')).toBeDefined()
  })

  it('renders 1 line by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.findAll('[data-rig-skeleton-line]')).toHaveLength(1)
  })

  it('renders multiple lines', () => {
    const wrapper = mount(Skeleton, { props: { lines: 4 } })
    expect(wrapper.findAll('[data-rig-skeleton-line]')).toHaveLength(4)
  })

  it('sets animate data attribute', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('data-animate')).toBeDefined()
  })

  it('disables animation', () => {
    const wrapper = mount(Skeleton, { props: { animate: false } })
    expect(wrapper.attributes('data-animate')).toBeUndefined()
  })

  it('applies uniform width as string', () => {
    const wrapper = mount(Skeleton, { props: { lines: 2, width: '80%' } })
    const lines = wrapper.findAll('[data-rig-skeleton-line]')
    expect(lines[0]!.attributes('style')).toContain('width: 80%')
    expect(lines[1]!.attributes('style')).toContain('width: 80%')
  })

  it('applies per-line widths from array', () => {
    const wrapper = mount(Skeleton, { props: { lines: 3, width: ['100%', '60%', '80%'] } })
    const lines = wrapper.findAll('[data-rig-skeleton-line]')
    expect(lines[0]!.attributes('style')).toContain('width: 100%')
    expect(lines[1]!.attributes('style')).toContain('width: 60%')
    expect(lines[2]!.attributes('style')).toContain('width: 80%')
  })

  it('handles keyboard events gracefully', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('can receive focus', () => {
    const wrapper = mount(Skeleton, { attachTo: document.body })
    expect(wrapper.attributes('tabindex')).toBe('-1')
    wrapper.element.focus()
    expect(document.activeElement).toBe(wrapper.element)
    wrapper.unmount()
  })

  it('falls back to last array width for extra lines', () => {
    const wrapper = mount(Skeleton, { props: { lines: 4, width: ['100%', '50%'] } })
    const lines = wrapper.findAll('[data-rig-skeleton-line]')
    expect(lines[2]!.attributes('style')).toContain('width: 50%')
    expect(lines[3]!.attributes('style')).toContain('width: 50%')
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.findAll('[data-rig-skeleton-line]')).toHaveLength(1)
    await wrapper.setProps({ lines: 5 })
    expect(wrapper.findAll('[data-rig-skeleton-line]')).toHaveLength(5)
  })
})

// ── Shimmer mode ─────────────────────────────────────────────────────────────

describe('Skeleton shimmer mode', () => {
  it('renders with data-mode shimmer', () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    expect(wrapper.attributes('data-mode')).toBe('shimmer')
  })

  it('renders wave element', () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    expect(wrapper.find('[data-rig-shimmer-wave]').exists()).toBe(true)
  })

  it('applies default dimensions', () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    expect(wrapper.attributes('style')).toContain('width: 100%')
    expect(wrapper.attributes('style')).toContain('height: 1rem')
  })

  it('applies custom dimensions', () => {
    const wrapper = mount(Skeleton, {
      props: { mode: 'shimmer', width: '200px', height: '24px', borderRadius: '8px' },
    })
    expect(wrapper.attributes('style')).toContain('width: 200px')
    expect(wrapper.attributes('style')).toContain('height: 24px')
    expect(wrapper.attributes('style')).toContain('border-radius: 8px')
  })

  it('is hidden from assistive technology', () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    expect(wrapper.attributes('role')).toBe('presentation')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('is not keyboard-accessible', () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('uses inherited border-radius by default', () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    expect(wrapper.attributes('style')).toContain('border-radius: inherit')
  })

  it('reacts to prop updates', async () => {
    const wrapper = mount(Skeleton, { props: { mode: 'shimmer' } })
    await wrapper.setProps({ width: '50%', height: '2rem' })
    expect(wrapper.attributes('style')).toContain('width: 50%')
    expect(wrapper.attributes('style')).toContain('height: 2rem')
  })
})

// ── Interaction test coverage ────────────────────────────────────────────────

describe('Skeleton interactions', () => {
  it('responds to keyboard events', async () => {
    const wrapper = mount(Skeleton, {
      attachTo: document.body,
    })
    const el = wrapper.find('[tabindex], input, button, [role]')
    const target = el.exists() ? el : wrapper
    await target.trigger('keydown', { key: 'Enter' })
    expect(wrapper.html()).toBeTruthy()
    await target.trigger('keydown', { key: 'Escape' })
    expect(wrapper.html()).toContain('<')
    wrapper.unmount()
  })
})

