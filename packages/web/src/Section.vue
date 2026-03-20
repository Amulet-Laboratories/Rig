<script setup lang="ts">
/**
 * Section — content section wrapper for marketing sites.
 *
 * Provides consistent padding, max-width containment, and optional
 * header. Use `title` / `subtitle` props for the common case, or the
 * `#header` slot for full control.
 *
 * When `decorated` is true (or when `title` is provided without an
 * explicit `decorated: false`), an accent bar renders beneath the title.
 *
 * Slots:
 *   #header  — full override for the header area (replaces title/subtitle)
 *   #default — section body content
 */
defineProps<{
  /** Visual variant: default (transparent), alternate (card bg), bordered (card bg + border-y). */
  variant?: 'default' | 'alternate' | 'bordered'
  /** Section heading text. Renders an h2 automatically. */
  title?: string
  /** Optional subtitle beneath the heading. */
  subtitle?: string
  /** Show a decorative accent bar beneath the title. Defaults to true when title is set. */
  decorated?: boolean
  /** Center-align the header. Defaults to true. */
  centered?: boolean
}>()
</script>

<template>
  <section data-rig-section :data-variant="variant ?? 'default'">
    <div data-rig-section-container>
      <div
        v-if="$slots.header || title"
        data-rig-section-header
        :data-centered="centered !== false || undefined"
      >
        <slot name="header">
          <h2 data-rig-section-title>{{ title }}</h2>
          <span v-if="decorated !== false" data-rig-section-accent aria-hidden="true" />
          <p v-if="subtitle" data-rig-section-subtitle>{{ subtitle }}</p>
        </slot>
      </div>

      <slot />
    </div>
  </section>
</template>
