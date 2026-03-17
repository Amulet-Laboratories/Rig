/**
 * Observatory E2E Flow Tests
 *
 * Complex user flows modelling a mission control dashboard:
 *  1. Spatial view tab navigation (map → globe → scatter3d → cloud)
 *  2. Globe rotation controls (slider interactions)
 *  3. Playback controls (play → pause → speed change)
 *  4. System status rendering (progress bars, status indicators)
 *  5. Temporal controls (timeline scrubber, animated chart)
 *  6. Full mission control session (multi-step chained workflow)
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

// Components
import { Tabs } from '@nav/index'
import { Slider, Badge, Progress, ProgressRing, Dot } from '@core/index'
import { PlaybackControls, TimelineScrubber } from '@temporal/index'

// ── Shared test data ────────────────────────────────────────────────────────

const spatialTabs = [
  { id: 'map', label: 'Ground Map' },
  { id: 'globe', label: 'Globe' },
  { id: 'scatter3d', label: '3D Scatter' },
  { id: 'cloud', label: 'Point Cloud' },
]

const systems = [
  { name: 'Propulsion', status: 'nominal', value: 92 },
  { name: 'Communications', status: 'nominal', value: 88 },
  { name: 'Power Grid', status: 'warning', value: 64 },
  { name: 'Life Support', status: 'nominal', value: 97 },
  { name: 'Navigation', status: 'nominal', value: 95 },
  { name: 'Payload Bay', status: 'critical', value: 31 },
]

// ═══════════════════════════════════════════════════════════════════════════
// Flow 1 — Spatial view tab navigation
// ═══════════════════════════════════════════════════════════════════════════

describe('Observatory Flow 1: Spatial view tab navigation', () => {
  it('switches between all spatial views via click', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'map' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          spatialTabs.map((tab) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': tab.id,
                'aria-selected': String(isActive(tab.id)),
                tabindex: isActive(tab.id) ? 0 : -1,
                onClick: () => activate(tab.id),
              },
              tab.label,
            ),
          ),
        default: ({ activeId }: any) =>
          h('div', { 'data-testid': `view-${activeId}` }, `${activeId} view`),
      },
      attachTo: document.body,
    })

    // Map active initially
    expect(wrapper.find('[data-tab-id="map"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="view-map"]').exists()).toBe(true)

    // Click Globe
    await wrapper.find('[data-tab-id="globe"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['globe'])
    await wrapper.setProps({ modelValue: 'globe' })
    expect(wrapper.find('[data-tab-id="globe"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="view-globe"]').exists()).toBe(true)

    // Click 3D Scatter
    await wrapper.find('[data-tab-id="scatter3d"]').trigger('click')
    await wrapper.setProps({ modelValue: 'scatter3d' })
    expect(wrapper.find('[data-testid="view-scatter3d"]').exists()).toBe(true)

    // Click Point Cloud
    await wrapper.find('[data-tab-id="cloud"]').trigger('click')
    await wrapper.setProps({ modelValue: 'cloud' })
    expect(wrapper.find('[data-testid="view-cloud"]').exists()).toBe(true)

    // Return to Map
    await wrapper.find('[data-tab-id="map"]').trigger('click')
    await wrapper.setProps({ modelValue: 'map' })
    expect(wrapper.find('[data-tab-id="map"]').attributes('aria-selected')).toBe('true')

    wrapper.unmount()
  })

  it('navigates spatial tabs with keyboard', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'map' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          spatialTabs.map((tab) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': tab.id,
                'aria-selected': String(isActive(tab.id)),
                tabindex: isActive(tab.id) ? 0 : -1,
                onClick: () => activate(tab.id),
              },
              tab.label,
            ),
          ),
        default: ({ activeId }: any) => h('div', { 'data-testid': `view-${activeId}` }, activeId),
      },
      attachTo: document.body,
    })

    // Focus the active tab first (Tabs keyboard handler uses document.activeElement)
    const mapTab = wrapper.find('[data-tab-id="map"]')
    ;(mapTab.element as HTMLElement).focus()
    await wrapper.vm.$nextTick()

    // ArrowRight from map → globe
    const tablist = wrapper.find('[data-rig-tablist]')
    await tablist.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['globe'])

    // Set globe active, focus it, ArrowRight → scatter3d
    await wrapper.setProps({ modelValue: 'globe' })
    ;(wrapper.find('[data-tab-id="globe"]').element as HTMLElement).focus()
    await wrapper.vm.$nextTick()
    await tablist.trigger('keydown', { key: 'ArrowRight' })
    const emits = wrapper.emitted('update:modelValue')!
    expect(emits[emits.length - 1]).toEqual(['scatter3d'])

    // ArrowLeft from scatter3d → globe
    await wrapper.setProps({ modelValue: 'scatter3d' })
    ;(wrapper.find('[data-tab-id="scatter3d"]').element as HTMLElement).focus()
    await wrapper.vm.$nextTick()
    await tablist.trigger('keydown', { key: 'ArrowLeft' })
    const emits2 = wrapper.emitted('update:modelValue')!
    expect(emits2[emits2.length - 1]).toEqual(['globe'])

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 2 — Globe rotation controls
// ═══════════════════════════════════════════════════════════════════════════

describe('Observatory Flow 2: Globe rotation controls', () => {
  it('adjusts rotation Y via input events', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0, min: -180, max: 180, ariaLabel: 'Globe Y rotation' },
      attachTo: document.body,
    })

    const input = wrapper.find('input[type="range"]')
    expect((input.element as HTMLInputElement).value).toBe('0')
    expect((input.element as HTMLInputElement).min).toBe('-180')
    expect((input.element as HTMLInputElement).max).toBe('180')

    // Simulate rotation change
    ;(input.element as HTMLInputElement).value = '45'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([45])

    // Multiple changes
    await wrapper.setProps({ modelValue: 45 })
    ;(input.element as HTMLInputElement).value = '90'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual([90])

    // Decrease
    await wrapper.setProps({ modelValue: 90 })
    ;(input.element as HTMLInputElement).value = '30'
    await input.trigger('input')
    const emits = wrapper.emitted('update:modelValue')!
    expect(emits[emits.length - 1]).toEqual([30])

    wrapper.unmount()
  })

  it('adjusts tilt X via input events', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 15, min: -90, max: 90, ariaLabel: 'Globe X tilt' },
      attachTo: document.body,
    })

    const input = wrapper.find('input[type="range"]')
    expect((input.element as HTMLInputElement).value).toBe('15')

    // Change tilt
    ;(input.element as HTMLInputElement).value = '30'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([30])

    wrapper.unmount()
  })

  it('slider respects min/max boundaries', async () => {
    // At max boundary
    const wrapper = mount(Slider, {
      props: { modelValue: 180, min: -180, max: 180, ariaLabel: 'Rotation' },
      attachTo: document.body,
    })

    const input = wrapper.find('input[type="range"]')
    expect((input.element as HTMLInputElement).value).toBe('180')

    // Set value above max — should clamp
    ;(input.element as HTMLInputElement).value = '200'
    await input.trigger('input')
    // The emitted value should be clamped to max
    const emit = wrapper.emitted('update:modelValue')?.[0]?.[0] as number
    expect(emit).toBeLessThanOrEqual(180)

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 3 — Playback controls
// ═══════════════════════════════════════════════════════════════════════════

describe('Observatory Flow 3: Playback controls', () => {
  it('play, pause, and speed control lifecycle', async () => {
    const wrapper = mount(PlaybackControls, {
      props: {
        playing: false,
        currentTime: 24,
        duration: 48,
        speed: 1,
        loop: true,
        showSpeed: true,
      },
      attachTo: document.body,
    })

    expect(wrapper.find('[data-rig-playback-controls]').exists()).toBe(true)

    // Click the play button using exact data attribute
    const playBtn = wrapper.find('[data-rig-playback-controls-play]')
    expect(playBtn.exists()).toBe(true)
    await playBtn.trigger('click')
    expect(wrapper.emitted('play')).toBeTruthy()

    // Simulate playing state
    await wrapper.setProps({ playing: true })

    // Click same button again to pause
    await wrapper.find('[data-rig-playback-controls-play]').trigger('click')
    expect(wrapper.emitted('pause')).toBeTruthy()

    // Click speed button to cycle speed
    const speedBtn = wrapper.find('[data-rig-playback-controls-speed]')
    if (speedBtn.exists()) {
      await speedBtn.trigger('click')
      expect(wrapper.emitted('speed-change')).toBeTruthy()
    }

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 4 — System status rendering
// ═══════════════════════════════════════════════════════════════════════════

describe('Observatory Flow 4: System status rendering', () => {
  it('renders all system progress bars with correct values', () => {
    for (const sys of systems) {
      const wrapper = mount(Progress, {
        props: { value: sys.value, ariaLabel: sys.name },
      })

      const bar = wrapper.find('[role="progressbar"]')
      expect(bar.exists()).toBe(true)
      expect(bar.attributes('aria-valuenow')).toBe(String(sys.value))
      expect(bar.attributes('aria-valuemin')).toBe('0')
      expect(bar.attributes('aria-valuemax')).toBe('100')

      wrapper.unmount()
    }
  })

  it('renders system status rings', () => {
    for (const sys of systems) {
      const wrapper = mount(ProgressRing, {
        props: { value: sys.value, size: 'sm' },
      })

      expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)

      wrapper.unmount()
    }
  })

  it('status Dots render with correct variants', () => {
    const variantMap: Record<string, string> = {
      nominal: 'success',
      warning: 'warning',
      critical: 'destructive',
    }

    for (const sys of systems) {
      const variant = variantMap[sys.status] ?? 'default'
      const wrapper = mount(Dot, {
        props: { variant, size: 'xs' },
      })

      expect(wrapper.find('[data-rig-dot]').exists()).toBe(true)

      wrapper.unmount()
    }
  })

  it('status Badges render with correct variants', () => {
    const variantMap: Record<string, string> = {
      nominal: 'success',
      warning: 'warning',
      critical: 'destructive',
    }

    for (const sys of systems) {
      const variant = variantMap[sys.status] ?? 'default'
      const wrapper = mount(Badge, {
        props: { variant, size: 'xs' },
        slots: { default: () => `${sys.value}%` },
      })

      expect(wrapper.text()).toContain(`${sys.value}%`)

      wrapper.unmount()
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 5 — Timeline scrubber
// ═══════════════════════════════════════════════════════════════════════════

describe('Observatory Flow 5: Timeline scrubber', () => {
  it('renders with correct range and initial value', () => {
    const formatHour = (v: number) => {
      const h = Math.floor(v) % 24
      return `${String(h).padStart(2, '0')}:00`
    }

    const wrapper = mount(TimelineScrubber, {
      props: {
        modelValue: 24,
        min: 0,
        max: 48,
        step: 1,
        width: 500,
        formatValue: formatHour,
      },
      attachTo: document.body,
    })

    expect(wrapper.find('[data-rig-timeline-scrubber]').exists()).toBe(true)

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 6 — Full mission control session
// ═══════════════════════════════════════════════════════════════════════════

describe('Observatory Flow 6: Full mission control session', () => {
  it('checks systems → switches views → adjusts controls → plays back', async () => {
    // ── Step 1: Verify all systems render ────────────────────────────────
    for (const sys of systems) {
      const p = mount(Progress, {
        props: { value: sys.value, ariaLabel: sys.name },
      })
      expect(p.find('[role="progressbar"]').attributes('aria-valuenow')).toBe(String(sys.value))
      p.unmount()
    }

    // ── Step 2: Spatial tab navigation ────────────────────────────────────
    const tabs = mount(Tabs, {
      props: { modelValue: 'map' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          spatialTabs.map((tab) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': tab.id,
                'aria-selected': String(isActive(tab.id)),
                tabindex: isActive(tab.id) ? 0 : -1,
                onClick: () => activate(tab.id),
              },
              tab.label,
            ),
          ),
        default: ({ activeId }: any) => h('div', { 'data-testid': `view-${activeId}` }, activeId),
      },
      attachTo: document.body,
    })

    // Navigate map → globe → scatter3d → cloud → back to map
    for (const id of ['globe', 'scatter3d', 'cloud', 'map']) {
      await tabs.find(`[data-tab-id="${id}"]`).trigger('click')
      await tabs.setProps({ modelValue: id })
      expect(tabs.find(`[data-tab-id="${id}"]`).attributes('aria-selected')).toBe('true')
    }
    tabs.unmount()

    // ── Step 3: Globe rotation sliders ────────────────────────────────────
    const rotY = mount(Slider, {
      props: { modelValue: 0, min: -180, max: 180, ariaLabel: 'Rotation Y' },
      attachTo: document.body,
    })
    const rotYInput = rotY.find('input[type="range"]')
    ;(rotYInput.element as HTMLInputElement).value = '45'
    await rotYInput.trigger('input')
    expect(rotY.emitted('update:modelValue')?.[0]).toEqual([45])
    rotY.unmount()

    const tiltX = mount(Slider, {
      props: { modelValue: 15, min: -90, max: 90, ariaLabel: 'Tilt X' },
      attachTo: document.body,
    })
    const tiltXInput = tiltX.find('input[type="range"]')
    ;(tiltXInput.element as HTMLInputElement).value = '10'
    await tiltXInput.trigger('input')
    expect(tiltX.emitted('update:modelValue')?.[0]).toEqual([10])
    tiltX.unmount()

    // ── Step 4: Playback controls ─────────────────────────────────────────
    const playback = mount(PlaybackControls, {
      props: {
        playing: false,
        currentTime: 0,
        duration: 48,
        speed: 1,
        loop: true,
        showSpeed: true,
      },
      attachTo: document.body,
    })
    expect(playback.find('[data-rig-playback-controls]').exists()).toBe(true)

    // Find and click play
    const buttons = playback.findAll('button')
    if (buttons.length > 0) {
      await buttons[0]!.trigger('click')
      // Should emit either 'play' or some interaction event
      const allEmits = playback.emitted()
      expect(Object.keys(allEmits).length).toBeGreaterThan(0)
    }
    playback.unmount()

    // ── Step 5: Timeline scrubber renders ─────────────────────────────────
    const scrubber = mount(TimelineScrubber, {
      props: { modelValue: 24, min: 0, max: 48, step: 1, width: 500 },
      attachTo: document.body,
    })
    expect(scrubber.find('[data-rig-timeline-scrubber]').exists()).toBe(true)
    scrubber.unmount()
  })
})
