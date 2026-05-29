<script setup lang="ts">
import { useAsyncData, queryCollection } from '#imports'

const props = defineProps<{
  currentPath: string
  category?: string
}>()

const { data: related } = await useAsyncData(
  `related-onsite-${props.currentPath}`,
  async () => {
    if (!props.category) return []
    const articles = await queryCollection('articles')
      .where('category', '=', props.category)
      .order('publishedAt', 'DESC')
      .limit(4)
      .all()
    return articles.filter((a) => a.path !== props.currentPath).slice(0, 3)
  },
  { default: () => [] },
)
</script>

<template>
  <section v-if="related.length" data-rig-related-onsite>
    <h2 data-rig-related-onsite-heading>More in this category</h2>
    <div data-rig-related-grid>
      <div v-for="article in related" :key="article.path" data-rig-related-card>
        <NuxtLink :to="article.path" data-rig-related-link>
          <span data-rig-related-category>{{ article.category }}</span>
          <span data-rig-related-title>{{ article.title }}</span>
          <span data-rig-related-description>{{ article.description }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
