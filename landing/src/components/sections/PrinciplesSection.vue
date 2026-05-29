<script setup lang="ts">
const principles = [
  {
    title: 'Accessibility first',
    desc: 'WCAG AAA contrast. Full ARIA attributes. Keyboard navigation on every interactive component. Focus management across modals and overlays.',
  },
  {
    title: 'Separation of concerns',
    desc: 'Components have zero styling opinions. Themes have zero behavioral logic. Either can be replaced without touching the other.',
  },
  {
    title: 'Developer ergonomics',
    desc: 'TypeScript strict. Typed slots. Single entry point. Tree-shakeable. ESM and CJS. Works with Vite, Nuxt, or any bundler.',
  },
  {
    title: 'Minimal surface area',
    desc: 'Two peer dependencies: Vue 3.5+ and Floating UI. One optional dep for icons. No CSS framework required unless you want Hex.',
  },
  {
    title: 'Composition over configuration',
    desc: 'Named slots, not prop soup. Render what you want, where you want. Every visual element is overridable.',
  },
  {
    title: 'No magic',
    desc: 'Components render semantic HTML with data attributes. What you see in DevTools is what you get. No generated class names, no runtime CSS-in-JS.',
  },
]
</script>

<template>
  <div class="mx-auto my-0 h-px max-w-[1200px] bg-border-subtle" />

  <section class="reveal px-6 py-24" aria-labelledby="principles-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Principles
        </div>
        <h2
          id="principles-title"
          class="text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          What we care about.
        </h2>
      </div>

      <div
        class="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border-subtle md:grid-cols-3"
      >
        <div v-for="p in principles" :key="p.title" class="bg-bg-elevated p-8">
          <h4 class="mb-1.5 text-sm font-semibold tracking-tight">{{ p.title }}</h4>
          <p class="text-[13px] leading-relaxed text-text-muted">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
