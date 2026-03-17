import { defineNuxtModule, addImports, addComponent } from '@nuxt/kit'

/**
 * @amulet-laboratories/rig-nuxt
 *
 * Nuxt module that auto-imports all Rig components and composables.
 * Tree-shaking works automatically — only components used in templates are bundled.
 *
 * Usage in nuxt.config.ts:
 *   modules: ['@amulet-laboratories/rig-nuxt']
 *
 * Options:
 *   prefix: string — component prefix (default: '' — no prefix)
 *   composables: boolean — auto-import composables (default: true)
 */

export interface NuxtRigOptions {
  /** Prefix for component names (e.g. 'Rig' → RigButton, RigModal) */
  prefix?: string
  /** Whether to auto-import composables (default: true) */
  composables?: boolean
}

const COMPONENTS = [
  // Core primitives
  'Icon',
  'Button',
  'Input',
  'Select',
  'Textarea',
  'Checkbox',
  'Switch',
  'RadioGroup',
  'Badge',
  'Progress',
  'InlineEditor',
  'Resizer',
  'Card',
  'Divider',
  'Kbd',
  'TagInput',
  'Combobox',
  'Label',
  'ToggleGroup',
  'Slider',
  'Avatar',
  'Dot',
  'PulseIndicator',
  'ProgressRing',
  'RangeSlider',
  'AvatarGroup',
  'Pagination',
  'FileInput',
  'Rating',
  'ConfigProvider',
  'Form',
  'NumberInput',
  'OTPInput',
  'Transfer',
  'Mention',
  'InfiniteScroll',
  // Layout
  'ShellGrid',
  'SplitView',
  'Panel',
  'Modal',
  'Collapsible',
  'Accordion',
  'Popover',
  'ScrollArea',
  'PeekView',
  'ResizablePanel',
  'TitleBar',
  'Drawer',
  // Nav
  'NavigationMenu',
  // Navigation
  'ActivityBar',
  'SideBar',
  'View',
  'PanelBar',
  'StatusBar',
  'Breadcrumbs',
  'Tabs',
  'Timeline',
  'Stepper',
  'DatePicker',
  'DateRangePicker',
  // Editor
  'EditorWorkbench',
  'EditorTab',
  'CodeBlock',
  'DiffViewer',
  'ColorPicker',
  // Lists
  'List',
  'TreeView',
  'Table',
  'DataGrid',
  // Menus
  'ContextMenu',
  'CommandPalette',
  'ActionBar',
  'KeyboardHint',
  'DropdownMenu',
  'Menubar',
  // Extras
  'Toast',
  'EmptyState',
  'Tooltip',
  'Skeleton',
  'PropertyGrid',
  'NotificationCenter',
  'KanbanBoard',
  'CalendarGrid',
  'Alert',
  'Carousel',
  'ImagePreview',
  'Popconfirm',
  'LoadingOverlay',
  // Shell
  'IdeShell',
  // Data
  'Sparkline',
  'MiniBar',
  'StatCard',
  'BarChart',
  'LineChart',
  'AreaChart',
  'ScatterPlot',
  'Heatmap',
  'RadarChart',
  'Treemap',
  'SankeyDiagram',
  // Spatial
  'MapCanvas',
  'GlobeView',
  'ScatterPlot3D',
  'GraphNetwork',
  'PointCloud',
  // Temporal
  'TimelineScrubber',
  'AnimatedChart',
  'PlaybackControls',
  'TemporalHeatmap',
  'ParticleField',
] as const

const COMPOSABLES = [
  'useFocusTrap',
  'useKeyboard',
  'usePersistedState',
  'useGlobalState',
  'useCommandRegistry',
  'useTooltip',
  'useVirtualList',
  'provideDragDrop',
  'useDragDrop',
  'useReducedMotion',
  'useScrollVisibility',
  'useParallax',
  'useMediaPlayback',
  'useShellState',
  'useToast',
  'useNotifications',
  'provideConfig',
  'useConfig',
  'useComponentDefaults',
  'useFormValidation',
] as const

export default defineNuxtModule<NuxtRigOptions>({
  meta: {
    name: '@amulet-laboratories/rig-nuxt',
    configKey: 'rig',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    prefix: '',
    composables: true,
  },
  setup(options) {
    const prefix = options.prefix ?? ''

    // Auto-import all components
    for (const name of COMPONENTS) {
      addComponent({
        name: `${prefix}${name}`,
        export: name,
        filePath: '@amulet-laboratories/rig',
      })
    }

    // Auto-import composables
    if (options.composables !== false) {
      for (const name of COMPOSABLES) {
        addImports({
          name,
          from: '@amulet-laboratories/rig',
        })
      }

      // Toast and notification singletons
      addImports({ name: 'toast', from: '@amulet-laboratories/rig' })
      addImports({ name: 'notification', from: '@amulet-laboratories/rig' })
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    rig?: NuxtRigOptions
  }
}
