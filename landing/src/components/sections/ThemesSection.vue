<script setup lang="ts">
import { ref } from 'vue'

interface Theme {
  name: string
  meta: string
  bg: string
  bar: string
  btn: string
  btnText: string
  swatch: string
  text?: string
  muted?: string
  border?: string
  input?: string
}

const themes: Theme[] = [
  {
    name: 'VSCode',
    meta: 'Dark -- Gray + Blue',
    bg: '#1f1f1f',
    bar: '#2b2b2b',
    btn: '#0078d4',
    btnText: '#ffffff',
    swatch: '#0078d4',
    text: '#cccccc',
    muted: '#9d9d9d',
    border: '#2b2b2b',
    input: '#181818',
  },
  {
    name: 'Garden',
    meta: 'Dark -- Wine + Rose',
    bg: '#331f3c',
    bar: '#ac3954',
    btn: '#eb4963',
    btnText: '#f5e3bc',
    swatch: '#eb4963',
    text: '#f5e3bc',
    muted: '#f9b0a2',
    border: '#ac3954',
    input: '#3d2844',
  },
  {
    name: 'Forge',
    meta: 'Dark -- Carbon + Yellow',
    bg: '#0e0d0c',
    bar: '#1e1c1a',
    btn: '#e6c830',
    btnText: '#0e0d0c',
    swatch: '#e6c830',
    text: '#d4ccba',
    muted: '#8a8478',
    border: '#3a3530',
    input: '#1e1c1a',
  },
  {
    name: 'Duskline',
    meta: 'Dark -- Slate + Cyan',
    bg: '#0a0f14',
    bar: '#121a22',
    btn: '#3cc8b4',
    btnText: '#0a0f14',
    swatch: '#3cc8b4',
    text: '#d8e4ec',
    muted: '#6a8494',
    border: '#1e3040',
    input: '#121a22',
  },
  {
    name: 'Greyline',
    meta: 'Dark -- Black + Silver',
    bg: '#0c0c0c',
    bar: '#141414',
    btn: '#9a9a9a',
    btnText: '#0c0c0c',
    swatch: '#9a9a9a',
    text: '#e8e8e8',
    muted: '#606060',
    border: '#2a2a2a',
    input: '#141414',
  },
  {
    name: 'Lanternhouse',
    meta: 'Dark -- Plum + Lavender',
    bg: '#110e18',
    bar: '#1a1624',
    btn: '#a87bd4',
    btnText: '#110e18',
    swatch: '#a87bd4',
    text: '#e4dff0',
    muted: '#8a80a0',
    border: '#2e2840',
    input: '#1a1624',
  },
  {
    name: 'Spacewizard',
    meta: 'Dark -- Navy + Lime',
    bg: '#060d2b',
    bar: '#0a1440',
    btn: '#aef66d',
    btnText: '#060d2b',
    swatch: '#aef66d',
    text: '#cad3f7',
    muted: '#7b88b8',
    border: '#1e2a6b',
    input: '#0a1440',
  },
  {
    name: 'Undertow',
    meta: 'Dark -- Tar + Orange',
    bg: '#1c1917',
    bar: '#292524',
    btn: '#d95f2a',
    btnText: '#1c1917',
    swatch: '#d95f2a',
    text: '#f5f0eb',
    muted: '#a8a09a',
    border: '#4a4440',
    input: '#292524',
  },
  {
    name: 'Quizbit',
    meta: 'Dark -- Earth + Bronze',
    bg: '#12100c',
    bar: '#1e1a14',
    btn: '#c9956d',
    btnText: '#12100c',
    swatch: '#c9956d',
    text: '#f5f1ed',
    muted: '#a89e94',
    border: '#302a22',
    input: '#1e1a14',
  },
  {
    name: 'Aldricpace',
    meta: 'Light -- White + Navy',
    bg: '#fafbfc',
    bar: '#d1d5de',
    btn: '#2b4c7e',
    btnText: '#fafbfc',
    swatch: '#2b4c7e',
    text: '#1b2033',
    muted: '#555e73',
    border: '#d1d5de',
    input: '#f2f4f7',
  },
  {
    name: 'Briarcove',
    meta: 'Light -- White + Violet',
    bg: '#ffffff',
    bar: '#d8d0e5',
    btn: '#6d42c4',
    btnText: '#ffffff',
    swatch: '#6d42c4',
    text: '#1a1428',
    muted: '#6a5a80',
    border: '#d8d0e5',
    input: '#f5f2fa',
  },
  {
    name: 'Briarcove Lib',
    meta: 'Light -- Vellum + Sienna',
    bg: '#faf8f4',
    bar: '#d0c8ba',
    btn: '#a5562e',
    btnText: '#faf8f4',
    swatch: '#a5562e',
    text: '#2a2018',
    muted: '#8a7a6a',
    border: '#d8d0c4',
    input: '#f2efe8',
  },
  {
    name: 'Compass',
    meta: 'Light -- Mint + Green',
    bg: '#f8fdf6',
    bar: '#c0d8c0',
    btn: '#2d7a3e',
    btnText: '#f8fdf6',
    swatch: '#2d7a3e',
    text: '#1a2a1a',
    muted: '#4a6a4a',
    border: '#c0d8c0',
    input: '#f0f5ee',
  },
  {
    name: 'KBCV',
    meta: 'Light -- Parchment + Red',
    bg: '#f7f3ee',
    bar: '#cbc4ba',
    btn: '#b83232',
    btnText: '#fffdf8',
    swatch: '#b83232',
    text: '#2a2521',
    muted: '#706459',
    border: '#cbc4ba',
    input: '#edeae4',
  },
  {
    name: 'Marenlys',
    meta: 'Light -- White + Magenta',
    bg: '#fafafa',
    bar: '#e5d5e0',
    btn: '#c43a8a',
    btnText: '#ffffff',
    swatch: '#c43a8a',
    text: '#1a0a18',
    muted: '#8a6a80',
    border: '#e5d5e0',
    input: '#faf5f8',
  },
  {
    name: 'Saltsignal',
    meta: 'Light -- Cream + Amber',
    bg: '#faf6ee',
    bar: '#d8ccb0',
    btn: '#b8860b',
    btnText: '#fffcf4',
    swatch: '#b8860b',
    text: '#2a2210',
    muted: '#7a6a4a',
    border: '#d8ccb0',
    input: '#fffcf4',
  },
  {
    name: 'Tidemark',
    meta: 'Light -- Linen + Cyan',
    bg: '#faf7f2',
    bar: '#d4c9b8',
    btn: '#1a7a7a',
    btnText: '#fffdf8',
    swatch: '#1a7a7a',
    text: '#2c2420',
    muted: '#6a8888',
    border: '#d4c9b8',
    input: '#fffdf8',
  },
]

