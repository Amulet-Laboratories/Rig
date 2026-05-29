import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useMediaPlayback } from './useMediaPlayback'

function createMockMedia() {
  return {
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    paused: true,
  } as unknown as HTMLMediaElement
}

describe('useMediaPlayback', () => {
  it('plays media when playWhen becomes true', async () => {
    const mockMedia = createMockMedia()
    const playWhen = ref(false)

    const Comp = defineComponent({
      setup() {
        const mediaRef = ref<HTMLMediaElement | null>(mockMedia)
        useMediaPlayback(mediaRef, { playWhen, respectReducedMotion: false })
        return {}
      },
      render() {
        return h('div')
      },
    })

    mount(Comp)

    // Initially should be paused (playWhen is false, immediate watch fires)
    await nextTick()
    expect(mockMedia.pause).toHaveBeenCalled()

    playWhen.value = true
    await nextTick()
    expect(mockMedia.play).toHaveBeenCalled()
  })

  it('pauses media when playWhen becomes false', async () => {
    const mockMedia = createMockMedia()
    const playWhen = ref(true)

    const Comp = defineComponent({
      setup() {
        const mediaRef = ref<HTMLMediaElement | null>(mockMedia)
        useMediaPlayback(mediaRef, { playWhen, respectReducedMotion: false })
        return {}
      },
      render() {
        return h('div')
      },
    })

    mount(Comp)
    await nextTick()
    expect(mockMedia.play).toHaveBeenCalled()

    playWhen.value = false
    await nextTick()
    expect(mockMedia.pause).toHaveBeenCalled()
  })

  it('pauses media on unmount', async () => {
    const mockMedia = createMockMedia()
    const playWhen = ref(true)

    const Comp = defineComponent({
      setup() {
        const mediaRef = ref<HTMLMediaElement | null>(mockMedia)
        useMediaPlayback(mediaRef, { playWhen, respectReducedMotion: false })
        return {}
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(Comp)
    await nextTick()

    wrapper.unmount()
    // pause should have been called when unmounting
    expect(mockMedia.pause).toHaveBeenCalled()
  })

  it('does not play when mediaRef is null', async () => {
    const playWhen = ref(true)

    const Comp = defineComponent({
      setup() {
        const mediaRef = ref<HTMLMediaElement | null>(null)
        useMediaPlayback(mediaRef, { playWhen, respectReducedMotion: false })
        return {}
      },
      render() {
        return h('div')
      },
    })

    // Should not throw
    expect(() => mount(Comp)).not.toThrow()
  })

  it('handles play() rejection gracefully', async () => {
    const mockMedia = {
      play: vi.fn(() => Promise.reject(new Error('NotAllowedError'))),
      pause: vi.fn(),
      paused: true,
    } as unknown as HTMLMediaElement
    const playWhen = ref(true)

    const Comp = defineComponent({
      setup() {
        const mediaRef = ref<HTMLMediaElement | null>(mockMedia)
        useMediaPlayback(mediaRef, { playWhen, respectReducedMotion: false })
        return {}
      },
      render() {
        return h('div')
      },
    })

    // Should not throw even though play() rejects
    expect(() => mount(Comp)).not.toThrow()
    await nextTick()
    expect(mockMedia.play).toHaveBeenCalled()
  })
})
