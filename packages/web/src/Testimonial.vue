<script setup lang="ts">
/**
 * Testimonial — quote block with attribution for marketing sites.
 *
 * Two visual layouts controlled by Hex CSS:
 *   card   — designed for grid placement inside a Card or standalone
 *   border — left-border accent style for stacked lists
 *
 * Slots:
 *   #decorator   — quote icon, opening character, or decorative element
 *   #quote       — the quote text
 *   #divider     — separator between quote and attribution (e.g. Divider)
 *   #attribution — name + detail / context
 */
defineProps<{
  /** Visual layout variant. */
  layout?: 'card' | 'border'
}>()
</script>

<template>
  <blockquote data-rig-testimonial :data-layout="layout ?? 'card'">
    <div v-if="$slots.decorator" data-rig-testimonial-decorator>
      <slot name="decorator" />
    </div>

    <div data-rig-testimonial-quote>
      <slot name="quote" />
    </div>

    <div v-if="$slots.divider" data-rig-testimonial-divider>
      <slot name="divider" />
    </div>

    <footer data-rig-testimonial-attribution>
      <slot name="attribution" />
    </footer>
  </blockquote>
</template>
