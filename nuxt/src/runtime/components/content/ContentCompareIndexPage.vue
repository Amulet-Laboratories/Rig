<script setup lang="ts">
import { computed } from 'vue'
import {
  useAsyncData,
  useSeoMeta,
  useSchemaOrg,
  defineWebPage,
  defineBreadcrumb,
  navigateTo,
} from '#imports'
import { useProducts } from '../../composables/useProducts'

const { getAllProducts } = useProducts()
const { data: products } = await useAsyncData('all-products', () => getAllProducts())

const comparisons = computed(() => {
  if (!products.value?.length) return []
  const byCategory = new Map<string, typeof products.value>()
  for (const product of products.value) {
    const items = byCategory.get(product.category) ?? []
    items.push(product)
    byCategory.set(product.category, items)
  }
  const pairs: Array<{
    slugA: string
    slugB: string
    nameA: string
    nameB: string
    category: string
  }> = []
  for (const [category, items] of byCategory) {
    for (let first = 0; first < items.length; first++) {
      for (let second = first + 1; second < items.length; second++) {
        pairs.push({
          slugA: items[first].slug,
          slugB: items[second].slug,
          nameA: items[first].name,
          nameB: items[second].name,
          category,
        })
      }
    }
  }
  return pairs.slice(0, 30)
})

useSeoMeta({
  title: 'Product Comparisons',
  description: 'Side-by-side product comparisons with specs, pros, cons, and our recommendations.',
})

useSchemaOrg([
  defineWebPage({ name: 'Product Comparisons' }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/', position: 1 },
      { name: 'Compare', item: '/compare', position: 2 },
    ],
  }),
])
</script>

<template>
  <div>
    <ContentBreadcrumbs
      :items="[
        { label: 'Home', path: '/' },
        { label: 'Compare', path: '/compare' },
      ]"
    />
    <Section title="Product Comparisons" subtitle="Side-by-side buying decisions">
      <div v-if="comparisons.length" data-rig-article-grid>
        <Card
          v-for="comparison in comparisons"
          :key="`${comparison.slugA}-${comparison.slugB}`"
          interactive
          role="link"
          :tabindex="0"
          @click="navigateTo(`/compare/${comparison.slugA}-vs-${comparison.slugB}`)"
          @keydown.enter="navigateTo(`/compare/${comparison.slugA}-vs-${comparison.slugB}`)"
        >
          <NuxtLink
            :to="`/compare/${comparison.slugA}-vs-${comparison.slugB}`"
            data-rig-article-card-link
          >
            <span data-rig-article-card-category>{{ comparison.category }}</span>
            <span data-rig-article-card-title
              >{{ comparison.nameA }} vs {{ comparison.nameB }}</span
            >
          </NuxtLink>
        </Card>
      </div>
      <p v-else data-rig-empty-state>No comparisons available yet.</p>
    </Section>
  </div>
</template>
