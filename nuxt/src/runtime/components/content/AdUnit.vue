<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#imports'

interface Props {
  /** AdSense ad unit slot ID — the numeric ID from the dashboard, e.g. '1234567890' */
  slot: string
  /** Ad format — 'auto' adapts to container (default) */
  format?: 'auto' | 'horizontal' | 'vertical'
  /** Enable responsive sizing (default: true) */
  responsive?: boolean
  /** Layout hint for native ads */
  layout?: string
}

const props = withDefaults(defineProps<Props>(), {
  format: 'auto',
  responsive: true,
})

const config = useRuntimeConfig()
const adClientId = computed(() => config.public.adsenseClientId as string | undefined)

// The AdSense loader script is injected globally by the `adsense.client`
// plugin, because Auto Ads needs it on every page — not only on pages that
// happen to render an <AdUnit>.

// AdSense slots are numeric IDs. A non-numeric value (e.g. an 'in-article'
// placeholder) can never fill, so rendering it would reserve an empty box on
// every article. Skip it and let Auto Ads place the unit instead.
const hasRealSlot = computed(() => /^\d+$/.test(props.slot ?? ''))
const shouldRender = computed(() => Boolean(adClientId.value) && hasRealSlot.value)

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

onMounted(() => {
  if (!shouldRender.value) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // AdSense blocked by ad blocker or not loaded — fail silently
  }
})
</script>

<template>
  <aside
    v-if="shouldRender"
    data-rig-ad-unit
    aria-label="Advertisement"
    :style="{ minHeight: '100px' }"
  >
    <ins
      class="adsbygoogle"
      :style="{ display: 'block', minHeight: 'inherit' }"
      :data-ad-client="adClientId"
      :data-ad-slot="slot"
      :data-ad-format="format"
      :data-ad-layout="layout || undefined"
      :data-full-width-responsive="responsive ? 'true' : undefined"
    />
  </aside>
</template>
