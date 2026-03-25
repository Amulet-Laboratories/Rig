<script setup lang="ts">
import { ref, computed } from 'vue'

interface ThemeDef {
  id: string
  label: string
  scheme: 'dark' | 'light'
  primary: string
  bg: string
  fg: string
  card: string
  border: string
  muted: string
  mutedFg: string
  secondary: string
  input: string
  destructive: string
  success: string
  warning: string
  info: string
  radius: string
}

const themes: ThemeDef[] = [
  // Dark
  {
    id: 'vscode',
    label: 'VSCode',
    scheme: 'dark',
    primary: '#0078d4',
    bg: '#1f1f1f',
    fg: '#cccccc',
    card: '#181818',
    border: '#2b2b2b',
    muted: '#181818',
    mutedFg: '#9d9d9d',
    secondary: '#313131',
    input: '#3c3c3c',
    destructive: '#f85149',
    success: '#2ea043',
    warning: '#cca700',
    info: '#75beff',
    radius: '4px',
  },
  {
    id: 'garden',
    label: 'Garden',
    scheme: 'dark',
    primary: '#eb4963',
    bg: '#331f3c',
    fg: '#f5e3bc',
    card: '#eb4963',
    border: '#ac3954',
    muted: '#ac3954',
    mutedFg: '#f9b0a2',
    secondary: '#ac3954',
    input: '#ac3954',
    destructive: '#f58384',
    success: '#cbe6c5',
    warning: '#f7d7b9',
    info: '#d8e8c3',
    radius: '7px',
  },
  {
    id: 'forge',
    label: 'Forge',
    scheme: 'dark',
    primary: '#e6c830',
    bg: '#0e0d0c',
    fg: '#d4ccba',
    card: '#1e1c1a',
    border: '#3a3530',
    muted: '#1e1c1a',
    mutedFg: '#8a8478',
    secondary: '#1e1c1a',
    input: '#3a3530',
    destructive: '#ff4444',
    success: '#33dd33',
    warning: '#ffcc44',
    info: '#4488ff',
    radius: '2px',
  },
  {
    id: 'duskline',
    label: 'Duskline',
    scheme: 'dark',
    primary: '#3cc8b4',
    bg: '#0a0f14',
    fg: '#d8e4ec',
    card: '#121a22',
    border: '#1e3040',
    muted: '#1a2430',
    mutedFg: '#6a8494',
    secondary: '#1a2430',
    input: '#1e3040',
    destructive: '#e05555',
    success: '#2db87a',
    warning: '#d4a040',
    info: '#5a8ab8',
    radius: '2px',
  },
  {
    id: 'greyline',
    label: 'Greyline',
    scheme: 'dark',
    primary: '#9a9a9a',
    bg: '#0c0c0c',
    fg: '#e8e8e8',
    card: '#141414',
    border: '#2a2a2a',
    muted: '#1c1c1c',
    mutedFg: '#606060',
    secondary: '#1c1c1c',
    input: '#2a2a2a',
    destructive: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
    radius: '4px',
  },
  {
    id: 'lanternhouse',
    label: 'Lanternhouse',
    scheme: 'dark',
    primary: '#a87bd4',
    bg: '#110e18',
    fg: '#e4dff0',
    card: '#1a1624',
    border: '#2e2840',
    muted: '#221e30',
    mutedFg: '#8a80a0',
    secondary: '#221e30',
    input: '#2e2840',
    destructive: '#d45a5a',
    success: '#5aaa70',
    warning: '#d4a843',
    info: '#7a8eb8',
    radius: '5px',
  },
  {
    id: 'spacewizard',
    label: 'Spacewizard',
    scheme: 'dark',
    primary: '#aef66d',
    bg: '#060d2b',
    fg: '#cad3f7',
    card: '#0a1440',
    border: '#1e2a6b',
    muted: '#111d52',
    mutedFg: '#7b88b8',
    secondary: '#111d52',
    input: '#1e2a6b',
    destructive: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
    radius: '6px',
  },
  {
    id: 'undertow',
    label: 'Undertow',
    scheme: 'dark',
    primary: '#d95f2a',
    bg: '#1c1917',
    fg: '#f5f0eb',
    card: '#292524',
    border: '#4a4440',
    muted: '#3b3633',
    mutedFg: '#a8a09a',
    secondary: '#3b3633',
    input: '#4a4440',
    destructive: '#cc3333',
    success: '#5a8a5a',
    warning: '#c9b458',
    info: '#6b8faa',
    radius: '4px',
  },
  {
    id: 'quizbit',
    label: 'Quizbit',
    scheme: 'dark',
    primary: '#c9956d',
    bg: '#12100c',
    fg: '#f5f1ed',
    card: '#1e1a14',
    border: '#302a22',
    muted: '#2a2520',
    mutedFg: '#a89e94',
    secondary: '#2a2520',
    input: '#302a22',
    destructive: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    radius: '8px',
  },
  // Light
  {
    id: 'aldricpace',
    label: 'Aldricpace',
    scheme: 'light',
    primary: '#2b4c7e',
    bg: '#fafbfc',
    fg: '#1b2033',
    card: '#f2f4f7',
    border: '#d1d5de',
    muted: '#e6e9ef',
    mutedFg: '#555e73',
    secondary: '#e6e9ef',
    input: '#d1d5de',
    destructive: '#9e3b3b',
    success: '#3b7a57',
    warning: '#b8952a',
    info: '#2b4c7e',
    radius: '3px',
  },
  {
    id: 'briarcove',
    label: 'Briarcove',
    scheme: 'light',
    primary: '#6d42c4',
    bg: '#ffffff',
    fg: '#1a1428',
    card: '#f5f2fa',
    border: '#d8d0e5',
    muted: '#ede8f5',
    mutedFg: '#6a5a80',
    secondary: '#ede8f5',
    input: '#d8d0e5',
    destructive: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
    info: '#6d42c4',
    radius: '3px',
  },
  {
    id: 'briarcovelib',
    label: 'Briarcove Lib',
    scheme: 'light',
    primary: '#a5562e',
    bg: '#faf8f4',
    fg: '#2b2622',
    card: '#f0ece3',
    border: '#d0c8ba',
    muted: '#e2dcd0',
    mutedFg: '#6b6054',
    secondary: '#e2dcd0',
    input: '#d0c8ba',
    destructive: '#b83232',
    success: '#3b7a57',
    warning: '#c49030',
    info: '#3a6b8c',
    radius: '6px',
  },
  {
    id: 'compass',
    label: 'Compass',
    scheme: 'light',
    primary: '#2d7a3e',
    bg: '#f8fdf6',
    fg: '#1a2a1a',
    card: '#f0f5ee',
    border: '#c0d8c0',
    muted: '#e0ece0',
    mutedFg: '#4a6a4a',
    secondary: '#e0ece0',
    input: '#c0d8c0',
    destructive: '#cc3b3b',
    success: '#2d7a3e',
    warning: '#d4a030',
    info: '#4a7a9e',
    radius: '8px',
  },
  {
    id: 'kbcv',
    label: 'KBCV',
    scheme: 'light',
    primary: '#b83232',
    bg: '#f7f3ee',
    fg: '#2a2521',
    card: '#edeae4',
    border: '#cbc4ba',
    muted: '#ddd7ce',
    mutedFg: '#706459',
    secondary: '#ddd7ce',
    input: '#cbc4ba',
    destructive: '#b83232',
    success: '#2d6a4f',
    warning: '#d4a030',
    info: '#4a6a8a',
    radius: '6px',
  },
  {
    id: 'marenlys',
    label: 'Marenlys',
    scheme: 'light',
    primary: '#c43a8a',
    bg: '#fafafa',
    fg: '#1a0a18',
    card: '#faf5f8',
    border: '#e5d5e0',
    muted: '#f2e8f0',
    mutedFg: '#8a6a80',
    secondary: '#f2e8f0',
    input: '#e5d5e0',
    destructive: '#cc4444',
    success: '#44884a',
    warning: '#b8952a',
    info: '#7a5a9a',
    radius: '0px',
  },
  {
    id: 'saltsignal',
    label: 'Saltsignal',
    scheme: 'light',
    primary: '#b8860b',
    bg: '#faf6ee',
    fg: '#2a2210',
    card: '#fffcf4',
    border: '#d8ccb0',
    muted: '#ede4d4',
    mutedFg: '#7a6a4a',
    secondary: '#ede4d4',
    input: '#d8ccb0',
    destructive: '#b84233',
    success: '#3d6b4f',
    warning: '#d4a843',
    info: '#5a7aaa',
    radius: '10px',
  },
  {
    id: 'tidemark',
    label: 'Tidemark',
    scheme: 'light',
    primary: '#1a7a7a',
    bg: '#faf7f2',
    fg: '#2c2420',
    card: '#fffdf8',
    border: '#d4c9b8',
    muted: '#e8e0d4',
    mutedFg: '#6a8888',
    secondary: '#e8e0d4',
    input: '#d4c9b8',
    destructive: '#c4634f',
    success: '#7a9e7e',
    warning: '#d4a843',
    info: '#1a7a7a',
    radius: '7px',
  },
]

