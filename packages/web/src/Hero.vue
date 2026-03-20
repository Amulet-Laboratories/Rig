<script setup lang="ts">
/**
 * Hero — full-width hero section for marketing sites.
 *
 * Three layout variants:
 *   split     — text on left, media on right (2-column at sm+)
 *   centered  — all content centered, no media column
 *   immersive — full-bleed media background with content overlay
 *
 * Slots:
 *   #eyebrow    — badge, icon, or eyebrow text above title
 *   #title      — main heading
 *   #description — supporting text
 *   #actions    — CTA buttons
 *   #media      — right column (split) or background (immersive)
 *   #overlay    — content that overlaps below hero (e.g. search card)
 */
defineProps<{
  /** Layout variant. */
  layout?: 'split' | 'centered' | 'immersive'
}>()
</script>

<template>
  <section data-rig-hero :data-layout="layout ?? 'split'">
    <div data-rig-hero-content>
      <div v-if="$slots.eyebrow" data-rig-hero-eyebrow>
        <slot name="eyebrow" />
      </div>

      <div data-rig-hero-title>
        <slot name="title" />
      </div>

      <div v-if="$slots.description" data-rig-hero-description>
        <slot name="description" />
      </div>

      <div v-if="$slots.actions" data-rig-hero-actions>
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.media" data-rig-hero-media>
      <slot name="media" />
    </div>

    <div v-if="$slots.overlay" data-rig-hero-overlay>
      <slot name="overlay" />
    </div>
  </section>
</template>
