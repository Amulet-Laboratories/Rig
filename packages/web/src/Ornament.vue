<script setup lang="ts">
/**
 * Ornament — standalone decorative SVG element.
 *
 * Multiple built-in variants provide different ornamental shapes.
 * Use the default slot to provide a completely custom SVG.
 *
 * Styled via Hex CSS on [data-rig-ornament].
 * Typically used with .scroll-draw and .ornament-float utility classes.
 *
 * Variants:
 *   flourish — looping calligraphic stroke (default)
 *   rule     — simple horizontal line
 *   diamond  — small diamond shape
 *   dots     — three dots in a row
 */
defineProps<{
  /** Ornament shape variant. */
  variant?: 'flourish' | 'rule' | 'diamond' | 'dots'
  /** Size multiplier. */
  size?: 'sm' | 'md' | 'lg'
}>()

const sizes = {
  sm: { width: 48, height: 16 },
  md: { width: 78, height: 26 },
  lg: { width: 110, height: 36 },
}
</script>

<template>
  <div
    data-rig-ornament
    :data-variant="variant ?? 'flourish'"
    :data-size="size ?? 'md'"
    aria-hidden="true"
  >
    <slot>
      <svg
        v-if="(variant ?? 'flourish') === 'flourish'"
        data-rig-ornament-svg
        viewBox="0 0 78.2 26.4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :width="sizes[size ?? 'md'].width"
        :height="sizes[size ?? 'md'].height"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          d="M57.3,13.1c-3.2,10.4,10.4,16.1,16.8,8.7c7.1-8.2,0.6-17.8-7-20.1c-19.6-5.2-31.9,18-49,23.1C9.3,27.5-1.7,20.4,1.6,9.8c3.8-12.4,23.3-9,19.3,4"
          pathLength="1"
        />
      </svg>

      <svg
        v-else-if="variant === 'rule'"
        data-rig-ornament-svg
        :width="sizes[size ?? 'md'].width"
        height="2"
        viewBox="0 0 78 2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          y1="1"
          x2="78"
          y2="1"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          pathLength="1"
        />
      </svg>

      <svg
        v-else-if="variant === 'diamond'"
        data-rig-ornament-svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="currentColor" />
      </svg>

      <svg
        v-else-if="variant === 'dots'"
        data-rig-ornament-svg
        width="32"
        height="6"
        viewBox="0 0 32 6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="3" cy="3" r="2" fill="currentColor" />
        <circle cx="16" cy="3" r="2" fill="currentColor" />
        <circle cx="29" cy="3" r="2" fill="currentColor" />
      </svg>
    </slot>
  </div>
</template>
