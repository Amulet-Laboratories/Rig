<script setup lang="ts">
import { computed } from 'vue'
import {
  useRoute,
  createError,
  useAppConfig,
  useAsyncData,
  onMounted,
  useSchemaOrg,
  defineWebPage,
  defineBreadcrumb,
} from '#imports'
import { useFathom } from '@amulet-laboratories/rig'
import { useProducts } from '../../composables/useProducts'
import { useArticleSeo } from '../../composables/useArticleSeo'
import { useStructuredData } from '../../composables/useStructuredData'

const props = defineProps<{
  quizSlug: string
  quizDescription: string
}>()

const route = useRoute()
const slugParam = Array.isArray(route.params.slugs)
  ? route.params.slugs.join('/')
  : String(route.params.slugs || '')
const [slugA, slugB] = slugParam.split('-vs-')

if (!slugA || !slugB) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Comparison requires two products: /compare/product-a-vs-product-b',
  })
}

const appConfig = useAppConfig()
const networkArticles = appConfig.networkArticles as {
  site: string
  url: string
  title: string
  path: string
  tag: string
}[]

const { getProduct } = useProducts()
const { data: productA } = await useAsyncData(`compare-a-${slugA}`, () => getProduct(slugA))
const { data: productB } = await useAsyncData(`compare-b-${slugB}`, () => getProduct(slugB))

if (!productA.value || !productB.value) {
  throw createError({ statusCode: 404, statusMessage: 'One or both products not found' })
}

const title = `${productA.value.name} vs ${productB.value.name}`
const description = `Side-by-side comparison of ${productA.value.name} and ${productB.value.name}. Specs, pros, cons, and our recommendation.`

useArticleSeo({ title, description })
useStructuredData({ title, description, schema: 'Article' })

const { trackAffiliateClick, trackComparisonView } = useFathom()
onMounted(() => trackComparisonView(slugA, slugB))

const winner = computed(() => {
  if (!productA.value || !productB.value) return null
  return productA.value.rating >= productB.value.rating ? productA.value : productB.value
})

const editorial = computed(() => {
  if (!productA.value || !productB.value) return null
  const a = productA.value
  const b = productB.value

  const extractPrice = (range: string): number => {
    const match = range?.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  const priceA = extractPrice(a.price_range)
  const priceB = extractPrice(b.price_range)

  let priceNote = ''
  if (Math.abs(priceA - priceB) < 10) {
    priceNote = `Both are competitively priced (${a.price_range} vs ${b.price_range})`
  } else {
    const cheaper = priceA < priceB ? a : b
    priceNote = `The ${cheaper.name} is the more budget-friendly option at ${cheaper.price_range}`
  }

  const commonality =
    a.category === b.category
      ? `The ${a.name} and ${b.name} are both ${a.category} products from ${a.brand} and ${b.brand} respectively. ${priceNote}, making this a straightforward decision based on your priorities.`
      : `The ${a.name} (${a.category}) and ${b.name} (${b.category}) take different approaches. ${priceNote}.`

  const strengthA = a.pros?.[0]?.toLowerCase() || 'solid performance'
  const strengthB = b.pros?.[0]?.toLowerCase() || 'solid performance'
  const weaknessA = a.cons?.[0]?.toLowerCase() || 'minor limitations'
  const weaknessB = b.cons?.[0]?.toLowerCase() || 'minor limitations'
  const ratingDiff = Math.abs(a.rating - b.rating)
  const ratingNote =
    ratingDiff < 0.3
      ? `Both are well-regarded with ratings of ${a.rating}/5 and ${b.rating}/5.`
      : `The ${a.rating > b.rating ? a.name : b.name} has a higher overall rating (${Math.max(a.rating, b.rating)}/5 vs ${Math.min(a.rating, b.rating)}/5).`

  const differentiators = `Where they differ: the ${a.name} stands out for ${strengthA}, while the ${b.name} excels at ${strengthB}. On the downside, the ${a.name}'s main concern is ${weaknessA}, and the ${b.name}'s is ${weaknessB}. ${ratingNote}`

  const pickA = `Choose the ${a.name} if you prioritize ${strengthA}.`
  const pickB = `Go with the ${b.name} if ${strengthB} matters most.`
  const recommendation = `${pickA} ${pickB}`

  return { commonality, differentiators, recommendation }
})

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: 'Compare', path: '/compare' },
  { label: title, path: route.path },
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
  <div v-if="productA && productB">
    <ContentBreadcrumbs :items="breadcrumbs" />
    <div data-rig-article-layout>
      <article data-rig-article-layout-content>
        <header data-rig-article-header>
          <h1 data-rig-article-header-title>{{ title }}</h1>
          <p data-rig-article-header-description>{{ description }}</p>
        </header>

        <section v-if="editorial" data-rig-prose>
          <h2>What's the Difference?</h2>
          <p>{{ editorial.commonality }}</p>
          <p>{{ editorial.differentiators }}</p>
          <p>{{ editorial.recommendation }}</p>
        </section>

        <div data-rig-compare-grid>
          <div v-for="product in [productA, productB]" :key="product.slug" data-rig-compare-card>
            <div data-rig-compare-card-header>
              <h2 data-rig-compare-card-name>{{ product.name }}</h2>
              <span data-rig-compare-card-brand>{{ product.brand }}</span>
              <span data-rig-compare-card-price>{{ product.price_range }}</span>
              <span data-rig-product-card-rating>{{ product.rating }}/5</span>
            </div>
            <p data-rig-compare-card-oneliner>{{ product.one_liner }}</p>
            <div data-rig-product-card-details>
              <div data-rig-product-card-pros>
                <strong>Pros</strong>
                <ul>
                  <li v-for="pro in product.pros" :key="pro">{{ pro }}</li>
                </ul>
              </div>
              <div data-rig-product-card-cons>
                <strong>Cons</strong>
                <ul>
                  <li v-for="con in product.cons" :key="con">{{ con }}</li>
                </ul>
              </div>
            </div>
            <div v-if="product.amazon?.url" data-rig-compare-card-cta>
              <a
                :href="product.amazon.url"
                target="_blank"
                rel="nofollow noopener sponsored"
                data-rig-product-card-link
                :aria-label="`Check price on Amazon for ${product.name}`"
                @click="trackAffiliateClick(product.slug)"
              >
                Check price on Amazon
              </a>
            </div>
          </div>
        </div>

        <div v-if="winner" data-rig-compare-verdict>
          <h2>Our Pick: {{ winner.name }}</h2>
          <p>
            With a {{ winner.rating }}/5 rating, the {{ winner.name }} edges ahead.
            {{ winner.one_liner }}
          </p>
        </div>

        <AffiliateDisclosure />
        <NetworkArticles :articles="networkArticles" />
      </article>
      <aside data-rig-article-layout-sidebar>
        <div data-rig-article-layout-sidebar-sticky>
          <QuizPromo
            :quiz-slug="props.quizSlug"
            quiz-title="Not sure which to pick?"
            :description="props.quizDescription"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