const activeId = ref('vscode')
const active = computed(() => themes.find((t) => t.id === activeId.value) ?? themes[0]!)
const darkThemes = computed(() => themes.filter((t) => t.scheme === 'dark'))
const lightThemes = computed(() => themes.filter((t) => t.scheme === 'light'))

function vars(t: ThemeDef): string {
  return [
    `--background:${t.bg}`,
    `--foreground:${t.fg}`,
    `--card:${t.card}`,
    `--card-foreground:${t.fg}`,
    `--primary:${t.primary}`,
    `--primary-foreground:${t.scheme === 'dark' ? t.bg : '#ffffff'}`,
    `--secondary:${t.secondary}`,
    `--secondary-foreground:${t.fg}`,
    `--muted:${t.muted}`,
    `--muted-foreground:${t.mutedFg}`,
    `--accent:${t.primary}`,
    `--accent-foreground:${t.scheme === 'dark' ? t.bg : '#ffffff'}`,
    `--border:${t.border}`,
    `--input:${t.input}`,
    `--ring:${t.primary}`,
    `--destructive:${t.destructive}`,
    `--success:${t.success}`,
    `--warning:${t.warning}`,
    `--info:${t.info}`,
    `--radius:${t.radius}`,
    `--color-background:${t.bg}`,
    `--color-foreground:${t.fg}`,
    `--color-primary:${t.primary}`,
    `--color-border:${t.border}`,
    `--color-card:${t.card}`,
    `--color-card-foreground:${t.fg}`,
    `--color-muted:${t.muted}`,
    `--color-muted-foreground:${t.mutedFg}`,
    `--color-secondary:${t.secondary}`,
    `--color-input:${t.input}`,
    `--color-ring:${t.primary}`,
    `--color-destructive:${t.destructive}`,
    `--color-success:${t.success}`,
    `--color-warning:${t.warning}`,
    `--color-info:${t.info}`,
    `--color-primary-foreground:${t.scheme === 'dark' ? t.bg : '#ffffff'}`,
    `--rig-button-bg:${t.primary}`,
    `--rig-button-fg:${t.scheme === 'dark' ? t.bg : '#ffffff'}`,
    `--rig-button-hover-bg:${t.secondary}`,
    `--rig-input-bg:${t.card}`,
    `--rig-input-border:${t.border}`,
    `--rig-input-fg:${t.fg}`,
    `--rig-badge-bg:${t.primary}`,
    `--rig-badge-fg:${t.scheme === 'dark' ? t.bg : '#ffffff'}`,
    `--rig-checkbox-bg:${t.card}`,
    `--rig-checkbox-border:${t.border}`,
    `--rig-progress-bg:${t.primary}`,
    `--rig-description-fg:${t.mutedFg}`,
    `--rig-input-placeholder:${t.mutedFg}`,
  ].join(';')
}

