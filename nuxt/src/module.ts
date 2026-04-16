import {
  defineNuxtModule,
  addImports,
  addComponent,
  addPlugin,
  addServerScanDir,
  createResolver,
} from '@nuxt/kit'

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
 *   content: boolean | ContentOptions — enable authority-site content features
 */

export interface ContentOptions {
  /** Enable Fathom analytics plugin (default: true) */
  fathom?: boolean
  /** Enable Sentry error tracking plugin (default: true) */
  sentry?: boolean
  /** Enable product API routes (default: true) */
  products?: boolean
  /** Enable newsletter API route (default: true) */
  newsletter?: boolean
  /** Enable RSS feed route (default: true) */
  feed?: boolean
  /** Enable sitemap route (default: true) */
  sitemap?: boolean
}

export interface NuxtRigOptions {
  /** Prefix for component names (e.g. 'Rig' → RigButton, RigModal) */
  prefix?: string
  /** Whether to auto-import composables (default: true) */
  composables?: boolean
  /** Enable authority-site content features (components, composables, plugins, server routes) */
  content?: boolean | ContentOptions
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
  // Web
  'ReadingProgress',
  'SiteShell',
  'SiteNav',
  'Hero',
  'Section',
  'StatRow',
  'CTABanner',
  'Testimonial',
  'SiteFooter',
  'PricingCard',
  'SectionDivider',
  'FlankedHeading',
  'Ornament',
  'ContactForm',
  'NewsletterForm',
  'ServiceGrid',
  'TeamGrid',
  'MenuList',
  'FeatureList',
  'Gallery',
  'MapPlaceholder',
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
    content: false,
  },
  setup(options) {
    const prefix = options.prefix ?? ''
    const { resolve } = createResolver(import.meta.url)

    // Auto-import all Rig components
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

      // Web composables
      addImports({ name: 'useHashRouter', from: '@amulet-laboratories/rig' })
      addImports({ name: 'useScrollNav', from: '@amulet-laboratories/rig' })
      addImports({ name: 'useDetailView', from: '@amulet-laboratories/rig' })
      addImports({ name: 'useFormatDate', from: '@amulet-laboratories/rig' })
      addImports({ name: 'useBreadcrumbs', from: '@amulet-laboratories/rig' })
      addImports({ name: 'useFathom', from: '@amulet-laboratories/rig' })
    }

    // ── Content features (authority-site runtime) ──
    if (!options.content) return

    const contentOpts: ContentOptions = options.content === true ? {} : options.content

    // Content components
    const contentComponents: Array<{ name: string; filePath: string }> = [
      {
        name: 'ArticleHeader',
        filePath: resolve('./runtime/components/content/ArticleHeader.vue'),
      },
      {
        name: 'ContentBreadcrumbs',
        filePath: resolve('./runtime/components/content/ContentBreadcrumbs.vue'),
      },
      {
        name: 'TableOfContents',
        filePath: resolve('./runtime/components/content/TableOfContents.vue'),
      },
      {
        name: 'RelatedArticles',
        filePath: resolve('./runtime/components/content/RelatedArticles.vue'),
      },
      {
        name: 'RelatedOnSite',
        filePath: resolve('./runtime/components/content/RelatedOnSite.vue'),
      },
      {
        name: 'NetworkArticles',
        filePath: resolve('./runtime/components/content/NetworkArticles.vue'),
      },
      {
        name: 'NetworkLinks',
        filePath: resolve('./runtime/components/content/NetworkLinks.vue'),
      },
      {
        name: 'ProductCardWrapper',
        filePath: resolve('./runtime/components/content/ProductCardWrapper.vue'),
      },
      {
        name: 'AffiliateDisclosure',
        filePath: resolve('./runtime/components/content/AffiliateDisclosure.vue'),
      },
      {
        name: 'ContentNewsletterSignup',
        filePath: resolve('./runtime/components/content/NewsletterSignup.vue'),
      },
      { name: 'QuizPromo', filePath: resolve('./runtime/components/content/QuizPromo.vue') },
      {
        name: 'QuizEmbedWrapper',
        filePath: resolve('./runtime/components/content/QuizEmbedWrapper.vue'),
      },
      {
        name: 'QuizGatedGuide',
        filePath: resolve('./runtime/components/content/QuizGatedGuide.vue'),
      },
      {
        name: 'PersonalizedHero',
        filePath: resolve('./runtime/components/content/PersonalizedHero.vue'),
      },
      {
        name: 'AdUnit',
        filePath: resolve('./runtime/components/content/AdUnit.vue'),
      },
      {
        name: 'EditorialSidebar',
        filePath: resolve('./runtime/components/content/EditorialSidebar.vue'),
      },
      {
        name: 'ContentAppFooter',
        filePath: resolve('./runtime/components/layout/ContentAppFooter.vue'),
      },
      { name: 'NetworkFooter', filePath: resolve('./runtime/components/layout/NetworkFooter.vue') },
      { name: 'CookieConsent', filePath: resolve('./runtime/components/layout/CookieConsent.vue') },
      { name: 'AdSlot', filePath: resolve('./runtime/components/layout/AdSlot.vue') },
    ]

    for (const comp of contentComponents) {
      addComponent({
        name: `${prefix}${comp.name}`,
        filePath: comp.filePath,
      })
    }

    // Content composables
    addImports({ name: 'useArticleSeo', from: resolve('./runtime/composables/useArticleSeo') })
    addImports({
      name: 'useStructuredData',
      from: resolve('./runtime/composables/useStructuredData'),
    })
    addImports({ name: 'useProducts', from: resolve('./runtime/composables/useProducts') })

    // Plugins
    if (contentOpts.fathom !== false) {
      addPlugin(resolve('./runtime/plugins/fathom.client'))
    }
    if (contentOpts.sentry !== false) {
      addPlugin(resolve('./runtime/plugins/sentry.client'))
    }

    // Server routes — use addServerScanDir so Nitro transpiles TypeScript
    addServerScanDir(resolve('./runtime/server'))
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    rig?: NuxtRigOptions
  }
}
