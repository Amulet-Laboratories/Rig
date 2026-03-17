<script setup lang="ts">
const diffs = [
  {
    vs: 'vs Vuetify',
    title: 'No opinion lock-in',
    desc: 'Vuetify bundles styling into the component runtime. Rig ships zero CSS. You own the visual layer entirely -- use Hex, Tailwind, or raw CSS.',
  },
  {
    vs: 'vs shadcn/ui',
    title: 'A real library, not copy-paste',
    desc: 'shadcn copies source files into your project. Rig is an installable, versioned package with 117 components. Updates come from npm, not re-generating files.',
  },
  {
    vs: 'vs Radix Vue',
    title: 'Vue-native. Not a port.',
    desc: 'Radix Vue ports React patterns to Vue. Rig is designed for Vue from the ground up -- defineSlots, v-model, provide/inject.',
  },
]
</script>

<template>
  <div class="mx-auto my-0 h-px max-w-[1200px] bg-border-subtle" />

  <section class="reveal px-6 py-24" aria-labelledby="diff-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Positioning
        </div>
        <h2
          id="diff-title"
          class="mb-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          Built for a different tradeoff.
        </h2>
      </div>

      <div class="stagger-children grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="diff in diffs"
          :key="diff.vs"
          class="rounded-xl border border-border-subtle bg-bg-elevated p-8"
        >
          <span
            class="mb-3 inline-block rounded-full bg-primary-dim px-2 py-0.5 text-[11px] font-semibold text-primary"
          >
            {{ diff.vs }}
          </span>
          <h4 class="mb-1 text-base font-semibold">{{ diff.title }}</h4>
          <p class="text-sm leading-relaxed text-text-muted">{{ diff.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
