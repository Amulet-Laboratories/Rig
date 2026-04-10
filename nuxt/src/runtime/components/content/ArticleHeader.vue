<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useFormatDate } from '@amulet-laboratories/rig'

interface Props {
  title: string
  description?: string
  publishedAt?: string
  updatedAt?: string
  category?: string
  timeToRead?: number
}

const props = defineProps<Props>()

const appConfig = useAppConfig()
const categories = appConfig.categories as Record<string, { label: string }> | undefined

const categoryLabel = computed(() => {
  if (!props.category || !categories) return props.category
  return categories[props.category]?.label ?? props.category
})

const { formatDate } = useFormatDate()

const formattedDate = computed(() => {
  if (!props.publishedAt) return ''
  return formatDate(props.publishedAt, 'long')
})

const formattedUpdatedDate = computed(() => {
  if (!props.updatedAt) return ''
  return formatDate(props.updatedAt, 'long')
})
</script>

<template>
  <header data-rig-article-header>
    <div data-rig-article-header-meta>
      <NuxtLink v-if="category" :to="`/category/${category}`" data-rig-article-header-category>
        <slot name="category-icon" :category="category" />
        {{ categoryLabel }}
      </NuxtLink>
      <span v-if="timeToRead" data-rig-article-header-reading-time>{{ timeToRead }} min read</span>
    </div>
    <h1 data-rig-article-header-title>{{ title }}</h1>
    <p v-if="description" data-rig-article-header-description>{{ description }}</p>
    <div v-if="publishedAt || updatedAt" data-rig-article-header-byline>
      <time v-if="publishedAt" :datetime="publishedAt">
        {{ formattedDate }}
      </time>
      <span v-if="updatedAt" data-rig-article-header-updated>
        Updated {{ formattedUpdatedDate }}
      </span>
    </div>
    <div data-rig-affiliate-notice>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <span
        >This article may contain affiliate links. If you purchase through these links, we may earn
        a small commission at no extra cost to you.
        <NuxtLink to="/affiliate-disclosure">Learn more</NuxtLink>.</span
      >
    </div>
  </header>
</template>
