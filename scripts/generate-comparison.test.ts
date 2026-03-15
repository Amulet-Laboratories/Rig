/**
 * generate-comparison.test.ts
 *
 * Comparison benchmark runner — mounts Rig components in jsdom,
 * runs axe-core accessibility audits, measures mount/unmount timing,
 * and appends results to .health/comparison.json.
 *
 * Usage:
 *   pnpm comparison         # run benchmarks for all unmapped components
 *   vitest run scripts/generate-comparison.test.ts
 *
 * This file is excluded from the normal test suite.
 * It only runs explicitly via the script above.
 */

import { describe, it, expect, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

// ── axe-core import ──────────────────────────────────────────────────────────
// axe-core works with jsdom — we import and configure it for the test env
import axe from 'axe-core'

// ── Component imports ────────────────────────────────────────────────────────
import ScatterPlot3D from '../packages/spatial/src/ScatterPlot3D.vue'
import IconButton from '../packages/core/src/primitives/IconButton.vue'
import TemporalHeatmap from '../packages/temporal/src/TemporalHeatmap.vue'
import Panel from '../packages/layout/src/Panel.vue'
import TagInput from '../packages/core/src/primitives/TagInput.vue'
import DateRangePicker from '../packages/nav/src/DateRangePicker.vue'
import Heatmap from '../packages/data/src/Heatmap.vue'
import KanbanBoard from '../packages/extras/src/KanbanBoard.vue'
import SankeyDiagram from '../packages/data/src/SankeyDiagram.vue'
import BarChart from '../packages/data/src/BarChart.vue'
import DatePicker from '../packages/nav/src/DatePicker.vue'
import KeyboardHint from '../packages/menus/src/KeyboardHint.vue'
import PlaybackControls from '../packages/temporal/src/PlaybackControls.vue'
import ShellGrid from '../packages/layout/src/ShellGrid.vue'
import AnimatedChart from '../packages/temporal/src/AnimatedChart.vue'
import FileTree from '../packages/lists/src/FileTree.vue'
import ParticleField from '../packages/temporal/src/ParticleField.vue'
import ActivityBar from '../packages/nav/src/ActivityBar.vue'
import CodeBlock from '../packages/editor/src/CodeBlock.vue'
import DataGrid from '../packages/lists/src/DataGrid.vue'
import Shimmer from '../packages/extras/src/Shimmer.vue'
import EmptyState from '../packages/extras/src/EmptyState.vue'
import GraphNetwork from '../packages/spatial/src/GraphNetwork.vue'

// ── Batch 2: 39 previously-uncovered components ─────────────────────────────
import ActionBar from '../packages/menus/src/ActionBar.vue'
import AreaChart from '../packages/data/src/AreaChart.vue'
import AvatarGroup from '../packages/core/src/primitives/AvatarGroup.vue'
import BubbleChart from '../packages/data/src/BubbleChart.vue'
import CalendarGrid from '../packages/extras/src/CalendarGrid.vue'
import ColorPicker from '../packages/editor/src/ColorPicker.vue'
import CommandPalette from '../packages/menus/src/CommandPalette.vue'
import DiffViewer from '../packages/editor/src/DiffViewer.vue'
import Dot from '../packages/core/src/primitives/Dot.vue'
import EditorTab from '../packages/editor/src/EditorTab.vue'
import EditorWorkbench from '../packages/editor/src/EditorWorkbench.vue'
import GlobeView from '../packages/spatial/src/GlobeView.vue'
import Icon from '../packages/core/src/primitives/Icon.vue'
import IdeShell from '../packages/shell/src/IdeShell.vue'
import InlineEditor from '../packages/core/src/primitives/InlineEditor.vue'
import Kbd from '../packages/core/src/primitives/Kbd.vue'
import LineChart from '../packages/data/src/LineChart.vue'
import MapCanvas from '../packages/spatial/src/MapCanvas.vue'
import MiniBar from '../packages/data/src/MiniBar.vue'
import NotificationCenter from '../packages/extras/src/NotificationCenter.vue'
import PanelBar from '../packages/nav/src/PanelBar.vue'
import PeekView from '../packages/layout/src/PeekView.vue'
import PointCloud from '../packages/spatial/src/PointCloud.vue'
import ProgressRing from '../packages/core/src/primitives/ProgressRing.vue'
import PropertyGrid from '../packages/extras/src/PropertyGrid.vue'
import PulseIndicator from '../packages/core/src/primitives/PulseIndicator.vue'
import RadarChart from '../packages/data/src/RadarChart.vue'
import RangeSlider from '../packages/core/src/primitives/RangeSlider.vue'
import ResizablePanel from '../packages/layout/src/ResizablePanel.vue'
import Resizer from '../packages/core/src/primitives/Resizer.vue'
import ScatterPlot from '../packages/data/src/ScatterPlot.vue'
import SideBar from '../packages/nav/src/SideBar.vue'
import Sparkline from '../packages/data/src/Sparkline.vue'
import SplitView from '../packages/layout/src/SplitView.vue'
import StatCard from '../packages/data/src/StatCard.vue'
import StatusBar from '../packages/nav/src/StatusBar.vue'
import TimelineScrubber from '../packages/temporal/src/TimelineScrubber.vue'
import Treemap from '../packages/data/src/Treemap.vue'
import View from '../packages/nav/src/View.vue'

// ── Batch 3: Combobox, ContextMenu, Input ────────────────────────────────────
import Combobox from '../packages/core/src/primitives/Combobox.vue'
import ContextMenu from '../packages/menus/src/ContextMenu.vue'
import Input from '../packages/core/src/primitives/Input.vue'
import type { Action } from '../packages/core/src/types/actions'

// ── Batch 4: Previously-erroring components ──────────────────────────────────
import Avatar from '../packages/core/src/primitives/Avatar.vue'
import List from '../packages/lists/src/List.vue'
import Modal from '../packages/layout/src/Modal.vue'
import Toast from '../packages/extras/src/Toast.vue'
import Tooltip from '../packages/extras/src/Tooltip.vue'
import TreeView from '../packages/lists/src/TreeView.vue'

// ── Batch 5: Previously-missing from comparison ─────────────────────────────
import Button from '../packages/core/src/primitives/Button.vue'
import Checkbox from '../packages/core/src/primitives/Checkbox.vue'
import Collapsible from '../packages/layout/src/Collapsible.vue'
import Popover from '../packages/layout/src/Popover.vue'
import Radio from '../packages/core/src/primitives/Radio.vue'
import Select from '../packages/core/src/primitives/Select.vue'
import Toggle from '../packages/core/src/primitives/Toggle.vue'
// ── Batch 6: Re-runnable components with violations ────────────────
import Divider from '../packages/core/src/primitives/Divider.vue'
import Progress from '../packages/core/src/primitives/Progress.vue'
import Slider from '../packages/core/src/primitives/Slider.vue'
import Switch from '../packages/core/src/primitives/Switch.vue'
import Textarea from '../packages/core/src/primitives/Textarea.vue'
// ── Types ────────────────────────────────────────────────────────────────────

interface MountResult {
  lib: string
  libName: string
  componentName: string
  mountMedianMs: number
  mountP95Ms: number
  unmountMedianMs: number
  domNodeCount: number
  a11yViolations: number
  a11yPasses: number
  a11yScore: number
  reliable: boolean
  error?: string
  renderWarning?: string
}

interface ComparisonResult {
  rigComponent: string
  rigPackage: string
  results: MountResult[]
}

interface ComparisonOutput {
  timestamp: string
  iterations: number
  comparisons: ComparisonResult[]
  stats?: {
    totalResults: number
    reliableResults: number
    warningResults: number
    errorResults: number
  }
}

// ── Configuration ────────────────────────────────────────────────────────────

const ITERATIONS = 30
const ROOT = resolve(import.meta.dirname!, '..')
const HEALTH_DIR = resolve(ROOT, '.health')
const COMPARISON_PATH = resolve(HEALTH_DIR, 'comparison.json')

// Components to benchmark — only those missing from comparison.json
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: { name: string; pkg: string; component: any; props?: Record<string, unknown> }[] =
  [
    { name: 'ScatterPlot3D', pkg: 'spatial', component: ScatterPlot3D },
    { name: 'IconButton', pkg: 'core', component: IconButton, props: { ariaLabel: 'Test action' } },
    { name: 'TemporalHeatmap', pkg: 'temporal', component: TemporalHeatmap },
    { name: 'Panel', pkg: 'layout', component: Panel, props: { open: true } },
    { name: 'TagInput', pkg: 'core', component: TagInput, props: { modelValue: [] as string[] } },
    { name: 'DateRangePicker', pkg: 'nav', component: DateRangePicker },
    { name: 'Heatmap', pkg: 'data', component: Heatmap },
    { name: 'KanbanBoard', pkg: 'extras', component: KanbanBoard },
    { name: 'SankeyDiagram', pkg: 'data', component: SankeyDiagram },
    { name: 'BarChart', pkg: 'data', component: BarChart },
    { name: 'DatePicker', pkg: 'nav', component: DatePicker },
    {
      name: 'KeyboardHint',
      pkg: 'menus',
      component: KeyboardHint,
      props: { shortcut: 'Ctrl+Shift+P' },
    },
    { name: 'PlaybackControls', pkg: 'temporal', component: PlaybackControls },
    { name: 'ShellGrid', pkg: 'layout', component: ShellGrid },
    { name: 'AnimatedChart', pkg: 'temporal', component: AnimatedChart },
    { name: 'FileTree', pkg: 'lists', component: FileTree },
    { name: 'ParticleField', pkg: 'temporal', component: ParticleField },
    {
      name: 'ActivityBar',
      pkg: 'nav',
      component: ActivityBar,
      props: { items: [{ id: 'test', label: 'Test' }] },
    },
    {
      name: 'CodeBlock',
      pkg: 'editor',
      component: CodeBlock,
      props: { code: 'const x = 1', language: 'typescript' },
    },
    {
      name: 'DataGrid',
      pkg: 'lists',
      component: DataGrid,
      props: { columns: [{ key: 'name', label: 'Name' }], rows: [{ name: 'Test' }] },
    },
    { name: 'Shimmer', pkg: 'extras', component: Shimmer },
    { name: 'EmptyState', pkg: 'extras', component: EmptyState },
    { name: 'GraphNetwork', pkg: 'spatial', component: GraphNetwork },

    // ── Batch 2: 39 previously-uncovered components ─────────────────────────
    { name: 'ActionBar', pkg: 'menus', component: ActionBar, props: { actions: [{ id: 'a1', label: 'Run' }] } },
    { name: 'AreaChart', pkg: 'data', component: AreaChart },
    { name: 'AvatarGroup', pkg: 'core', component: AvatarGroup },
    { name: 'BubbleChart', pkg: 'data', component: BubbleChart },
    { name: 'CalendarGrid', pkg: 'extras', component: CalendarGrid },
    { name: 'ColorPicker', pkg: 'editor', component: ColorPicker },
    { name: 'CommandPalette', pkg: 'menus', component: CommandPalette, props: { items: [{ id: 'cmd1', label: 'Open File' }] } },
    { name: 'DiffViewer', pkg: 'editor', component: DiffViewer },
    { name: 'Dot', pkg: 'core', component: Dot },
    { name: 'EditorTab', pkg: 'editor', component: EditorTab, props: { tab: { id: 'tab1', label: 'index.ts' } } },
    { name: 'EditorWorkbench', pkg: 'editor', component: EditorWorkbench, props: { tabs: [{ id: 'tab1', label: 'index.ts' }] } },
    { name: 'GlobeView', pkg: 'spatial', component: GlobeView },
    { name: 'Icon', pkg: 'core', component: Icon },
    { name: 'IdeShell', pkg: 'shell', component: IdeShell },
    { name: 'InlineEditor', pkg: 'core', component: InlineEditor, props: { modelValue: 'Test value' } },
    { name: 'Kbd', pkg: 'core', component: Kbd },
    { name: 'LineChart', pkg: 'data', component: LineChart },
    { name: 'MapCanvas', pkg: 'spatial', component: MapCanvas },
    { name: 'MiniBar', pkg: 'data', component: MiniBar },
    { name: 'NotificationCenter', pkg: 'extras', component: NotificationCenter },
    { name: 'PanelBar', pkg: 'nav', component: PanelBar, props: { tabs: [{ id: 'tab1', label: 'Terminal' }] } },
    { name: 'PeekView', pkg: 'layout', component: PeekView },
    { name: 'PointCloud', pkg: 'spatial', component: PointCloud },
    { name: 'ProgressRing', pkg: 'core', component: ProgressRing, props: { ariaLabel: 'Loading' } },
    { name: 'PropertyGrid', pkg: 'extras', component: PropertyGrid, props: { items: [{ key: 'Name', value: 'Test' }] } },
    { name: 'PulseIndicator', pkg: 'core', component: PulseIndicator },
    { name: 'RadarChart', pkg: 'data', component: RadarChart },
    { name: 'RangeSlider', pkg: 'core', component: RangeSlider },
    { name: 'ResizablePanel', pkg: 'layout', component: ResizablePanel },
    { name: 'Resizer', pkg: 'core', component: Resizer },
    { name: 'ScatterPlot', pkg: 'data', component: ScatterPlot },
    { name: 'SideBar', pkg: 'nav', component: SideBar },
    { name: 'Sparkline', pkg: 'data', component: Sparkline },
    { name: 'SplitView', pkg: 'layout', component: SplitView },
    { name: 'StatCard', pkg: 'data', component: StatCard },
    { name: 'StatusBar', pkg: 'nav', component: StatusBar },
    { name: 'TimelineScrubber', pkg: 'temporal', component: TimelineScrubber },
    { name: 'Treemap', pkg: 'data', component: Treemap },
    { name: 'View', pkg: 'nav', component: View, props: { title: 'Explorer' } },

    // ── Batch 3: components previously erroring in axe-core ──────────────────
    { name: 'Combobox', pkg: 'core', component: Combobox, props: { options: [{ id: 'opt1', label: 'Option 1' }, { id: 'opt2', label: 'Option 2' }] } },
    { name: 'ContextMenu', pkg: 'menus', component: ContextMenu, props: { open: true, x: 100, y: 100, items: [{ id: 'cut', label: 'Cut' }, { id: 'copy', label: 'Copy' }] as Action[] } },
    { name: 'Input', pkg: 'core', component: Input, props: { ariaLabel: 'Test input' } },

    // ── Batch 4: Previously-erroring components ──────────────────────────────
    { name: 'Avatar', pkg: 'core', component: Avatar, props: { name: 'Test User' } },
    { name: 'List', pkg: 'lists', component: List, props: { items: [{ id: 'item1', label: 'Item 1' }, { id: 'item2', label: 'Item 2' }], ariaLabel: 'Test list' } },
    { name: 'Modal', pkg: 'layout', component: Modal, props: { open: true, ariaLabel: 'Test modal' } },
    { name: 'Toast', pkg: 'extras', component: Toast },
    { name: 'Tooltip', pkg: 'extras', component: Tooltip },
    { name: 'TreeView', pkg: 'lists', component: TreeView, props: { nodes: [{ id: 'node1', label: 'Root', children: [{ id: 'child1', label: 'Child' }] }] } },

    // ── Batch 5: Previously-missing from comparison ─────────────────────────
    { name: 'Button', pkg: 'core', component: Button, props: { ariaLabel: 'Test button' } },
    { name: 'Checkbox', pkg: 'core', component: Checkbox, props: { ariaLabel: 'Test checkbox' } },
    { name: 'Collapsible', pkg: 'layout', component: Collapsible, props: { open: true } },
    { name: 'Popover', pkg: 'layout', component: Popover },
    { name: 'Radio', pkg: 'core', component: Radio, props: { value: 'option-1', name: 'radio-group', ariaLabel: 'Option 1' } },
    { name: 'Select', pkg: 'core', component: Select, props: { ariaLabel: 'Test select', options: [{ id: 'opt1', label: 'Option 1' }] } },
    { name: 'Toggle', pkg: 'core', component: Toggle, props: { ariaLabel: 'Test toggle' } },

    // ── Batch 6: Re-runnable components with violations ────────────────
    { name: 'Divider', pkg: 'core', component: Divider },
    { name: 'Progress', pkg: 'core', component: Progress, props: { ariaLabel: 'Loading progress' } },
    { name: 'Slider', pkg: 'core', component: Slider, props: { ariaLabel: 'Value slider' } },
    { name: 'Switch', pkg: 'core', component: Switch, props: { ariaLabel: 'Toggle setting' } },
    { name: 'Textarea', pkg: 'core', component: Textarea, props: { ariaLabel: 'Text input' } },
  ]

// ── Helpers ──────────────────────────────────────────────────────────────────

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function p95(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b)
  const idx = Math.ceil(sorted.length * 0.95) - 1
  return sorted[Math.min(idx, sorted.length - 1)]
}

