<script setup lang="ts">
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

const { data: article } = await useAsyncData(`article-${slug}`, () =>
  queryCollection('articles').path(route.path).first(),
)

const { data: page } = await useAsyncData(`page-${slug}`, () =>
  queryCollection('pages').path(route.path).first(),
)

const content = computed(() => article.value || page.value)

if (!content.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const isArticle = computed(() => !!article.value)
const articleData = computed(() => article.value)

const appConfig = useAppConfig()
const categories = appConfig.categories as Record<string, { label: string }> | undefined

const breadcrumbs = computed(() => {
  const items = [{ label: 'Home', path: '/' }]
  if (articleData.value) {
    const cat = articleData.value.category
    if (cat && categories?.[cat]) {
      items.push({ label: categories[cat].label, path: `/category/${cat}` })
    }
    items.push({ label: articleData.value.title, path: route.path })
  } else if (content.value) {
    items.push({ label: content.value.title, path: route.path })
  }
  return items
})

// seo.title is authored as a complete SERP title ending in "| <Site>", but
// app.vue's titleTemplate appends the brand too — strip the authored suffix so
// the brand lands exactly once. Falls back to the on-page H1 when absent.
// useSiteConfig() must resolve here during setup, not inside the getter.
const siteConfig = useSiteConfig()

const seoTitle = computed(() => {
  const h1 = articleData.value?.title ?? ''
  const authored = articleData.value?.seo?.title?.trim()
  if (!authored) return h1

  const brand = siteConfig.name
  if (!brand) return authored

  // seo.title is authored as a complete SERP title ending in "| <Brand>", but
  // app.vue's titleTemplate appends the brand as well — strip the authored
  // suffix so the brand lands exactly once.
  const suffix = ` | ${brand}`
  if (authored.endsWith(suffix)) {
    return authored.slice(0, -suffix.length).trim() || h1
  }
  // A malformed seo.title that is nothing but the suffix (one such article
  // existed) would otherwise render as a bare brand name.
  if (authored === `| ${brand}` || authored === `|${brand}`) return h1

  return authored
})

// Resolve affiliateProducts -> full product entries from products-db so
// useStructuredData can emit proper Product/Review/ItemList schema instead
// of a generic Article. Google Rich Results surface star ratings + prices
// in the SERP when these are present.
const affiliateSlugs = computed(() =>
  (articleData.value?.affiliateProducts ?? []).map((p: { slug: string }) => p.slug),
)
const { data: resolvedProducts } = await useAsyncData(
  `products-${slug}`,
  async () => {
    if (!affiliateSlugs.value.length) return []
    const { getProduct } = useProducts()
    const products = await Promise.all(affiliateSlugs.value.map((s: string) => getProduct(s)))
    return products.filter(Boolean)
  },
  { watch: [affiliateSlugs] },
)

if (articleData.value) {
  useArticleSeo({
    title: seoTitle.value,
    description: articleData.value.description,
    // seo.ogImage points at dedicated /images/articles/<slug>-og.jpg social
    // crops that were never generated (every one 404s). featuredImage is the
    // real 1200x630 hero and resolves — prefer it so share cards render an
    // image, falling back to seo.ogImage only if a hero is ever absent.
    ogImage: articleData.value.featuredImage?.src || articleData.value.seo?.ogImage,
  })
  useStructuredData({
    title: articleData.value.title,
    description: articleData.value.description,
    author: articleData.value.author,
    publishedAt: articleData.value.publishedAt,
    updatedAt: articleData.value.updatedAt,
    featuredImage: articleData.value.featuredImage,
    schema: articleData.value.schema,
    products: resolvedProducts.value ?? [],
  })
} else if (content.value) {
  useSeoMeta({
    title: content.value.title,
    description: content.value.description,
    ogTitle: content.value.title,
    ogDescription: content.value.description,
  })
  // State the WebPage description rather than letting nuxt-schema-org infer it
  // from the meta tag. That inference depends on this component running before
  // schema-org resolves, which held while the page lived in the site and stopped
  // holding once it moved into this layer — /about and /affiliate-disclosure
  // silently fell back to the site-wide description in their JSON-LD.
  useSchemaOrg([
    defineWebPage({
      name: content.value.title,
      description: content.value.description,
    }),
  ])
}

// BreadcrumbList structured data. <ContentBreadcrumbs> renders on every
// article/page but emitted no schema — the category/best-for pages call
// defineBreadcrumb, this catch-all route didn't (CLAUDE.md requires it on
// non-root pages). Mirror that pattern.
if (breadcrumbs.value.length > 1) {
  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: breadcrumbs.value.map((item, i) => ({
        name: item.label,
        item: item.path,
        position: i + 1,
      })),
    }),
  ])
}
</script>

<template>
  <div v-if="content">
    <template v-if="isArticle">
      <ReadingProgress />
      <ContentBreadcrumbs :items="breadcrumbs" />
      <div data-rig-article-layout>
        <article v-if="articleData" data-rig-article-layout-content>
          <ArticleHeader
            :title="articleData.title"
            :description="articleData.description"
            :published-at="articleData.publishedAt"
            :updated-at="articleData.updatedAt"
            :category="articleData.category"
            :time-to-read="articleData.timeToRead"
            :featured-image="articleData.featuredImage"
          />
          <NuxtErrorBoundary>
            <div data-rig-prose>
              <ContentRenderer :value="articleData" />
            </div>
            <template #error="{ error }">
              <div data-rig-error-inline>
                <p>Something went wrong rendering this article.</p>
                <pre>{{ error }}</pre>
              </div>
            </template>
          </NuxtErrorBoundary>
          <FaqBlock v-if="articleData.faq?.length" :items="articleData.faq" />
          <QuizEmbedWrapper
            v-if="articleData.quizEmbed?.quizSlug"
            :quiz-slug="articleData.quizEmbed.quizSlug"
            :heading="articleData.quizEmbed.heading"
            :cta="articleData.quizEmbed.cta"
          />
          <NewsletterSignup data-rig-newsletter-signup-spacing />
          <RelatedArticles
            v-if="articleData.relatedPosts?.length"
            :slugs="articleData.relatedPosts"
          />
          <RelatedOnSite v-else :current-path="route.path" :category="articleData.category" />
          <NetworkLinks :links="articleData.crossSiteLinks" />
        </article>
        <aside data-rig-article-layout-sidebar>
          <div data-rig-article-layout-sidebar-sticky>
            <TableOfContents />
            <EditorialSidebar
              v-if="articleData?.sidebar"
              :author="articleData.sidebar.author"
              :role="articleData.sidebar.role"
              :blurb="articleData.sidebar.blurb"
            />
          </div>
        </aside>
      </div>
    </template>
    <template v-else>
      <ContentBreadcrumbs :items="breadcrumbs" />
      <div data-rig-static-page>
        <h1 data-rig-static-page-title>{{ content.title }}</h1>
        <div data-rig-prose>
          <ContentRenderer :value="content" />
        </div>
      </div>
    </template>
  </div>
</template>
