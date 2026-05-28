<script setup lang="ts">
import { useRoute, createError, useSchemaOrg, defineWebPage, defineBreadcrumb } from '#imports'
import { useArticleSeo } from '../../composables/useArticleSeo'

interface PersonaConfig {
  name: string
  quiz: string
  description: string
  productSlugs: string[]
}

const props = defineProps<{
  personas: Record<string, PersonaConfig>
  retakeDescription?: string
}>()

const route = useRoute()
const personaSlug = route.params.persona as string

const persona = props.personas[personaSlug]
if (!persona) {
  throw createError({ statusCode: 404, statusMessage: 'Persona not found' })
}

const title = `Best for ${persona.name}`
const description = persona.description

useArticleSeo({ title, description })

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: 'Best For', path: '/best-for' },
  { label: persona.name, path: route.path },
]

useSchemaOrg([
  defineWebPage({ name: title }),
  defineBreadcrumb({
    itemListElement: breadcrumbs.map((item, i) => ({
      name: item.label,
      item: item.path,
      position: i + 1,
    })),
  }),
])
</script>

<template>
  <div>
    <ContentBreadcrumbs :items="breadcrumbs" />
    <div data-rig-persona-header>
      <span data-rig-persona-badge>Your Result</span>
      <h1 data-rig-persona-title>Best for {{ persona.name }}</h1>
      <p data-rig-persona-description>{{ persona.description }}</p>
    </div>

    <Section title="Our Picks for You" subtitle="Products matched to your style">
      <div data-rig-article-grid>
        <ProductCardWrapper v-for="slug in persona.productSlugs" :key="slug" :slug="slug" />
      </div>
    </Section>

    <Section variant="alternate">
      <QuizPromo
        :quiz-slug="persona.quiz"
        quiz-title="Not your result?"
        :description="props.retakeDescription || 'Retake the quiz to find your personalized picks.'"
      />
    </Section>

    <CTABanner layout="centered" variant="card">
      <ContentNewsletterSignup />
    </CTABanner>
  </div>
</template>
