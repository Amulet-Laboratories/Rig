<script setup lang="ts">
const themes = [
  {
    name: 'VSCode',
    meta: 'Dark -- Gray + Blue',
    bg: '#1f1f1f',
    bar: '#333333',
    btn: '#0078d4',
    btnText: '#ffffff',
    swatch: '#0078d4',
  },
  {
    name: 'Garden',
    meta: 'Dark -- Purple + Rose',
    bg: '#331f3c',
    bar: '#4f3043',
    btn: '#eb4963',
    btnText: '#ffffde',
    swatch: '#eb4963',
  },
  {
    name: 'Forge',
    meta: 'Dark -- Carbon + Amber',
    bg: '#0e0d0c',
    bar: '#1c1b19',
    btn: '#ffb000',
    btnText: '#0e0d0c',
    swatch: '#ffb000',
  },
  {
    name: 'Duskline',
    meta: 'Dark -- Black + Amber',
    bg: '#0d0f12',
    bar: '#1a1c20',
    btn: '#d4a843',
    btnText: '#0d0f12',
    swatch: '#d4a843',
  },
  {
    name: 'Greyline',
    meta: 'Dark -- Black + Silver',
    bg: '#0c0d0f',
    bar: '#1a1b1e',
    btn: '#8b8d92',
    btnText: '#0c0d0f',
    swatch: '#8b8d92',
  },
  {
    name: 'Lanternhouse',
    meta: 'Dark -- Navy + Copper',
    bg: '#0f1923',
    bar: '#1a2633',
    btn: '#c48b6c',
    btnText: '#0f1923',
    swatch: '#c48b6c',
  },
  {
    name: 'Spacewizard',
    meta: 'Dark -- Navy + Green',
    bg: '#060d2b',
    bar: '#0f1640',
    btn: '#aef66d',
    btnText: '#060d2b',
    swatch: '#aef66d',
  },
  {
    name: 'Undertow',
    meta: 'Dark -- Tar + Orange',
    bg: '#1c1917',
    bar: '#2a2622',
    btn: '#d95f2a',
    btnText: '#1c1917',
    swatch: '#d95f2a',
  },
  {
    name: 'Aldricpace',
    meta: 'Light -- White + Navy',
    bg: '#fafbfc',
    bar: '#e8eaed',
    btn: '#2b4c7e',
    btnText: '#fafbfc',
    swatch: '#2b4c7e',
  },
  {
    name: 'Briarcove',
    meta: 'Light -- White + Blue',
    bg: '#ffffff',
    bar: '#e5e7eb',
    btn: '#1d4ed8',
    btnText: '#ffffff',
    swatch: '#1d4ed8',
  },
  {
    name: 'Briarcove Lib',
    meta: 'Light -- Vellum + Brick',
    bg: '#faf8f4',
    bar: '#ece8e0',
    btn: '#9e4a2f',
    btnText: '#faf8f4',
    swatch: '#9e4a2f',
  },
  {
    name: 'Compass',
    meta: 'Light -- Mint + Teal',
    bg: '#fafdf9',
    bar: '#e6ede4',
    btn: '#2a7d5f',
    btnText: '#fafdf9',
    swatch: '#2a7d5f',
  },
  {
    name: 'KBCV',
    meta: 'Light -- Parchment + Red',
    bg: '#f7f3ee',
    bar: '#e4dfd7',
    btn: '#b83232',
    btnText: '#f7f3ee',
    swatch: '#b83232',
  },
  {
    name: 'Marenlys',
    meta: 'Light -- White + Indigo',
    bg: '#fafafa',
    bar: '#e5e5e5',
    btn: '#4a4a8a',
    btnText: '#fafafa',
    swatch: '#4a4a8a',
  },
  {
    name: 'Saltsignal',
    meta: 'Light -- Cream + Orange',
    bg: '#f5f0e8',
    bar: '#e2dbd0',
    btn: '#c2571a',
    btnText: '#f5f0e8',
    swatch: '#c2571a',
  },
  {
    name: 'Tidemark',
    meta: 'Light -- Linen + Teal',
    bg: '#faf7f2',
    bar: '#e8e4dc',
    btn: '#1a6b5a',
    btnText: '#faf7f2',
    swatch: '#1a6b5a',
  },
]
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
          16 curated themes. One import to swap.
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          Each theme is a single CSS bundle. No JavaScript. No config. Change one import and every
          component re-skins instantly. 8 dark. 8 light.
        </p>
      </div>

      <div
        class="stagger-children mx-auto grid max-w-[960px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="theme in themes"
          :key="theme.name"
          class="overflow-hidden rounded-xl border border-border-subtle transition hover:-translate-y-0.5 hover:border-border hover:shadow-[0_12px_40px_#00000040]"
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
        </div>
      </div>
    </div>
  </section>
</template>
