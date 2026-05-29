<script setup lang="ts">
/**
 * SiteShell — page-level wrapper for marketing sites.
 *
 * Provides skip-to-content link, header (nav), main content area, and footer.
 * All visual styling comes from Hex via [data-rig-site-shell] selectors.
 */
defineProps<{
  /** ID for the main content landmark (skip-link target). */
  mainId?: string
}>()
</script>

<template>
  <div data-rig-site-shell>
    <a :href="`#${mainId ?? 'main-content'}`" data-rig-skip-link>
      <slot name="skip-link">Skip to main content</slot>
    </a>

    <header data-rig-site-shell-header>
      <slot name="header" />
    </header>

    <main :id="mainId ?? 'main-content'" data-rig-site-shell-main>
      <slot />
    </main>

    <slot name="footer" />
  </div>
</template>
