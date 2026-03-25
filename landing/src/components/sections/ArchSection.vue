<script setup lang="ts">
const rigTags = [
  'Headless',
  'TypeScript strict',
  'Slot-driven',
  'WCAG AAA',
  'Tree-shakeable',
  'ESM + CJS',
]
const hexTags = [
  'CSS-only',
  '18 themes',
  'Tailwind v4',
  'Custom properties',
  '22 token groups',
  'Domain accents',
]
</script>

<template>
  <div class="mx-auto my-0 h-px max-w-[1200px] bg-border-subtle" />

  <section class="reveal px-6 py-24" aria-labelledby="arch-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Architecture
        </div>
        <h2
          id="arch-title"
          class="mb-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          Two packages. Zero compromise.
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          Separate the structure from the skin. Rig handles behavior and accessibility. Hex handles
          aesthetics. Swap, extend, or replace either independently.
        </p>
      </div>

      <div class="stagger-children grid gap-6 md:grid-cols-2">
        <div
          class="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated p-10"
        >
          <div
            class="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-primary to-transparent"
          />
          <h3 class="mb-2 text-[22px] font-bold tracking-tight">
            Rig
            <span class="ml-2 font-mono text-sm font-medium text-text-dim"
              >@amulet-laboratories/rig</span
            >
          </h3>
          <p class="mb-6 text-[15px] leading-relaxed text-text-muted">
            Headless, accessible Vue 3 components. Semantic HTML with
            <code class="font-mono text-[13px] text-primary">data-rig-*</code> attributes. Zero
            styling opinions. Full keyboard nav and ARIA built in.
          </p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in rigTags"
              :key="tag"
              class="rounded-full border border-border bg-bg-surface px-2.5 py-1 text-xs font-medium text-text-muted"
            >
              {{ tag }}
            </span>
          </div>
          <pre
            class="mt-4 rounded-lg bg-bg/50 p-3 font-mono text-[12px] text-text-dim"
          ><code><span class="text-primary">import</span> { Button, Modal } <span class="text-primary">from</span> <span class="text-text-muted">'@amulet-laboratories/rig'</span></code></pre>
        </div>

        <div
          class="relative overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated p-10"
        >
          <div
            class="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-accent-blue to-transparent"
          />
          <h3 class="mb-2 text-[22px] font-bold tracking-tight">
            Hex
            <span class="ml-2 font-mono text-sm font-medium text-text-dim"
              >@amulet-laboratories/hex</span
            >
          </h3>
          <p class="mb-6 text-[15px] leading-relaxed text-text-muted">
            Pure CSS theme layer. 16 curated themes targeting Rig's data attributes. Hot-swap by
            changing one import. Zero JavaScript. Built on Tailwind v4 and CSS custom properties.
          </p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in hexTags"
              :key="tag"
              class="rounded-full border border-border bg-bg-surface px-2.5 py-1 text-xs font-medium text-text-muted"
            >
              {{ tag }}
            </span>
          </div>
          <pre
            class="mt-4 rounded-lg bg-bg/50 p-3 font-mono text-[12px] text-text-dim"
          ><code><span class="text-primary">@import</span> <span class="text-text-muted">'@amulet-laboratories/hex/vscode'</span></code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