function round(n: number, decimals = 4): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

// ── Benchmark runner ─────────────────────────────────────────────────────────

async function benchmarkComponent(entry: (typeof COMPONENTS)[0]): Promise<MountResult> {
  const mountTimes: number[] = []
  const unmountTimes: number[] = []
  let domNodeCount = 0
  let reliable = true
  let renderWarning: string | undefined

  try {
    // Warm-up run
    const warmup = mount(entry.component, { props: entry.props, attachTo: document.body })
    warmup.unmount()

    // Timed iterations
    for (let i = 0; i < ITERATIONS; i++) {
      const t0 = performance.now()
      const w = mount(entry.component, { props: entry.props, attachTo: document.body })
      const t1 = performance.now()

      if (i === 0) {
        domNodeCount =
          typeof w.element.querySelectorAll === 'function'
            ? w.element.querySelectorAll('*').length + 1
            : 1
      }

      w.unmount()
      const t2 = performance.now()

      mountTimes.push(t1 - t0)
      unmountTimes.push(t2 - t1)
    }

    // Check if the component actually rendered content
    const check = mount(entry.component, { props: entry.props, attachTo: document.body })
    if (check.element.innerHTML === '' || check.element.childElementCount === 0) {
      if (domNodeCount <= 1) {
        renderWarning = 'Component rendered with no visible content'
        reliable = false
      }
    }

    // Run axe-core accessibility audit
    let a11yViolations = 0
    let a11yPasses = 0

    try {
      // axe-core runs against a DOM node in jsdom
      const container = check.element as Element
      // Ensure the container is attached to the document
      if (!document.body.contains(container)) {
        document.body.appendChild(container)
      }

      const results = await axe.run(container, {
        rules: {
          // Disable color-contrast — jsdom has no computed styles
          'color-contrast': { enabled: false },
          // Disable page-level rules that don't apply to component testing
          'page-has-heading-one': { enabled: false },
          'landmark-one-main': { enabled: false },
          region: { enabled: false },
          bypass: { enabled: false },
          'document-title': { enabled: false },
          'html-has-lang': { enabled: false },
        },
        resultTypes: ['violations', 'passes'],
      })

      a11yViolations = results.violations.length
      a11yPasses = results.passes.length

      // Log violation details for debugging
      if (results.violations.length > 0) {
        console.log(`    ⚠ axe violations for ${entry.name}:`)
        for (const v of results.violations) {
          console.log(`      - [${v.impact}] ${v.id}: ${v.description}`)
          for (const node of v.nodes) {
            console.log(`        target: ${node.target.join(', ')}`)
            console.log(`        html: ${node.html.slice(0, 120)}`)
          }
        }
      }
    } catch (axeErr) {
      // axe-core may fail in jsdom for some components — that's OK
      renderWarning = `axe-core: ${(axeErr as Error).message?.slice(0, 80)}`
    }

    check.unmount()

    const a11yScore =
      a11yPasses + a11yViolations > 0
        ? Math.round((a11yPasses / (a11yPasses + a11yViolations)) * 100)
        : 100

    return {
      lib: 'rig',
      libName: 'Rig',
      componentName: entry.name,
      mountMedianMs: round(median(mountTimes)),
      mountP95Ms: round(p95(mountTimes)),
      unmountMedianMs: round(median(unmountTimes)),
      domNodeCount,
      a11yViolations,
      a11yPasses,
      a11yScore,
      reliable,
      ...(renderWarning ? { renderWarning } : {}),
    }
  } catch (err) {
    return {
      lib: 'rig',
      libName: 'Rig',
      componentName: entry.name,
      mountMedianMs: 0,
      mountP95Ms: 0,
      unmountMedianMs: 0,
      domNodeCount: 0,
      a11yViolations: 0,
      a11yPasses: 0,
      a11yScore: 0,
      reliable: false,
      error: (err as Error).message?.slice(0, 120),
    }
  }
}

