<script setup lang="ts">
import { ref } from 'vue'

const copied = ref(false)

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(
      'pnpm add @amulet-laboratories/rig @amulet-laboratories/hex',
    )
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* clipboard requires HTTPS */
  }
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header class="relative px-6 pt-40 pb-24 text-center">
    <!-- Glow -->
    <div
      class="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2"
      style="
        background: radial-gradient(
          ellipse at center,
          var(--color-primary-glow) 0%,
          transparent 70%
        );
      "
      aria-hidden="true"
    />

    <div
      class="fade-in mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface px-3.5 py-1.5 text-[13px] text-text-muted"
    >
      <span
        class="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
        aria-hidden="true"
      />
      <span>v0.2.0 -- 117 components across 11 packages</span>
    </div>

    <h1
      class="fade-in delay-1 relative mb-5 text-[clamp(40px,6vw,72px)] font-bold leading-[1.05] tracking-tighter"
    >
      <span class="text-text">Rig</span>
      <span class="font-normal text-text-dim"> + </span>
      <span class="text-primary">Hex</span>
    </h1>

    <p
      class="fade-in delay-2 mx-auto mb-10 max-w-[560px] text-[clamp(16px,2.2vw,20px)] leading-relaxed text-text-muted"
    >
      Headless Vue 3 components. Curated CSS themes. One system.
    </p>

    <div class="fade-in delay-3 mb-12 flex flex-wrap items-center justify-center gap-3">
      <button
        class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[15px] font-medium text-bg transition hover:-translate-y-px hover:bg-[#7ec4be] hover:shadow-[0_4px_20px_var(--color-primary-dim)]"
        @click="scrollTo('get-started')"
      >
        Get Started
      </button>
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-6 py-3 text-[15px] font-medium text-text transition hover:-translate-y-px hover:border-text-dim hover:bg-bg-surface-hover"
        @click="scrollTo('packages')"
      >
        Browse Components
      </button>
    </div>

    <div class="fade-in delay-4 flex justify-center">
      <button
        class="inline-flex items-center gap-3 rounded-lg border border-border bg-bg-surface px-[18px] py-2.5 font-mono text-sm text-text-muted transition hover:border-primary hover:bg-bg-surface-hover"
        @click="copyInstall"
      >
        <span
          ><span class="text-primary">$</span> pnpm add @amulet-laboratories/rig
          @amulet-laboratories/hex</span
        >
        <span class="font-sans text-[11px] text-text-dim">{{
          copied ? 'copied' : 'click to copy'
        }}</span>
      </button>
    </div>

    <!-- Stats -->
    <div
      class="fade-in delay-4 mx-auto mt-16 grid max-w-[720px] grid-cols-2 gap-px overflow-hidden rounded-xl bg-border-subtle sm:grid-cols-4"
    >
      <div
        v-for="stat in [
          { value: '117', label: 'Components' },
          { value: '11', label: 'Packages' },
          { value: '2', label: 'Themes' },
          { value: '18', label: 'Composables' },
        ]"
        :key="stat.label"
        class="bg-bg-elevated px-5 py-7 text-center"
      >
        <div class="text-[32px] font-bold leading-none tracking-tight tabular-nums text-text">
          {{ stat.value }}
        </div>
        <div class="mt-1.5 text-[13px] font-medium text-text-muted">{{ stat.label }}</div>
      </div>
    </div>
  </header>
</template>
