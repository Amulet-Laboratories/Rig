<script setup lang="ts">
import { computed } from 'vue'
import {
  useRoute,
  useAsyncData,
  createError,
  useSchemaOrg,
  defineWebPage,
  defineBreadcrumb,
} from '#imports'
import { useProducts } from '../../composables/useProducts'
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

const { getAllProducts } = useProducts()
const { data: allProducts } = await useAsyncData('persona-products', () => getAllProducts())

const persona = props.personas[personaSlug]
if (!persona) {
  throw createError({ statusCode: 404, statusMessage: 'Persona not found' })
}

const products = computed(() => {
  if (!allProducts.value) return []
  return persona.productSlugs
    .map((slug) => allProducts.value!.find((product: { slug: string }) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => !!product)
})

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
        <Card v-for="product in products" :key="product.slug" data-rig-product-card>
          <template #header>
            <div data-rig-product-card-header>
              <div data-rig-product-card-info>
                <span data-rig-product-card-name>{{ product.name }}</span>
                <span data-rig-product-card-brand
                  >{{ product.brand }} &middot; {{ product.price_range }}</span
                >
              </div>
              <span data-rig-product-card-rating>{{ product.rating }}/5</span>
            </div>
          </template>
          <p data-rig-product-card-oneliner>{{ product.one_liner }}</p>
          <template v-if="product.amazon?.url" #footer>
            <div data-rig-product-card-footer>
              <a
                :href="product.amazon.url"
                target="_blank"
                rel="nofollow noopener sponsored"
                data-rig-product-card-link
                :aria-label="`Check price on Amazon for ${product.name}`"
              >
                Check price on Amazon
              </a>
            </div>
          </template>
        </Card>
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
