<script setup lang="ts">
/**
 * Testimonial — quote block with attribution for marketing sites.
 *
 * Two visual layouts controlled by Hex CSS:
 *   card   — designed for grid placement inside a Card or standalone
 *   border — left-border accent style for stacked lists
 *
 * Content can be supplied via slots or via the `quote` / `name` / `role`
 * props (the props render only as a fallback when the matching slot is
 * absent). Declaring these as props also means they are consumed rather
 * than falling through onto the root <blockquote> as stray attributes —
 * notably `role`, which would otherwise set an invalid ARIA role.
 *
 * Slots:
 *   #decorator   — quote icon, opening character, or decorative element
 *   #quote       — the quote text (falls back to the `quote` prop)
 *   #divider     — separator between quote and attribution (e.g. Divider)
 *   #attribution — name + detail / context (falls back to `name` / `role`)
 */
defineProps<{
  /** Visual layout variant. */
  layout?: 'card' | 'border'
  /** Quote text — fallback for the #quote slot. */
  quote?: string
  /** Attribution name — fallback for the #attribution slot. */
  name?: string
  /** Attribution role / title, shown under the name. */
  role?: string
}>()
</script>

<template>
  <blockquote data-rig-testimonial :data-layout="layout ?? 'card'">
    <div v-if="$slots.decorator" data-rig-testimonial-decorator>
      <slot name="decorator" />
    </div>

    <div data-rig-testimonial-quote>
      <slot name="quote">
        <p v-if="quote">{{ quote }}</p>
      </slot>
    </div>

    <div v-if="$slots.divider" data-rig-testimonial-divider>
      <slot name="divider" />
    </div>

    <footer data-rig-testimonial-attribution>
      <slot name="attribution">
        <p v-if="name">{{ name }}</p>
        <p v-if="role">{{ role }}</p>
      </slot>
    </footer>
  </blockquote>
</template>