const activeTheme = ref(themes[0]!)
</script>

<template>
  <div class="mx-auto my-0 h-px max-w-[1200px] bg-border-subtle" />

  <section id="themes" class="reveal px-6 py-24" aria-labelledby="themes-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Themes</div>
        <h2
          id="themes-title"
          class="mb-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          18 curated themes. One import to swap.
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          Each theme is a single CSS bundle. No JavaScript. No config. Change one import and every
          component re-skins instantly. Click a theme to preview.
        </p>
      </div>

      <!-- Live preview panel -->
      <div
        class="mx-auto mb-10 max-w-[720px] overflow-hidden rounded-xl border transition-colors duration-300"
        :style="{
          background: activeTheme.bg,
          borderColor: activeTheme.border,
        }"
      >
        <div
          class="flex items-center gap-2 border-b px-4 py-3 font-mono text-xs transition-colors duration-300"
          :style="{ borderColor: activeTheme.border, color: activeTheme.muted }"
        >
          <span class="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <span class="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
          <span class="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span class="ml-2">{{ activeTheme.name }}</span>
        </div>
        <div class="flex flex-col gap-4 p-6">
          <div class="flex items-center gap-3">
            <div
              class="rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300"
              :style="{ background: activeTheme.btn, color: activeTheme.btnText }"
            >
              Primary
            </div>
            <div
              class="rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300"
              :style="{ borderColor: activeTheme.border, color: activeTheme.text }"
            >
              Secondary
            </div>
            <div
              class="rounded-md px-4 py-2 text-sm transition-colors duration-300"
              :style="{ color: activeTheme.muted }"
            >
              Ghost
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div
              class="flex-1 rounded-md border px-3 py-2 text-sm transition-colors duration-300"
              :style="{
                background: activeTheme.input,
                borderColor: activeTheme.border,
                color: activeTheme.muted,
              }"
            >
              Search components...
            </div>
            <div
              class="flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-300"
              :style="{ background: activeTheme.btn }"
            >
              <div
                class="h-4 w-4 translate-x-4 rounded-full transition-colors duration-300"
                :style="{ background: activeTheme.btnText }"
              />
            </div>
          </div>
          <div class="flex gap-3">
            <div
              v-for="n in 3"
              :key="n"
              class="flex-1 rounded-md border p-3 transition-colors duration-300"
              :style="{ borderColor: activeTheme.border }"
            >
              <div
                class="mb-2 h-2 w-3/4 rounded-sm transition-colors duration-300"
                :style="{ background: activeTheme.bar }"
              />
              <div
                class="h-2 w-1/2 rounded-sm transition-colors duration-300"
                :style="{ background: activeTheme.bar }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Theme grid -->
      <div
        class="stagger-children mx-auto grid max-w-[960px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <button
          v-for="theme in themes"
          :key="theme.name"
          class="overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_#00000040]"
          :class="
            activeTheme.name === theme.name
              ? 'border-primary ring-1 ring-primary'
              : 'border-border-subtle hover:border-border'
          "
          @click="activeTheme = theme"
        >
          <div class="flex h-40 flex-col justify-end p-4" :style="{ background: theme.bg }">
            <div class="flex flex-col gap-1.5">
              <div class="h-1.5 w-4/5 rounded-sm opacity-60" :style="{ background: theme.bar }" />
              <div class="h-1.5 w-3/5 rounded-sm opacity-60" :style="{ background: theme.bar }" />
              <div class="h-1.5 w-2/5 rounded-sm opacity-60" :style="{ background: theme.bar }" />
            </div>
            <div
              class="mt-2 w-fit rounded px-3 py-1 text-[11px] font-semibold tracking-wide"
              :style="{ background: theme.btn, color: theme.btnText }"
            >
              Button
            </div>
          </div>
          <div class="bg-bg-elevated p-4">
            <h4 class="text-sm font-semibold">{{ theme.name }}</h4>
            <div class="flex items-center gap-2 text-xs text-text-dim">
              <span
                class="inline-block h-2.5 w-2.5 rounded-full border border-white/10"
                :style="{ background: theme.swatch }"
              />
              {{ theme.meta }}
            </div>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
