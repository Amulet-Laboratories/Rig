<script setup lang="ts">
const packages = [
  {
    name: 'Core',
    icon: 'C',
    count: 37,
    desc: 'Button, Input, Select, Switch, Checkbox, Slider, Badge, Card, Form, Rating, Pagination, and more',
  },
  {
    name: 'Layout',
    icon: 'L',
    count: 12,
    desc: 'Modal, Drawer, TitleBar, Panel, Accordion, SplitView, ScrollArea, ResizablePanel',
  },
  {
    name: 'Navigation',
    icon: 'N',
    count: 13,
    desc: 'ActivityBar, Breadcrumbs, Tabs, Stepper, StatusBar, Timeline, NavigationMenu',
  },
  {
    name: 'Editor',
    icon: 'E',
    count: 5,
    desc: 'CodeBlock, ColorPicker, DiffViewer, EditorTab, EditorWorkbench',
  },
  { name: 'Lists', icon: 'Li', count: 4, desc: 'DataGrid, List, Table, TreeView' },
  {
    name: 'Menus',
    icon: 'M',
    count: 6,
    desc: 'CommandPalette, ContextMenu, DropdownMenu, Menubar, ActionBar',
  },
  {
    name: 'Extras',
    icon: 'Ex',
    count: 16,
    desc: 'Alert, Toast, Tooltip, Carousel, Popconfirm, KanbanBoard, NotificationCenter, CalendarGrid, ConfirmDialog, LiveRegion, ErrorBoundary',
  },
  {
    name: 'Shell',
    icon: 'Sh',
    count: 8,
    desc: 'IdeShell, ChatPanel, SearchPanel, FileBrowser, ContentViewer, FormView, WelcomeView, SettingsView',
  },
  {
    name: 'Data',
    icon: 'D',
    count: 14,
    desc: 'BarChart, LineChart, AreaChart, Heatmap, RadarChart, SankeyDiagram, Treemap, Sparkline, StatCard',
  },
  {
    name: 'Spatial',
    icon: 'Sp',
    count: 5,
    desc: 'GlobeView, GraphNetwork, MapCanvas, PointCloud, ScatterPlot3D',
  },
  {
    name: 'Temporal',
    icon: 'T',
    count: 5,
    desc: 'AnimatedChart, ParticleField, PlaybackControls, TimelineScrubber, TemporalHeatmap',
  },
  {
    name: 'Web',
    icon: 'W',
    count: 19,
    desc: 'SiteShell, SiteNav, Hero, Section, StatRow, CTABanner, Testimonial, SiteFooter, MenuList, Gallery, ContactForm, ServiceGrid, TeamGrid, FeatureList, and more',
  },
]
</script>

<template>
  <section id="packages" class="reveal px-6 py-24" aria-labelledby="pkg-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Packages
        </div>
        <h2
          id="pkg-title"
          class="mb-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          144 components across 12 packages
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          From primitive form controls to data visualization, spatial rendering, temporal animation,
          and marketing page scaffolds. Every component is headless, accessible, and slot-driven.
        </p>
      </div>

      <div
        class="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="pkg in packages"
          :key="pkg.name"
          class="rounded-lg border border-border-subtle bg-bg-elevated p-5 transition hover:-translate-y-0.5 hover:border-border hover:bg-bg-surface"
        >
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="flex h-6 w-6 items-center justify-center rounded bg-primary-dim text-[10px] font-bold text-primary"
              >
                {{ pkg.icon }}
              </span>
              <h4 class="text-[15px] font-semibold tracking-tight">{{ pkg.name }}</h4>
            </div>
            <span
              class="rounded-full bg-primary-dim px-2 py-0.5 text-xs font-semibold tabular-nums text-primary"
            >
              {{ pkg.count }}
            </span>
          </div>
          <p class="text-[13px] leading-relaxed text-text-muted">{{ pkg.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
