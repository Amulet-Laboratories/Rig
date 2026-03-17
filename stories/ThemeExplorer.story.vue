<script setup lang="ts">
import { ref } from 'vue'

// ── Token data ────────────────────────────────────────────────────────────────

interface ThemeDef {
  id: string
  label: string
  description: string
  vars: Record<string, string>
  colorSlots: Array<{ key: string; label: string }>
}

const themes: ThemeDef[] = [
  {
    id: 'vscode',
    label: 'VSCode',
    description: 'VS Code Dark Modern — 1:1 token mapping from dark_modern.json.',
    vars: {
      '--background': '#1f1f1f',
      '--foreground': '#cccccc',
      '--card': '#181818',
      '--card-foreground': '#cccccc',
      '--primary': '#0078d4',
      '--primary-foreground': '#ffffff',
      '--secondary': '#313131',
      '--secondary-foreground': '#cccccc',
      '--muted': '#181818',
      '--muted-foreground': '#9d9d9d',
      '--accent': '#2b2b2b',
      '--accent-foreground': '#cccccc',
      '--border': '#2b2b2b',
      '--input': '#3c3c3c',
      '--ring': '#0078d4',
      '--destructive': '#f85149',
      '--success': '#2ea043',
      '--warning': '#cca700',
      '--info': '#75beff',
      '--radius': '4px',
      '--font-sans': '-apple-system, "Segoe UI", system-ui, sans-serif',
      '--font-mono': '"SF Mono", Consolas, "Courier New", monospace',
      // --color-* tokens used by data-rig-* CSS selectors
      '--color-background': '#1f1f1f',
      '--color-foreground': '#cccccc',
      '--color-card': '#181818',
      '--color-card-foreground': '#cccccc',
      '--color-primary': '#0078d4',
      '--color-primary-foreground': '#ffffff',
      '--color-secondary': '#313131',
      '--color-secondary-foreground': '#cccccc',
      '--color-muted': '#181818',
      '--color-muted-foreground': '#9d9d9d',
      '--color-accent': '#2b2b2b',
      '--color-accent-foreground': '#cccccc',
      '--color-border': '#2b2b2b',
      '--color-input': '#3c3c3c',
      '--color-ring': '#0078d4',
      '--color-destructive': '#f85149',
      '--color-success': '#2ea043',
      '--color-warning': '#cca700',
      '--color-info': '#75beff',
      // --rig-* component tokens — VSCode-specific values
      '--rig-button-bg': '#0078d4',
      '--rig-button-fg': '#ffffff',
      '--rig-button-hover-bg': '#026ec1',
      '--rig-button-border': 'rgba(255,255,255,0.1)',
      '--rig-button-secondary-bg': 'transparent',
      '--rig-button-secondary-fg': '#cccccc',
      '--rig-button-secondary-hover-bg': '#2b2b2b',
      '--rig-badge-bg': '#616161',
      '--rig-badge-fg': '#f8f8f8',
      '--rig-input-bg': '#313131',
      '--rig-input-border': '#3c3c3c',
      '--rig-input-fg': '#cccccc',
      '--rig-input-placeholder': '#989898',
      '--rig-checkbox-bg': '#313131',
      '--rig-checkbox-border': '#3c3c3c',
      '--rig-progress-bg': '#0078d4',
      '--rig-description-fg': '#9d9d9d',
    },
    colorSlots: [
      { key: '#1f1f1f', label: 'background' },
      { key: '#cccccc', label: 'foreground' },
      { key: '#0078d4', label: 'primary' },
      { key: '#181818', label: 'card' },
      { key: '#313131', label: 'secondary' },
      { key: '#2b2b2b', label: 'accent' },
      { key: '#2b2b2b', label: 'border' },
      { key: '#f85149', label: 'destructive' },
      { key: '#2ea043', label: 'success' },
      { key: '#cca700', label: 'warning' },
      { key: '#75beff', label: 'info' },
      { key: '#9d9d9d', label: 'muted-fg' },
    ],
  },
  {
    id: 'garden',
    label: 'Garden',
    description: 'Warm illustrative palette — deep purple background, cream text, rose accents.',
    vars: {
      '--background': '#372d3b',
      '--foreground': '#ffffde',
      '--card': '#c4415d',
      '--card-foreground': '#ffffde',
      '--primary': '#d94362',
      '--primary-foreground': '#ffffde',
      '--secondary': '#4f3043',
      '--secondary-foreground': '#ffffde',
      '--muted': '#4f3043',
      '--muted-foreground': '#c9b8a8',
      '--accent': '#c4415d',
      '--accent-foreground': '#ffffde',
      '--border': '#4f3043',
      '--input': '#4f3043',
      '--ring': '#d94362',
      '--destructive': '#ef4444',
      '--success': '#22c55e',
      '--warning': '#f59e0b',
      '--info': '#3b82f6',
      '--radius': '7px',
      '--font-sans': '"Roboto Slab", Georgia, serif',
      '--font-mono': '"JetBrains Mono", "Fira Code", monospace',
      // --color-* tokens
      '--color-background': '#372d3b',
      '--color-foreground': '#ffffde',
      '--color-card': '#c4415d',
      '--color-card-foreground': '#ffffde',
      '--color-primary': '#d94362',
      '--color-primary-foreground': '#ffffde',
      '--color-secondary': '#4f3043',
      '--color-secondary-foreground': '#ffffde',
      '--color-muted': '#4f3043',
      '--color-muted-foreground': '#c9b8a8',
      '--color-accent': '#c4415d',
      '--color-accent-foreground': '#ffffde',
      '--color-border': '#4f3043',
      '--color-input': '#4f3043',
      '--color-ring': '#d94362',
      '--color-destructive': '#ef4444',
      '--color-success': '#22c55e',
      '--color-warning': '#f59e0b',
      '--color-info': '#3b82f6',
      // --rig-* component tokens
      '--rig-button-bg': '#d94362',
      '--rig-button-fg': '#ffffde',
      '--rig-button-hover-bg': '#b93953',
      '--rig-button-border': 'transparent',
      '--rig-button-secondary-bg': 'transparent',
      '--rig-button-secondary-fg': '#ffffde',
      '--rig-button-secondary-hover-bg': '#4f3043',
      '--rig-badge-bg': '#d94362',
      '--rig-badge-fg': '#ffffde',
      '--rig-input-bg': '#4f3043',
      '--rig-input-border': '#4f3043',
      '--rig-input-fg': '#ffffde',
      '--rig-input-placeholder': '#c9b8a8',
      '--rig-checkbox-bg': '#4f3043',
      '--rig-checkbox-border': '#4f3043',
      '--rig-progress-bg': '#d94362',
      '--rig-description-fg': '#c9b8a8',
    },
    colorSlots: [
      { key: '#372d3b', label: 'background' },
      { key: '#ffffde', label: 'foreground' },
      { key: '#d94362', label: 'primary' },
      { key: '#c4415d', label: 'card' },
      { key: '#4f3043', label: 'secondary' },
      { key: '#c4415d', label: 'accent' },
      { key: '#4f3043', label: 'border' },
      { key: '#ef4444', label: 'destructive' },
      { key: '#22c55e', label: 'success' },
      { key: '#f59e0b', label: 'warning' },
      { key: '#3b82f6', label: 'info' },
      { key: '#c9b8a8', label: 'muted-fg' },
    ],
  },
]

