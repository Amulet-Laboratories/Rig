<script setup lang="ts">
const packages = [
  {
    name: 'core',
    count: 36,
    desc: 'Button, Input, Form, Rating, Pagination, NumberInput, OTP, Transfer, Mention, and more',
  },
  {
    name: 'layout',
    count: 12,
    desc: 'Modal, Drawer, TitleBar, Accordion, SplitView, ResizablePanel, ScrollArea',
  },
  {
    name: 'nav',
    count: 12,
    desc: 'Tabs, Breadcrumbs, Stepper, ActivityBar, StatusBar, NavigationMenu',
  },
  {
    name: 'editor',
    count: 5,
    desc: 'CodeBlock, ColorPicker, DiffViewer, EditorTab, EditorWorkbench',
  },
  { name: 'lists', count: 4, desc: 'TreeView, Table, DataGrid, List' },
  {
    name: 'menus',
    count: 6,
    desc: 'CommandPalette, ContextMenu, Menubar, DropdownMenu, ActionBar',
  },
  {
    name: 'extras',
    count: 16,
    desc: 'Alert, Toast, Carousel, Popconfirm, LoadingOverlay, KanbanBoard, Tooltip, Skeleton, ConfirmDialog, ErrorBoundary, LiveRegion',
  },
  {
    name: 'shell',
    count: 8,
    desc: 'IdeShell, ChatPanel, SearchPanel, FileBrowser, ContentViewer, FormView, WelcomeView, SettingsView',
  },
  {
    name: 'data',
    count: 11,
    desc: 'BarChart, LineChart, Heatmap, RadarChart, SankeyDiagram, Treemap, Sparkline',
  },
  {
    name: 'spatial',
    count: 5,
    desc: 'MapCanvas, GlobeView, ScatterPlot3D, GraphNetwork, PointCloud',
  },
  {
    name: 'temporal',
    count: 5,
    desc: 'PlaybackControls, ParticleField, AnimatedChart, TimelineScrubber, TemporalHeatmap',
  },
  {
    name: 'web',
    count: 9,
    desc: 'SiteShell, SiteNav, Hero, Section, StatRow, CTABanner, Testimonial, PricingCard, SiteFooter',
  },
]
</script>

<template>
  <Story title="Introduction" icon="lucide:book-open" group="top">
    <Variant title="Overview">
      <div
        style="
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 16px;
          color: var(--foreground);
          font-family: var(--font-sans, system-ui, sans-serif);
        "
      >
        <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px">Rig</h1>
        <p style="color: var(--muted-foreground); font-size: 15px; margin: 0 0 32px">
          Headless, accessible Vue 3 component library. VSCode-style layout, completely unstyled.
        </p>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 0 0 32px" />

        <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px">Architecture</h2>
        <p style="margin: 0 0 16px; line-height: 1.6">
          Rig is organized into 12 packages, each targeting a specific UI domain. Components emit
          semantic HTML with
          <code
            style="
              background: var(--muted);
              padding: 2px 6px;
              border-radius: 3px;
              font-family: var(--font-mono);
              font-size: 12px;
            "
            >data-rig-*</code
          >
          attributes. All styling is left to the consumer via CSS custom properties, Tailwind, or
          slot content.
        </p>

        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
            margin: 0 0 32px;
          "
        >
          <div
            v-for="pkg in packages"
            :key="pkg.name"
            style="
              padding: 12px;
              border: 1px solid var(--border);
              border-radius: var(--radius, 3px);
              background: var(--card);
            "
          >
            <div style="display: flex; align-items: center; justify-content: space-between">
              <strong style="font-size: 13px; font-family: var(--font-mono)">{{ pkg.name }}</strong>
              <span
                style="
                  font-size: 11px;
                  font-weight: 600;
                  color: var(--primary, #5ea9a2);
                  background: color-mix(in srgb, var(--primary, #5ea9a2) 15%, transparent);
                  padding: 1px 6px;
                  border-radius: 100px;
                "
                >{{ pkg.count }}</span
              >
            </div>
            <p style="margin: 4px 0 0; font-size: 12px; color: var(--muted-foreground)">
              {{ pkg.desc }}
            </p>
          </div>
        </div>

        <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px">Installation</h2>
        <pre
          style="
            background: var(--muted);
            padding: 12px 16px;
            border-radius: var(--radius, 3px);
            overflow-x: auto;
            font-family: var(--font-mono);
            font-size: 12px;
            margin: 0 0 32px;
          "
        ><code>pnpm add @amulet-laboratories/rig</code></pre>

        <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px">Usage</h2>
        <pre
          style="
            background: var(--muted);
            padding: 12px 16px;
            border-radius: var(--radius, 3px);
            overflow-x: auto;
            font-family: var(--font-mono);
            font-size: 12px;
            margin: 0 0 32px;
          "
        ><code>&lt;script setup lang="ts"&gt;
import { Button, Input, Tabs } from '@amulet-laboratories/rig'
&lt;/script&gt;

&lt;template&gt;
  &lt;Button variant="primary" @click="save"&gt;Save&lt;/Button&gt;
&lt;/template&gt;</code></pre>

        <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px">Theming</h2>
        <p style="margin: 0 0 16px; line-height: 1.6">
          Rig ships with a <strong>scaffold</strong> theme &mdash; a minimal monochrome skin that
          makes components visible out of the box. For production, use
          <code
            style="
              background: var(--muted);
              padding: 2px 6px;
              border-radius: 3px;
              font-family: var(--font-mono);
              font-size: 12px;
            "
            >@amulet-laboratories/hex</code
          >
          to apply branded multi-theme CSS layers targeting
          <code
            style="
              background: var(--muted);
              padding: 2px 6px;
              border-radius: 3px;
              font-family: var(--font-mono);
              font-size: 12px;
            "
            >data-rig-*</code
          >
          selectors.
        </p>

        <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 12px">
          Navigating these stories
        </h2>
        <ul style="margin: 0 0 16px; padding-left: 20px; line-height: 1.8">
          <li>
            <strong>Component stories</strong> &mdash; Individual components with variant showcases
            and playground controls.
          </li>
          <li>
            <strong>Demo stories</strong> &mdash; Full-page compositions (Workbench, Dashboard,
            Observatory) showing how components integrate.
          </li>
        </ul>
      </div>
    </Variant>
  </Story>
</template>
