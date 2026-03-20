<script setup lang="ts">
/**
 * CTABanner — call-to-action section for marketing sites.
 *
 * Two layout variants:
 *   row      — text left, button right (column→row at sm)
 *   centered — everything stacked and centered
 *
 * Slots:
 *   #icon    — decorative element above content (centered only)
 *   #default — headline + description text
 *   #action  — CTA button or link
 */
defineProps<{
  /** Layout variant. */
  layout?: 'row' | 'centered'
}>()
</script>

<template>
  <section data-rig-cta-banner :data-layout="layout ?? 'row'">
    <div data-rig-cta-banner-container>
      <div v-if="$slots.icon" data-rig-cta-banner-icon>
        <slot name="icon" />
      </div>

      <div data-rig-cta-banner-content>
        <slot />
      </div>

      <div v-if="$slots.action" data-rig-cta-banner-action>
        <slot name="action" />
      </div>
    </div>
  </section>
</template>
