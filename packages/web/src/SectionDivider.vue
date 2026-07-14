<script setup lang="ts">
import { computed } from 'vue'
/**
 * SectionDivider — organic SVG curve between page sections.
 *
 * Provides a decorative visual transition between differently-colored
 * sections. Colors are set via the `fill` / `bg` props (which drive the
 * --section-divider-fill / --section-divider-bg custom properties), so
 * consumers never need an inline `style`.
 *
 * Variants:
 *   organic  — hand-drawn irregular curve (default)
 *   wave     — smooth sinusoidal wave
 *   angular  — geometric zigzag
 *
 * Slots:
 *   #default — custom SVG path content (overrides built-in variants)
 */
const props = defineProps<{
  /** SVG path variant. */
  variant?: 'organic' | 'wave' | 'angular'
  /** Flip the curve vertically (concave instead of convex). */
  flip?: boolean
  /** Fill color of the curve — matches the section below (any CSS color). */
  fill?: string
  /** Background above the curve — matches the section above (any CSS color). */
  bg?: string
}>()

const paths = {
  organic:
    'M0,80 L0,38 C180,18 340,8 520,26 C700,44 860,52 1020,32 C1180,12 1340,22 1440,34 L1440,80 Z',
  wave: 'M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z',
  angular: 'M0,80 L0,50 L240,20 L480,55 L720,15 L960,50 L1200,25 L1440,45 L1440,80 Z',
}

const dividerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.fill) style['--section-divider-fill'] = props.fill
  if (props.bg) style['--section-divider-bg'] = props.bg
  return Object.keys(style).length ? style : undefined
})
</script>

<template>
  <div
    data-rig-section-divider
    :data-variant="variant ?? 'organic'"
    :data-flip="flip || undefined"
    :style="dividerStyle"
    aria-hidden="true"
  >
    <svg data-rig-section-divider-svg viewBox="0 0 1440 80" preserveAspectRatio="none">
      <slot>
        <path data-rig-section-divider-path :d="paths[variant ?? 'organic']" />
      </slot>
    </svg>
  </div>
</template>
