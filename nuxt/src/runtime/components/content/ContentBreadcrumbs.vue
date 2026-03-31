<script setup lang="ts">
import type { ContentBreadcrumbItem } from '@amulet-laboratories/rig'

defineProps<{
  items: ContentBreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" data-rig-breadcrumbs>
    <ol data-rig-breadcrumbs-list>
      <li v-for="(item, index) in items" :key="item.path" data-rig-breadcrumbs-item>
        <NuxtLink v-if="index < items.length - 1" :to="item.path" data-rig-breadcrumbs-link>
          {{ item.label }}
        </NuxtLink>
        <span v-else data-rig-breadcrumbs-current aria-current="page">
          {{ item.label }}
        </span>
        <svg
          v-if="index < items.length - 1"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          data-rig-breadcrumbs-separator
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </li>
    </ol>
  </nav>
</template>
