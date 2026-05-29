<script setup lang="ts">
import { useSiteConfig, useAppConfig } from '#imports'

defineProps<{
  tagline?: string
}>()

const { name: siteName } = useSiteConfig()
const appConfig = useAppConfig()
const categories = appConfig.categories as Record<string, { label: string }>
const currentYear = new Date().getFullYear()
</script>

<template>
  <SiteFooter :columns="3">
    <div data-rig-site-footer-column>
      <NuxtLink to="/" data-rig-site-footer-brand>
        {{ siteName }}
      </NuxtLink>
      <p v-if="tagline" data-rig-site-footer-tagline>
        {{ tagline }}
      </p>
    </div>

    <div data-rig-site-footer-column>
      <h3 data-rig-site-footer-heading>Categories</h3>
      <ul data-rig-site-footer-links>
        <li v-for="(category, slug) in categories" :key="slug">
          <NuxtLink :to="`/category/${slug}`">
            {{ category.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div data-rig-site-footer-column>
      <h3 data-rig-site-footer-heading>Site</h3>
      <ul data-rig-site-footer-links>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/terms-of-service">Terms of Service</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/affiliate-disclosure">Affiliate Disclosure</NuxtLink>
        </li>
        <li>
          <a href="/feed.xml" target="_blank" rel="noopener">RSS Feed</a>
        </li>
      </ul>
    </div>

    <template #post-footer>
      <p data-rig-site-footer-copyright>
        &copy; {{ currentYear }} {{ siteName }}. All rights reserved.
      </p>
    </template>
  </SiteFooter>
</template>
