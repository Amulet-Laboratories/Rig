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
    bg: '#372d3b',
    bar: '#4f3043',
    btn: '#d94362',
    btnText: '#ffffde',
    swatch: '#d94362',
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
          Two curated themes. One import to swap.
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          Each theme is a single CSS bundle. No JavaScript. No config. Change one import and every
          component re-skins instantly.
        </p>
      </div>

      <div class="stagger-children mx-auto grid max-w-[720px] grid-cols-1 gap-4 sm:grid-cols-2">
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
