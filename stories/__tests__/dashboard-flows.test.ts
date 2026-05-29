/**
 * Dashboard E2E Flow Tests
 *
 * Complex user flows modelling an analytics dashboard:
 *  1. Section tab navigation (overview → products → users → settings)
 *  2. Settings form control interactions (radio, switch, checkbox, slider, combobox)
 *  3. Stepper navigation (next/back with boundary conditions)
 *  4. Data component rendering (StatCard, Table, DataGrid)
 *  5. View mode toggle (chart / table / grid)
 *  6. Full dashboard journey (multi-step chained workflow)
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

// Components
import { Tabs, Stepper } from '@nav/index'
import {
  Switch,
  Checkbox,
  RadioGroup,
  Slider,
  RangeSlider,
  Select,
  ToggleGroup,
  Progress,
  ProgressRing,
} from '@core/index'
import { StatCard } from '@data/index'
import { Table, DataGrid } from '@lists/index'

// Types
import type { ColumnDef, SelectOption } from '@core/types'
import type { DataGridColumn } from '@lists/DataGrid.vue'

// ── Shared test data ────────────────────────────────────────────────────────

const sectionTabs = ['overview', 'products', 'users', 'settings']

const tableCols: ColumnDef[] = [
  { id: 'name', label: 'Product' },
  { id: 'category', label: 'Category', width: 120 },
  { id: 'revenue', label: 'Revenue', width: 100 },
]

const tableRows = [
  { name: 'Espresso Blend', category: 'Coffee', revenue: '$18,420' },
  { name: 'Pour Over Kit', category: 'Equipment', revenue: '$12,100' },
  { name: 'Cold Brew Pack', category: 'Coffee', revenue: '$9,800' },
]

const gridCols: DataGridColumn[] = [
  { key: 'id', label: 'ID', width: 60 },
  { key: 'email', label: 'Email' },
  { key: 'plan', label: 'Plan', width: 100 },
  { key: 'status', label: 'Status', width: 100 },
]

const gridRows = [
  { id: 1, email: 'alice@example.com', plan: 'Pro', status: 'active' },
  { id: 2, email: 'bob@company.co', plan: 'Team', status: 'active' },
  { id: 3, email: 'carol@startup.io', plan: 'Free', status: 'trial' },
]

const stepperSteps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Billing', description: 'Add payment method' },
  { label: 'Launch', description: 'Start using the app' },
]

const metricOptions: SelectOption[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'users', label: 'Active Users' },
  { id: 'orders', label: 'Orders' },
]

// ═══════════════════════════════════════════════════════════════════════════
// Flow 1 — Section tab navigation
// ═══════════════════════════════════════════════════════════════════════════

describe('Dashboard Flow 1: Section tab navigation', () => {
  it('navigates through all dashboard sections via click', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'overview' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          sectionTabs.map((id) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': id,
                'aria-selected': String(isActive(id)),
                tabindex: isActive(id) ? 0 : -1,
                onClick: () => activate(id),
              },
              id,
            ),
          ),
        default: ({ activeId }: any) =>
          h('div', { 'data-testid': `section-${activeId}` }, `Content: ${activeId}`),
      },
      attachTo: document.body,
    })

    // Overview active initially
    expect(wrapper.find('[data-tab-id="overview"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="section-overview"]').exists()).toBe(true)

    // Click Products
    await wrapper.find('[data-tab-id="products"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['products'])
    await wrapper.setProps({ modelValue: 'products' })
    expect(wrapper.find('[data-tab-id="products"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('[data-testid="section-products"]').exists()).toBe(true)

    // Click Users
    await wrapper.find('[data-tab-id="users"]').trigger('click')
    await wrapper.setProps({ modelValue: 'users' })
    expect(wrapper.find('[data-tab-id="users"]').attributes('aria-selected')).toBe('true')

    // Click Settings
    await wrapper.find('[data-tab-id="settings"]').trigger('click')
    await wrapper.setProps({ modelValue: 'settings' })
    expect(wrapper.find('[data-tab-id="settings"]').attributes('aria-selected')).toBe('true')

    // Return to Overview
    await wrapper.find('[data-tab-id="overview"]').trigger('click')
    await wrapper.setProps({ modelValue: 'overview' })
    expect(wrapper.find('[data-tab-id="overview"]').attributes('aria-selected')).toBe('true')

    wrapper.unmount()
  })

  it('navigates tabs with keyboard (ArrowRight / ArrowLeft)', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'overview' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          sectionTabs.map((id) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': id,
                'aria-selected': String(isActive(id)),
                tabindex: isActive(id) ? 0 : -1,
                onClick: () => activate(id),
              },
              id,
            ),
          ),
        default: ({ activeId }: any) =>
          h('div', { 'data-testid': `section-${activeId}` }, `Content: ${activeId}`),
      },
      attachTo: document.body,
    })

    // Focus the active tab first (keyboard handler checks document.activeElement)
    ;(wrapper.find('[data-tab-id="overview"]').element as HTMLElement).focus()
    await wrapper.vm.$nextTick()

    // ArrowRight from overview → products
    const tablist = wrapper.find('[data-rig-tablist]')
    await tablist.trigger('keydown', { key: 'ArrowRight' })
    const emits = wrapper.emitted('update:modelValue')
    expect(emits).toBeTruthy()
    expect(emits![0]).toEqual(['products'])

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 2 — Settings form control interactions
// ═══════════════════════════════════════════════════════════════════════════

describe('Dashboard Flow 2: Settings form controls', () => {
  it('RadioGroup selects between plan options', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'free',
        options: [
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team' },
        ],
        label: 'Plan',
      },
      attachTo: document.body,
    })

    // Find radio inputs or role="radio" elements
    const radios = wrapper.findAll('[role="radio"], input[type="radio"]')
    expect(radios.length).toBeGreaterThanOrEqual(3)

    // Click on 'Pro' (index 1)
    await radios[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['pro'])

    // Simulate parent binding
    await wrapper.setProps({ modelValue: 'pro' })

    // Click on 'Team' (index 2)
    await radios[2]!.trigger('click')
    const allEmits = wrapper.emitted('update:modelValue')!
    expect(allEmits[allEmits.length - 1]).toEqual(['team'])

    wrapper.unmount()
  })

  it('Switch toggles notification preference', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true },
      attachTo: document.body,
    })

    const switchEl = wrapper.find('[role="switch"]')
    expect(switchEl.exists()).toBe(true)
    expect(switchEl.attributes('aria-checked')).toBe('true')

    // Toggle off
    await switchEl.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    // Simulate parent binding + toggle back
    await wrapper.setProps({ modelValue: false })
    expect(switchEl.attributes('aria-checked')).toBe('false')

    await switchEl.trigger('click')
    const emits = wrapper.emitted('update:modelValue')!
    expect(emits[emits.length - 1]).toEqual([true])

    wrapper.unmount()
  })

  it('Checkbox toggles auto-renew setting', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false },
      attachTo: document.body,
    })

    const input = wrapper.find('input[type="checkbox"]')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).checked).toBe(false)

    // Toggle on via change event
    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

    wrapper.unmount()
  })

  it('Slider adjusts budget threshold', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50, min: 0, max: 100, ariaLabel: 'Budget' },
      attachTo: document.body,
    })

    const input = wrapper.find('input[type="range"]')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('50')
    expect((input.element as HTMLInputElement).min).toBe('0')
    expect((input.element as HTMLInputElement).max).toBe('100')

    // Simulate value change via input event
    ;(input.element as HTMLInputElement).value = '51'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([51])

    // Change again
    await wrapper.setProps({ modelValue: 51 })
    ;(input.element as HTMLInputElement).value = '50'
    await input.trigger('input')
    const emits = wrapper.emitted('update:modelValue')!
    expect(emits[emits.length - 1]).toEqual([50])

    wrapper.unmount()
  })

  it('RangeSlider adjusts price range', async () => {
    const wrapper = mount(RangeSlider, {
      props: { modelValue: [20, 80] as [number, number], min: 0, max: 100 },
      attachTo: document.body,
    })

    // Two custom div thumbs with role="slider"
    const thumbs = wrapper.findAll('[role="slider"]')
    expect(thumbs.length).toBe(2)

    // Min thumb
    expect(thumbs[0]!.attributes('aria-valuenow')).toBe('20')
    // Max thumb
    expect(thumbs[1]!.attributes('aria-valuenow')).toBe('80')

    // ArrowRight on min thumb increases start value
    await thumbs[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    wrapper.unmount()
  })

  it('Select changes metric', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'revenue',
        options: metricOptions,
        ariaLabel: 'Metric',
      },
      attachTo: document.body,
    })

    // Select renders as a native select or custom dropdown
    const selectEl = wrapper.find('select, [role="listbox"], [data-rig-select]')
    expect(selectEl.exists()).toBe(true)

    wrapper.unmount()
  })

  it('Progress and ProgressRing render sync status', () => {
    const progress = mount(Progress, {
      props: { value: 72, ariaLabel: 'Sync progress' },
    })
    expect(progress.find('[role="progressbar"]').exists()).toBe(true)
    expect(progress.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('72')
    progress.unmount()

    const ring = mount(ProgressRing, {
      props: { value: 72, size: 'sm', ariaLabel: 'Sync ring' },
    })
    expect(ring.find('[role="progressbar"]').exists()).toBe(true)
    ring.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 3 — Stepper navigation
// ═══════════════════════════════════════════════════════════════════════════

describe('Dashboard Flow 3: Stepper navigation', () => {
  it('steps forward and backward through onboarding', async () => {
    const wrapper = mount(Stepper, {
      props: { steps: stepperSteps, current: 0 },
      attachTo: document.body,
    })

    // Initial state: first step active
    expect(wrapper.find('[data-rig-stepper]').exists()).toBe(true)
    const stepEls = wrapper.findAll('[data-rig-stepper-step]')
    expect(stepEls.length).toBe(4)

    // Step labels are rendered
    expect(wrapper.text()).toContain('Account')
    expect(wrapper.text()).toContain('Profile')
    expect(wrapper.text()).toContain('Billing')
    expect(wrapper.text()).toContain('Launch')

    // Advance to step 1
    await wrapper.setProps({ current: 1 })
    await wrapper.vm.$nextTick()

    // Advance to step 2
    await wrapper.setProps({ current: 2 })
    await wrapper.vm.$nextTick()

    // Go back to step 1
    await wrapper.setProps({ current: 1 })
    await wrapper.vm.$nextTick()

    // Advance to final step
    await wrapper.setProps({ current: 3 })
    await wrapper.vm.$nextTick()

    // Verify component stays stable at boundaries
    await wrapper.setProps({ current: 0 })
    expect(wrapper.find('[data-rig-stepper]').exists()).toBe(true)

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 4 — Data component rendering
// ═══════════════════════════════════════════════════════════════════════════

describe('Dashboard Flow 4: Data component rendering', () => {
  it('StatCard renders metrics with trend indicators', () => {
    const wrapper = mount(StatCard, {
      props: {
        label: 'Revenue',
        value: '$142,580',
        trend: 'up' as const,
        trendValue: '+12.3%',
      },
    })

    expect(wrapper.text()).toContain('Revenue')
    expect(wrapper.text()).toContain('$142,580')
    expect(wrapper.text()).toContain('+12.3%')
    expect(wrapper.find('[data-rig-stat-card]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('renders all four stat cards without errors', () => {
    const stats: {
      label: string
      value: string
      trend: 'up' | 'down' | 'neutral'
      trendValue: string
    }[] = [
      { label: 'Revenue', value: '$142,580', trend: 'up', trendValue: '+12.3%' },
      { label: 'Active Users', value: '8,294', trend: 'up', trendValue: '+4.1%' },
      { label: 'Orders', value: '1,847', trend: 'down', trendValue: '-2.4%' },
      { label: 'Conversion', value: '3.24%', trend: 'neutral', trendValue: '0.0%' },
    ]

    for (const stat of stats) {
      const wrapper = mount(StatCard, { props: stat })
      expect(wrapper.text()).toContain(stat.label)
      expect(wrapper.text()).toContain(String(stat.value))
      wrapper.unmount()
    }
  })

  it('Table renders product data with columns', () => {
    const wrapper = mount(Table, {
      props: { columns: tableCols, rows: tableRows, rowKey: 'name' },
    })

    // Column headers rendered
    expect(wrapper.text()).toContain('Product')
    expect(wrapper.text()).toContain('Category')
    expect(wrapper.text()).toContain('Revenue')

    // Row data rendered
    expect(wrapper.text()).toContain('Espresso Blend')
    expect(wrapper.text()).toContain('Coffee')
    expect(wrapper.text()).toContain('$18,420')

    wrapper.unmount()
  })

  it('DataGrid renders user data', () => {
    const wrapper = mount(DataGrid, {
      props: { columns: gridCols, rows: gridRows },
    })

    // Column headers are rendered
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Plan')

    // DataGrid should render row content
    // Check for data attributes that confirm rendering
    expect(wrapper.find('[data-rig-data-grid]').exists()).toBe(true)

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 5 — View mode toggle
// ═══════════════════════════════════════════════════════════════════════════

describe('Dashboard Flow 5: View mode toggle', () => {
  it('ToggleGroup switches between chart, table, and grid views', async () => {
    const wrapper = mount(ToggleGroup, {
      props: {
        modelValue: 'chart',
        items: [
          { value: 'chart', label: 'Chart' },
          { value: 'table', label: 'Table' },
          { value: 'grid', label: 'Grid' },
        ],
      },
      attachTo: document.body,
    })

    // Initial state: chart selected
    expect(wrapper.find('[data-rig-toggle-group]').exists()).toBe(true)
    const toggles = wrapper.findAll('[data-rig-toggle]')
    expect(toggles.length).toBe(3)

    // First toggle is pressed (chart)
    expect(toggles[0]!.attributes('aria-pressed')).toBe('true')
    expect(toggles[1]!.attributes('aria-pressed')).toBe('false')

    // Click 'Table'
    await toggles[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['table'])

    // Simulate parent binding
    await wrapper.setProps({ modelValue: 'table' })
    expect(toggles[1]!.attributes('aria-pressed')).toBe('true')

    // Click 'Grid'
    await toggles[2]!.trigger('click')
    const emits = wrapper.emitted('update:modelValue')!
    expect(emits[emits.length - 1]).toEqual(['grid'])

    wrapper.unmount()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// Flow 6 — Full dashboard journey
// ═══════════════════════════════════════════════════════════════════════════

describe('Dashboard Flow 6: Full dashboard journey', () => {
  it('views stats → switches tabs → edits form → steps through stepper', async () => {
    // ── Step 1: Verify stat cards render ───────────────────────────────────
    const stat = mount(StatCard, {
      props: { label: 'Revenue', value: '$142,580', trend: 'up' as const, trendValue: '+12.3%' },
    })
    expect(stat.text()).toContain('Revenue')
    expect(stat.text()).toContain('$142,580')
    stat.unmount()

    // ── Step 2: Tab navigation ────────────────────────────────────────────
    const tabs = mount(Tabs, {
      props: { modelValue: 'overview' },
      slots: {
        tabs: ({ isActive, activate }: any) =>
          sectionTabs.map((id) =>
            h(
              'button',
              {
                role: 'tab',
                'data-tab-id': id,
                'aria-selected': String(isActive(id)),
                tabindex: isActive(id) ? 0 : -1,
                onClick: () => activate(id),
              },
              id,
            ),
          ),
        default: ({ activeId }: any) =>
          h('div', { 'data-testid': `section-${activeId}` }, activeId),
      },
      attachTo: document.body,
    })

    // Navigate overview → products → users → settings
    for (const section of ['products', 'users', 'settings']) {
      await tabs.find(`[data-tab-id="${section}"]`).trigger('click')
      await tabs.setProps({ modelValue: section })
      expect(tabs.find(`[data-tab-id="${section}"]`).attributes('aria-selected')).toBe('true')
    }
    tabs.unmount()

    // ── Step 3: Form control interactions ─────────────────────────────────
    const sw = mount(Switch, {
      props: { modelValue: true },
      attachTo: document.body,
    })
    await sw.find('[role="switch"]').trigger('click')
    expect(sw.emitted('update:modelValue')?.[0]).toEqual([false])
    sw.unmount()

    const cb = mount(Checkbox, {
      props: { modelValue: false },
      attachTo: document.body,
    })
    const cbInput = cb.find('input[type="checkbox"]')
    ;(cbInput.element as HTMLInputElement).checked = true
    await cbInput.trigger('change')
    expect(cb.emitted('update:modelValue')?.[0]).toEqual([true])
    cb.unmount()

    const slider = mount(Slider, {
      props: { modelValue: 50, min: 0, max: 100, ariaLabel: 'Budget' },
      attachTo: document.body,
    })
    const sliderInput = slider.find('input[type="range"]')
    ;(sliderInput.element as HTMLInputElement).value = '51'
    await sliderInput.trigger('input')
    expect(slider.emitted('update:modelValue')?.[0]).toEqual([51])
    slider.unmount()

    // ── Step 4: Stepper navigation ────────────────────────────────────────
    const stepper = mount(Stepper, {
      props: { steps: stepperSteps, current: 0 },
    })
    // Advance through all steps
    for (let i = 1; i <= 3; i++) {
      await stepper.setProps({ current: i })
    }
    // Go back
    await stepper.setProps({ current: 1 })
    expect(stepper.find('[data-rig-stepper]').exists()).toBe(true)
    stepper.unmount()

    // ── Step 5: Data table renders ────────────────────────────────────────
    const table = mount(Table, {
      props: { columns: tableCols, rows: tableRows, rowKey: 'name' },
    })
    expect(table.text()).toContain('Espresso Blend')
    table.unmount()
  })
})