// ── Main test ────────────────────────────────────────────────────────────────

const newResults: ComparisonResult[] = []

describe('Comparison benchmark — missing components', () => {
  // Load existing comparison data to filter out already-covered components
  let existing: ComparisonOutput | null = null
  const existingComponents = new Set<string>()
  const rerunComponents = new Set<string>()

  if (existsSync(COMPARISON_PATH)) {
    existing = JSON.parse(readFileSync(COMPARISON_PATH, 'utf-8')) as ComparisonOutput
    for (const comp of existing.comparisons) {
      existingComponents.add(comp.rigComponent)
      // Re-run components with errors or low a11y scores
      const result = comp.results[0]
      if (result?.error || (result && result.a11yScore < 90)) {
        rerunComponents.add(comp.rigComponent)
      }
    }
    // Remove stale entries that will be re-run
    if (rerunComponents.size > 0) {
      existing.comparisons = existing.comparisons.filter(
        (c) => !rerunComponents.has(c.rigComponent),
      )
    }
  }

  const missing = COMPONENTS.filter(
    (c) => !existingComponents.has(c.name) || rerunComponents.has(c.name),
  )

  if (missing.length === 0) {
    it('all components already covered', () => {
      expect(true).toBe(true)
      console.log('  All 8 target components already in comparison.json')
    })
    return
  }

  for (const entry of missing) {
    it(`${entry.name} (${entry.pkg})`, async () => {
      console.log(`  Benchmarking ${entry.name}...`)
      const result = await benchmarkComponent(entry)

      newResults.push({
        rigComponent: entry.name,
        rigPackage: entry.pkg,
        results: [result],
      })

      // Verify we got a result
      expect(result.lib).toBe('rig')
      expect(result.mountMedianMs).toBeGreaterThanOrEqual(0)

      console.log(
        `    mount: ${result.mountMedianMs}ms | a11y: ${result.a11yScore} | ` +
          `violations: ${result.a11yViolations} | passes: ${result.a11yPasses} | ` +
          `reliable: ${result.reliable}`,
      )
    })
  }

  afterAll(() => {
    if (newResults.length === 0) return

    // Merge into existing comparison.json
    if (!existsSync(HEALTH_DIR)) mkdirSync(HEALTH_DIR, { recursive: true })

    let data: ComparisonOutput
    if (existing) {
      data = existing
      data.comparisons.push(...newResults)
    } else {
      data = {
        timestamp: new Date().toISOString(),
        iterations: ITERATIONS,
        comparisons: newResults,
      }
    }

    // Update timestamp
    data.timestamp = new Date().toISOString()

    // Recompute stats
    let totalResults = 0
    let reliableResults = 0
    let warningResults = 0
    let errorResults = 0
    for (const comp of data.comparisons) {
      for (const r of comp.results) {
        totalResults++
        if (r.error) errorResults++
        else if (r.renderWarning) warningResults++
        else if (r.reliable) reliableResults++
        else warningResults++
      }
    }
    data.stats = { totalResults, reliableResults, warningResults, errorResults }

    writeFileSync(COMPARISON_PATH, `${JSON.stringify(data, null, 2)}\n`)
    console.log(`\n  ✓ Added ${newResults.length} entries to comparison.json`)
    console.log(`    Total components: ${data.comparisons.length}`)
  })
})
