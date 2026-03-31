<script setup lang="ts">
import { useFathom } from '@amulet-laboratories/rig'

interface NetworkArticle {
  site: string
  url: string
  title: string
  path: string
  tag: string
}

const props = defineProps<{
  articles: NetworkArticle[]
}>()

const { name: currentSite } = useSiteConfig()
const { trackCrossSiteNav } = useFathom()

const recommendations = computed(() =>
  props.articles.filter((a) => a.site !== currentSite).slice(0, 3),
)
</script>

<template>
  <section v-if="recommendations.length" data-rig-network-articles>
    <h2 data-rig-network-articles-heading>More from our network</h2>
    <div data-rig-network-articles-grid>
      <a
        v-for="article in recommendations"
        :key="article.path"
        :href="`${article.url}${article.path}`"
        target="_blank"
        rel="noopener"
        data-rig-network-articles-link
        @click="trackCrossSiteNav(article.site)"
      >
        <span data-rig-network-articles-site>{{ article.site }}</span>
        <span data-rig-network-articles-title>{{ article.title }}</span>
      </a>
    </div>
  </section>
</template>
