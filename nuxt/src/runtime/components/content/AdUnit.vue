<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig, useHead } from '#imports'

interface Props {
  /** Ad unit slot ID from AdSense */
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
  <aside
    v-if="adClientId"
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
