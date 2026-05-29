<script setup lang="ts">
/**
 * FlankedHeading — heading with decorative flanking elements.
 *
 * On desktop (sm+): ornamental SVG flourishes flank the heading.
 * On mobile: simple horizontal rules replace the SVGs.
 * Hex CSS controls the responsive switching.
 *
 * Slots:
 *   #default        — heading content (typically an <h2>)
 *   #ornament-left  — custom left ornament (overrides default flourish)
 *   #ornament-right — custom right ornament (overrides default flourish)
 */
const flourishPath =
  'M57.3,13.1c-3.2,10.4,10.4,16.1,16.8,8.7c7.1-8.2,0.6-17.8-7-20.1c-19.6-5.2-31.9,18-49,23.1C9.3,27.5-1.7,20.4,1.6,9.8c3.8-12.4,23.3-9,19.3,4'
</script>

<template>
  <div data-rig-flanked-heading>
    <span data-rig-flanked-heading-ornament data-side="left" aria-hidden="true">
      <slot name="ornament-left">
        <svg
          viewBox="0 0 78.2 26.4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-rig-flanked-heading-svg
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            :d="flourishPath"
            pathLength="1"
          />
        </svg>
      </slot>
    </span>

    <span data-rig-flanked-heading-rule data-side="left" aria-hidden="true" />

    <slot />

    <span data-rig-flanked-heading-rule data-side="right" aria-hidden="true" />

    <span data-rig-flanked-heading-ornament data-side="right" aria-hidden="true">
      <slot name="ornament-right">
        <svg
          viewBox="0 0 78.2 26.4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-rig-flanked-heading-svg
          style="transform: scaleX(-1)"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            :d="flourishPath"
            pathLength="1"
          />
        </svg>
      </slot>
    </span>
  </div>
</template>
