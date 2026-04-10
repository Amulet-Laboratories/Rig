<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'

interface Props {
  location: 'sidebar-top' | 'sidebar-bottom' | 'in-content' | 'header' | 'footer'
  format?: 'display' | 'native' | 'text'
}

withDefaults(defineProps<Props>(), {
  format: 'display',
})

const config = useRuntimeConfig()
const adClientId = computed(() => config.public.adsenseClientId as string | undefined)
</script>

<template>
  <div v-if="adClientId" data-rig-ad-slot :data-ad-location="location" :data-ad-format="format">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="adClientId"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </div>
</template>
