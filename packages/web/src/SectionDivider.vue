<script setup lang="ts">
/**
 * SectionDivider — organic SVG curve between page sections.
 *
 * Provides a decorative visual transition between differently-colored
 * sections. Colors controlled via CSS custom properties:
 *   --section-divider-fill  fill color (matches section below)
 *   --section-divider-bg    background (matches section above)
 *
 * Variants:
 *   organic  — hand-drawn irregular curve (default)
 *   wave     — smooth sinusoidal wave
 *   angular  — geometric zigzag
 *
 * Slots:
 *   #default — custom SVG path content (overrides built-in variants)
 */
defineProps<{
  /** SVG path variant. */
  variant?: 'organic' | 'wave' | 'angular'
  /** Flip the curve vertically (concave instead of convex). */
  flip?: boolean
}>()

const paths = {
  organic:
    'M0,80 L0,38 C180,18 340,8 520,26 C700,44 860,52 1020,32 C1180,12 1340,22 1440,34 L1440,80 Z',
  wave: 'M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z',
  angular: 'M0,80 L0,50 L240,20 L480,55 L720,15 L960,50 L1200,25 L1440,45 L1440,80 Z',
}
</script>

<template>
  <div
    data-rig-section-divider
    :data-variant="variant ?? 'organic'"
    :data-flip="flip || undefined"
    aria-hidden="true"
  >
    <svg data-rig-section-divider-svg viewBox="0 0 1440 80" preserveAspectRatio="none">
      <slot>
        <path data-rig-section-divider-path :d="paths[variant ?? 'organic']" />
      </slot>
    </svg>
  </div>
</template>
