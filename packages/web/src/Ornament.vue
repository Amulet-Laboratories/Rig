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
 *   steam    — three rising curls (coffee/roastery)
 *   marquee  — chevron-rule-chevron (broadcast/radio)
 *   cobble   — flagstone bullets (rural retail)
 *   monogram — square mark with crossed strokes (brewery)
 */
defineProps<{
  /** Ornament shape variant. */
  variant?: 'flourish' | 'rule' | 'diamond' | 'dots' | 'steam' | 'marquee' | 'cobble' | 'monogram'
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

      <svg
        v-else-if="variant === 'steam'"
        data-rig-ornament-svg
        :width="sizes[size ?? 'md'].width"
        :height="sizes[size ?? 'md'].height"
        viewBox="0 0 78 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 24 C 20 18, 14 16, 14 10, 14 6, 18 4, 22 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          fill="none"
          pathLength="1"
        />
        <path
          d="M39 24 C 39 16, 33 14, 33 8, 33 3, 39 1, 45 3"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          fill="none"
          pathLength="1"
        />
        <path
          d="M58 24 C 58 18, 52 16, 52 10, 52 6, 56 4, 60 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          fill="none"
          pathLength="1"
        />
      </svg>

      <svg
        v-else-if="variant === 'marquee'"
        data-rig-ornament-svg
        :width="sizes[size ?? 'md'].width"
        height="12"
        viewBox="0 0 78 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 6 L8 1 L14 6 L8 11 Z" fill="currentColor" />
        <line
          x1="18"
          y1="6"
          x2="60"
          y2="6"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
        />
        <path d="M76 6 L70 11 L64 6 L70 1 Z" fill="currentColor" />
      </svg>

      <svg
        v-else-if="variant === 'cobble'"
        data-rig-ornament-svg
        :width="sizes[size ?? 'md'].width"
        height="10"
        viewBox="0 0 78 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="9" cy="5" rx="4" ry="3" fill="currentColor" />
        <ellipse cx="24" cy="5" rx="3" ry="2.5" fill="currentColor" opacity="0.7" />
        <ellipse cx="39" cy="5" rx="5" ry="3" fill="currentColor" />
        <ellipse cx="54" cy="5" rx="3" ry="2.5" fill="currentColor" opacity="0.7" />
        <ellipse cx="69" cy="5" rx="4" ry="3" fill="currentColor" />
      </svg>

      <svg
        v-else-if="variant === 'monogram'"
        data-rig-ornament-svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="18"
          height="18"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
        />
        <line x1="1" y1="1" x2="19" y2="19" stroke="currentColor" stroke-width="1.5" />
        <line x1="19" y1="1" x2="1" y2="19" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </slot>
  </div>
</template>
