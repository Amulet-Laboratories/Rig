<script setup lang="ts">
import { computed } from 'vue'
import { useSiteConfig } from '#imports'

interface NetworkSite {
  name: string
  url: string
  tagline: string
}

const props = defineProps<{
  sites: NetworkSite[]
}>()

const { name: currentSite } = useSiteConfig()

const otherSites = computed(() => props.sites.filter((s) => s.name !== currentSite))
</script>

<template>
  <nav data-rig-network-footer aria-label="Partner sites">
    <div data-rig-network-footer-inner>
      <p data-rig-network-footer-label>From our network</p>
      <ul data-rig-network-footer-list>
        <li v-for="site in otherSites" :key="site.name">
          <a :href="site.url" target="_blank" rel="noopener" data-rig-network-footer-link>
            <span data-rig-network-footer-name>{{ site.name }}</span>
            <span data-rig-network-footer-tagline>{{ site.tagline }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
