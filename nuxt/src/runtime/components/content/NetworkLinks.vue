<script setup lang="ts">
import { computed } from 'vue'
import { useSiteConfig } from '#imports'
import { useFathom } from '@amulet-laboratories/rig'

interface CrossSiteLink {
  site: string
  slug: string
  title: string
}

const runtimeConfig = useRuntimeConfig()
const SITE_URLS: Record<string, string> = ((runtimeConfig.public as Record<string, unknown>)
  .networkSiteUrls as Record<string, string>) ?? {
  'beanwoven.com': 'https://beanwoven.com',
  'burrowtail.com': 'https://burrowtail.com',
  'dewthread.com': 'https://dewthread.com',
  'meeplehaus.com': 'https://meeplehaus.com',
  'shelfglow.com': 'https://shelfglow.com',
  'wainloft.com': 'https://wainloft.com',
}

const SITE_LABELS: Record<string, string> = {
  'beanwoven.com': 'Beanwoven',
  'burrowtail.com': 'Burrowtail',
  'dewthread.com': 'Dewthread',
  'meeplehaus.com': 'Meeplehaus',
  'shelfglow.com': 'Shelfglow',
  'wainloft.com': 'Wainloft',
}

const props = defineProps<{
  links?: CrossSiteLink[]
}>()

const { trackCrossSiteNav } = useFathom()
const { name: currentSite } = useSiteConfig()

const resolvedLinks = computed(() => {
  if (!props.links?.length) return []
  return props.links
    .filter((link) => link.site !== currentSite)
    .slice(0, 3)
    .map((link) => ({
      site: link.site,
      label: SITE_LABELS[link.site] ?? link.site.replace('.com', ''),
      url: `${SITE_URLS[link.site] ?? `https://${link.site}`}/articles/${link.slug}`,
      title: link.title,
    }))
})
</script>

<template>
  <section v-if="resolvedLinks.length" data-rig-network-links>
    <h2 data-rig-network-links-heading>From across the network</h2>
    <div data-rig-network-links-grid>
      <a
        v-for="link in resolvedLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener"
        data-rig-network-links-card
        @click="trackCrossSiteNav(link.site)"
      >
        <span data-rig-network-links-site>{{ link.label }}</span>
        <span data-rig-network-links-title>{{ link.title }}</span>
      </a>
    </div>
  </section>
</template>
