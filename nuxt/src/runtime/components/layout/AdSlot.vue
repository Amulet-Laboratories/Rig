<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig, useHead } from '#imports'

interface Props {
  /** Ad unit slot ID from AdSense */
  slot: string
  /** Ad format — 'auto' adapts to container, 'horizontal' and 'vertical' are fixed axis */
  format?: 'auto' | 'horizontal' | 'vertical'
  /** Enable responsive sizing (default: true) */
  responsive?: boolean
  /** Layout hint for native ads */
  layout?: string
  /** Location label for analytics/debugging */
  location?: 'sidebar-top' | 'sidebar-bottom' | 'in-content' | 'header' | 'footer'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'auto',
  responsive: true,
  location: 'in-content',
})

const config = useRuntimeConfig()
const adClientId = computed(() => config.public.adsenseClientId as string | undefined)
const adReady = ref(false)

// Conditionally add the AdSense script to <head> when a client ID is configured
if (adClientId.value) {
  useHead({
    script: [
      {
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId.value}`,
        async: true,
        crossorigin: 'anonymous',
        key: 'adsense',
      },
    ],
  })
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

onMounted(() => {
  if (!adClientId.value) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    adReady.value = true
  } catch {
    // AdSense blocked by ad blocker or not loaded — fail silently
  }
})
</script>

<template>
  <div
    v-if="adClientId"
    data-rig-ad-slot
    :data-ad-location="location"
    :style="{
      minHeight: format === 'horizontal' ? '90px' : format === 'vertical' ? '250px' : '100px',
    }"
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
  </div>
</template>
