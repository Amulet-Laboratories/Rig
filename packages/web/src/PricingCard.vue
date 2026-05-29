<script setup lang="ts">
/**
 * PricingCard — headless pricing tier card for marketing sites.
 *
 * Renders a self-contained pricing card with structured slots for
 * each section. Visual styling comes from Hex via [data-rig-pricing-card]
 * selectors.
 *
 * Slots:
 *   #badge    — optional "Most popular" or "Best value" badge
 *   #title    — tier name (e.g. "Starter", "Pro")
 *   #price    — price display area
 *   #period   — billing period ("/ month", "/ year")
 *   #description — short tier description
 *   #features — feature list (typically a <ul>)
 *   #cta      — call-to-action button
 *   #footer   — optional footer content (guarantees, notes)
 */
defineProps<{
  /** Highlight this card as the featured/recommended tier. */
  featured?: boolean
}>()
</script>

<template>
  <article data-rig-pricing-card :data-featured="featured || undefined">
    <div v-if="$slots.badge" data-rig-pricing-card-badge>
      <slot name="badge" />
    </div>

    <div data-rig-pricing-card-header>
      <div data-rig-pricing-card-title>
        <slot name="title" />
      </div>

      <div data-rig-pricing-card-price>
        <slot name="price" />
        <span v-if="$slots.period" data-rig-pricing-card-period>
          <slot name="period" />
        </span>
      </div>

      <div v-if="$slots.description" data-rig-pricing-card-description>
        <slot name="description" />
      </div>
    </div>

    <div v-if="$slots.features" data-rig-pricing-card-features>
      <slot name="features" />
    </div>

    <div v-if="$slots.cta" data-rig-pricing-card-cta>
      <slot name="cta" />
    </div>

    <div v-if="$slots.footer" data-rig-pricing-card-footer>
      <slot name="footer" />
    </div>
  </article>
</template>
