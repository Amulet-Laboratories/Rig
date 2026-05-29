<script setup lang="ts">
import { computed } from 'vue'
import {
  useRuntimeConfig,
  useSiteConfig,
  useSeoMeta,
  useSchemaOrg,
  defineWebPage,
  defineBreadcrumb,
  navigateTo,
} from '#imports'

const runtimeConfig = useRuntimeConfig()
const personaSlugs = runtimeConfig.contentPersonaSlugs.split(',')

const personaLabels = computed(() =>
  personaSlugs.map((slug: string) => ({
    slug,
    label: slug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  })),
)

const siteConfig = useSiteConfig()

useSeoMeta({
  title: `Best For You | ${siteConfig.name}`,
  description: `Personalized product picks based on your quiz results. Find the best ${siteConfig.name} recommendations for your type.`,
})

useSchemaOrg([
  defineWebPage({ name: `Best For You | ${siteConfig.name}` }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/', position: 1 },
      { name: 'Best For', item: '/best-for', position: 2 },
    ],
  }),
])
</script>

<template>
  <div>
    <ContentBreadcrumbs
      :items="[
        { label: 'Home', path: '/' },
        { label: 'Best For', path: '/best-for' },
      ]"
    />
    <Section
      title="Best For You"
      subtitle="Personalized recommendations based on your quiz results"
    >
      <div v-if="personaLabels.length" data-rig-article-grid>
        <Card
          v-for="persona in personaLabels"
          :key="persona.slug"
          interactive
          role="link"
          :tabindex="0"
          @click="navigateTo(`/best-for/${persona.slug}`)"
          @keydown.enter="navigateTo(`/best-for/${persona.slug}`)"
        >
          <NuxtLink :to="`/best-for/${persona.slug}`" data-rig-article-card-link>
            <span data-rig-persona-badge>Persona</span>
            <span data-rig-article-card-title>{{ persona.label }}</span>
            <span data-rig-article-card-description
              >See our curated product picks for this type.</span
            >
          </NuxtLink>
        </Card>
      </div>
      <p v-else data-rig-empty-state>
        No persona results available yet. Take a quiz to get personalized picks.
      </p>
    </Section>
  </div>
</template>