const colorSlots = computed(() => [
  { label: 'background', color: active.value.bg },
  { label: 'foreground', color: active.value.fg },
  { label: 'primary', color: active.value.primary },
  { label: 'card', color: active.value.card },
  { label: 'secondary', color: active.value.secondary },
  { label: 'border', color: active.value.border },
  { label: 'muted-fg', color: active.value.mutedFg },
  { label: 'destructive', color: active.value.destructive },
  { label: 'success', color: active.value.success },
  { label: 'warning', color: active.value.warning },
  { label: 'info', color: active.value.info },
])
</script>

<template>
  <Story title="Theme Explorer" icon="lucide:palette" group="demos">
    <Variant title="All Themes">
      <div
        :style="vars(active)"
        style="
          max-width: 920px;
          padding: 16px;
          font-family: var(--font-sans, system-ui, sans-serif);
          color: var(--foreground);
          background: var(--background);
          border-radius: var(--radius, 4px);
        "
      >
        <!-- Theme picker: Dark -->
        <div style="margin-bottom: 8px">
          <div
            style="
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: var(--muted-foreground);
              margin-bottom: 6px;
            "
          >
            Dark
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap">
            <button
              v-for="t in darkThemes"
              :key="t.id"
              type="button"
              :style="{
                background: activeId === t.id ? t.primary : 'transparent',
                color:
                  activeId === t.id
                    ? t.scheme === 'dark'
                      ? t.bg
                      : '#fff'
                    : 'var(--muted-foreground)',
                border: activeId === t.id ? '1px solid transparent' : '1px solid var(--border)',
                borderRadius: 'var(--radius, 4px)',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: activeId === t.id ? '600' : '400',
                cursor: 'pointer',
              }"
              @click="activeId = t.id"
            >
              <span
                :style="{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: t.primary,
                  marginRight: '6px',
                  verticalAlign: 'middle',
                }"
              />
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- Theme picker: Light -->
        <div
          style="margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border)"
        >
          <div
            style="
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: var(--muted-foreground);
              margin-bottom: 6px;
            "
          >
            Light
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap">
            <button
              v-for="t in lightThemes"
              :key="t.id"
              type="button"
              :style="{
                background: activeId === t.id ? t.primary : 'transparent',
                color: activeId === t.id ? '#fff' : 'var(--muted-foreground)',
                border: activeId === t.id ? '1px solid transparent' : '1px solid var(--border)',
                borderRadius: 'var(--radius, 4px)',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: activeId === t.id ? '600' : '400',
                cursor: 'pointer',
              }"
              @click="activeId = t.id"
            >
              <span
                :style="{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: t.primary,
                  marginRight: '6px',
                  verticalAlign: 'middle',
                }"
              />
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- Header -->
        <div style="margin-bottom: 20px">
          <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 4px; color: var(--foreground)">
            {{ active.label }}
          </h1>
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px">
            <span
              :style="{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '99px',
                background: active.scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                color: 'var(--muted-foreground)',
              }"
            >
              {{ active.scheme }}
            </span>
            <span style="font-size: 11px; color: var(--muted-foreground)"
              >radius: {{ active.radius }}</span
            >
          </div>
          <code style="font-size: 11px; font-family: var(--font-mono, monospace); opacity: 0.5">
            @import '@amulet-laboratories/hex/{{ active.id }}'
          </code>
        </div>

        <!-- Component preview -->
        <div
          style="
            border: 1px solid var(--border);
            border-radius: var(--radius, 4px);
            padding: 20px;
            margin-bottom: 20px;
            background: var(--background);
          "
        >
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
          </div>

          <!-- Progress + Kbd + Dots -->
          <div
            style="
              display: flex;
              gap: 10px;
              align-items: center;
              flex-wrap: wrap;
              margin-bottom: 14px;
            "
          >
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
            <label data-rig-checkbox><input type="checkbox" checked /> Checked</label>
            <label data-rig-checkbox><input type="checkbox" /> Unchecked</label>
            <label data-rig-checkbox data-disabled=""
              ><input type="checkbox" disabled checked /> Disabled</label
            >
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
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
            gap: 6px;
            margin-bottom: 16px;
          "
        >
          <div
            v-for="slot in colorSlots"
            :key="slot.label"
            style="
              border-radius: 5px;
              overflow: hidden;
              border: 1px solid rgba(128, 128, 128, 0.15);
            "
          >
            <div style="height: 28px" :style="{ background: slot.color }" />
            <div :style="{ padding: '4px 6px', background: 'var(--card)' }">
              <div
                style="
                  font-size: 8px;
                  font-family: var(--font-mono, monospace);
                  color: var(--muted-foreground);
                  text-transform: uppercase;
                  letter-spacing: 0.04em;
                "
              >
                {{ slot.label }}
              </div>
              <div
                style="
                  font-size: 8px;
                  font-family: var(--font-mono, monospace);
                  color: var(--foreground);
                  opacity: 0.7;
                "
              >
                {{ slot.color }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
