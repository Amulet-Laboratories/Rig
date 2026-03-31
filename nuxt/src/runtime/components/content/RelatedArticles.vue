<script setup lang="ts">
const props = defineProps<{
  slugs: string[]
}>()

const { data: articles } = await useAsyncData(`related-${props.slugs.join('-')}`, () =>
  queryCollection('articles').where('slug', 'in', props.slugs).all(),
)
</script>

<template>
  <section v-if="articles?.length" data-rig-related-articles>
    <h2 data-rig-related-articles-heading>Related Articles</h2>
    <div data-rig-related-grid>
      <div v-for="article in articles" :key="article.path" data-rig-related-card>
        <NuxtLink :to="article.path" data-rig-related-link>
          <span data-rig-related-category>{{ article.category }}</span>
          <span data-rig-related-title>{{ article.title }}</span>
          <span data-rig-related-description>{{ article.description }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
