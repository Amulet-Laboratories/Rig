<script setup lang="ts">
/**
 * SiteFooter — multi-column site footer for marketing sites.
 *
 * Provides a responsive grid (1→N columns at sm) with optional
 * pre-footer (accent stripe, emergency banner) and post-footer
 * (copyright bar) areas.
 *
 * Slots:
 *   #pre-footer  — content above the footer grid (accent stripe, alert)
 *   #default     — footer columns (use plain divs for each column)
 *   #post-footer — content below the footer grid (copyright bar)
 */
defineProps<{
  /** Number of grid columns at sm+ breakpoint. */
  columns?: number
  /** Color variant: default (primary bg), card (card bg), inverted (foreground bg). */
  variant?: 'default' | 'card' | 'inverted'
}>()
</script>

<template>
  <footer data-rig-site-footer :data-columns="columns ?? 3" :data-variant="variant ?? 'default'">
    <div v-if="$slots['pre-footer']" data-rig-site-footer-pre>
      <slot name="pre-footer" />
    </div>

    <div data-rig-site-footer-container>
      <div data-rig-site-footer-grid>
        <slot />
      </div>
    </div>

    <div v-if="$slots['social']" data-rig-site-footer-social>
      <slot name="social" />
    </div>

    <div v-if="$slots['post-footer']" data-rig-site-footer-post>
      <slot name="post-footer" />
    </div>
  </footer>
</template>