// Global active theme — shared across all variant panels
const activeId = ref('vscode')

function activeTheme(): ThemeDef {
  return themes.find((t) => t.id === activeId.value) ?? themes[0]!
}

function scopedStyle(): string {
  return Object.entries(activeTheme().vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
}

function setTheme(themeId: string): void {
  activeId.value = themeId
}

function buttonStyle(themeId: string): string {
  return activeId.value === themeId
    ? 'background:var(--primary);color:var(--primary-foreground);border:1px solid transparent;border-radius:var(--radius,4px);padding:4px 14px;font-size:12px;font-weight:600;cursor:pointer;transition:background 0.15s'
    : 'background:transparent;color:var(--muted-foreground);border:1px solid var(--border);border-radius:var(--radius,4px);padding:4px 14px;font-size:12px;cursor:pointer;transition:background 0.15s'
}
</script>

<template>
  <Story title="Theme Explorer" icon="lucide:palette" group="top">
    <Variant v-for="vt in themes" :key="vt.id" :title="vt.label">
      <div
        :style="scopedStyle()"
        style="
          max-width: 860px;
          padding: 12px;
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--foreground);
          background: var(--background);
          border-radius: var(--radius, 4px);
        "
      >
        <!-- Theme switcher -->
        <div
          style="
            display: flex;
            gap: 6px;
            margin-bottom: 20px;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--border);
          "
        >
          <button
            v-for="t in themes"
            :key="t.id"
            type="button"
            :style="buttonStyle(t.id)"
            @click="setTheme(t.id)"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- Header -->
        <div style="margin-bottom: 24px">
          <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 4px; color: var(--foreground)">
            {{ activeTheme().label }}
          </h1>
          <p style="margin: 0 0 4px; font-size: 13px; color: var(--muted-foreground)">
            {{ activeTheme().description }}
          </p>
          <code style="font-size: 11px; font-family: var(--font-mono, monospace); opacity: 0.5"
            >@import '@amulet-laboratories/hex/{{ activeTheme().id }}'</code
          >
        </div>

        <!-- Live component preview -->
        <div
          style="
            border: 1px solid var(--border);
            border-radius: var(--radius, 4px);
            padding: 20px;
            margin-bottom: 20px;
            background: var(--background);
          "
        >
          <div style="margin-bottom: 12px">
            <h2
              style="font-size: 16px; font-weight: 700; margin: 0 0 2px; color: var(--foreground)"
            >
              Heading
            </h2>
            <p style="font-size: 13px; margin: 0 0 4px; color: var(--muted-foreground)">
              Body text in muted-foreground.
            </p>
            <code
              style="
                font-size: 12px;
                font-family: var(--font-mono, monospace);
                background: var(--muted);
                padding: 2px 6px;
                border-radius: 3px;
                color: var(--foreground);
              "
              >const x = 'hello'</code
            >
          </div>

          <hr style="border: none; border-top: 1px solid var(--border); margin: 14px 0" />

          <!-- Buttons -->
          <div
            style="
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
              align-items: center;
              margin-bottom: 14px;
            "
          >
            <button data-rig-button data-variant="primary" data-size="md">Primary</button>
            <button data-rig-button data-variant="ghost" data-size="md">Ghost</button>
            <button data-rig-button data-variant="danger" data-size="md">Danger</button>
            <button data-rig-button data-variant="primary" data-size="sm">Small</button>
            <button data-rig-button data-variant="primary" data-size="xs">XS</button>
            <button data-rig-button data-variant="primary" data-size="md" data-disabled="">
              Disabled
            </button>
          </div>

          <!-- Input + badges -->
          <div
            style="
              display: flex;
              gap: 10px;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 14px;
            "
          >
            <span data-rig-input style="flex: 1; min-width: 160px">
              <input placeholder="Search..." />
            </span>
            <span data-rig-badge>Default</span>
            <span data-rig-badge data-variant="active">Active</span>
            <span data-rig-badge data-variant="dormant">Dormant</span>
            <span data-rig-badge data-variant="frozen">Frozen</span>
          </div>

          <!-- Dots + Progress + Kbd -->
          <div
            style="
              display: flex;
              gap: 10px;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 14px;
            "
          >
            <span data-rig-dot data-size="sm"></span>
            <span data-rig-dot data-size="md"></span>
            <span data-rig-dot data-size="lg"></span>
            <div data-rig-progress style="flex: 1; min-width: 120px">
              <div data-rig-progress-fill style="width: 65%"></div>
            </div>
            <kbd data-rig-kbd>Ctrl</kbd>
            <kbd data-rig-kbd>K</kbd>
          </div>

          <!-- Checkboxes -->
          <div
            style="
              display: flex;
              gap: 16px;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 14px;
            "
          >
            <label data-rig-checkbox>
              <input type="checkbox" checked />
              Checked
            </label>
            <label data-rig-checkbox>
              <input type="checkbox" />
              Unchecked
            </label>
            <label data-rig-checkbox data-disabled="">
              <input type="checkbox" disabled checked />
              Disabled
            </label>
          </div>

          <!-- Card -->
          <div data-rig-card>
            <p
              style="
                margin: 0 0 4px;
                font-size: 13px;
                font-weight: 600;
                color: var(--card-foreground);
              "
            >
              Card surface
            </p>
            <p style="margin: 0; font-size: 12px; color: var(--muted-foreground)">
              Uses --color-card and --color-card-foreground.
            </p>
          </div>
        </div>

        <!-- Palette chips -->
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 6px;
            margin-bottom: 16px;
          "
        >
          <div
            v-for="slot in activeTheme().colorSlots"
            :key="slot.label"
            style="
              border-radius: 5px;
              overflow: hidden;
              border: 1px solid rgba(128, 128, 128, 0.15);
            "
          >
            <div style="height: 32px" :style="{ background: slot.key }" />
            <div :style="{ padding: '5px 7px', background: 'var(--card)' }">
              <div
                style="
                  font-size: 9px;
                  font-family: var(--font-mono, monospace);
                  color: var(--muted-foreground);
                  margin-bottom: 1px;
                  text-transform: uppercase;
                  letter-spacing: 0.04em;
                "
              >
                {{ slot.label }}
              </div>
              <div
                style="
                  font-size: 9px;
                  font-family: var(--font-mono, monospace);
                  word-break: break-all;
                  color: var(--foreground);
                  opacity: 0.75;
                "
              >
                {{ slot.key }}
              </div>
            </div>
          </div>
        </div>

        <!-- Font + radius meta -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <div
            style="
              flex: 1;
              min-width: 180px;
              padding: 10px;
              border: 1px solid var(--border);
              border-radius: var(--radius, 4px);
              background: var(--card);
            "
          >
            <div
              style="
                font-size: 9px;
                font-family: var(--font-mono, monospace);
                color: var(--muted-foreground);
                text-transform: uppercase;
                letter-spacing: 0.08em;
                margin-bottom: 5px;
              "
            >
              font-sans
            </div>
            <div
              style="font-size: 15px; color: var(--foreground)"
              :style="{ fontFamily: activeTheme().vars['--font-sans'] }"
            >
              The quick brown fox
            </div>
            <div
              style="
                font-size: 9px;
                color: var(--muted-foreground);
                margin-top: 3px;
                font-family: var(--font-mono, monospace);
              "
            >
              {{ activeTheme().vars['--font-sans']?.split(',')[0] }}
            </div>
          </div>
          <div
            style="
              flex: 1;
              min-width: 180px;
              padding: 10px;
              border: 1px solid var(--border);
              border-radius: var(--radius, 4px);
              background: var(--card);
            "
          >
            <div
              style="
                font-size: 9px;
                font-family: var(--font-mono, monospace);
                color: var(--muted-foreground);
                text-transform: uppercase;
                letter-spacing: 0.08em;
                margin-bottom: 5px;
              "
            >
              font-mono
            </div>
            <div
              style="font-size: 13px; color: var(--foreground)"
              :style="{ fontFamily: activeTheme().vars['--font-mono'] }"
            >
              const x = 'hello'
            </div>
            <div
              style="
                font-size: 9px;
                color: var(--muted-foreground);
                margin-top: 3px;
                font-family: var(--font-mono, monospace);
              "
            >
              {{ activeTheme().vars['--font-mono']?.split(',')[0] }}
            </div>
          </div>
          <div
            style="
              padding: 10px;
              border: 1px solid var(--border);
              border-radius: var(--radius, 4px);
              background: var(--card);
              display: flex;
              align-items: center;
              gap: 10px;
            "
          >
            <div
              style="
                font-size: 9px;
                font-family: var(--font-mono, monospace);
                color: var(--muted-foreground);
                text-transform: uppercase;
                letter-spacing: 0.08em;
              "
            >
              radius
            </div>
            <div
              style="
                font-family: var(--font-mono, monospace);
                font-size: 12px;
                color: var(--foreground);
              "
            >
              {{ activeTheme().vars['--radius'] }}
            </div>
            <div
              :style="{
                width: '22px',
                height: '22px',
                background: 'var(--primary)',
                borderRadius: activeTheme().vars['--radius'],
              }"
            />
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
