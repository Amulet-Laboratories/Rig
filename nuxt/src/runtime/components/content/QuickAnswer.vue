<script setup lang="ts">
// TL;DR callout for the top of an article. Give search + AI answer engines a
// clean, extractable summary to lift into a featured snippet or a cited answer
// (which is increasingly where purchase research starts).
//
// Visual treatment lives entirely in Hex (`data-rig-callout*`) + Rig's
// structural styles — no per-site CSS. This replaces the hand-rolled
// `components/content/QuickAnswer.vue` that shipped a `<style scoped>` block to
// compensate for Hex not styling the callout.
//
// Usage in markdown (MDC):
//   ::quick-answer
//   A one- or two-sentence summary of the article's key takeaway that a reader
//   (or an AI answer engine) can lift without scrolling.
//   ::
withDefaults(
  defineProps<{
    /** Optional heading override; defaults to "Quick answer". */
    title?: string
    /** Callout tone — mapped to a status color in Hex. */
    tone?: 'info' | 'success' | 'warning' | 'danger'
  }>(),
  {
    tone: 'info',
  },
)
</script>

<template>
  <aside data-rig-callout :data-tone="tone">
    <p data-rig-callout-label>{{ title || 'Quick answer' }}</p>
    <div data-rig-callout-body>
      <slot />
    </div>
  </aside>
</template>
