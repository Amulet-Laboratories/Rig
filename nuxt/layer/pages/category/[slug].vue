<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const appConfig = useAppConfig()
const categories = appConfig.categories as
  | Record<
      string,
      {
        label: string
        description: string
        subcategories?: Record<string, { label: string }>
      }
    >
  | undefined
const category = categories?.[slug]

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const { data: articles } = await useAsyncData(`category-${slug}`, () =>
  queryCollection('articles').where('category', '=', slug).order('publishedAt', 'DESC').all(),
)

useSeoMeta({
  title: `${category.label} | ${useSiteConfig().name}`,
  description: category.description,
})

const { formatDate } = useFormatDate()

function subcategoryLabel(sub: string | undefined): string {
  if (!sub) return ''
  return (
    category?.subcategories?.[sub]?.label ??
    sub
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  )
}

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: category.label, path: `/category/${slug}` },
]

useSchemaOrg([
  // `description` is stated, not inferred: nuxt-schema-org only picks it up
  // from the meta tag when this component runs before schema-org resolves,
  // which stopped holding once the page moved out of the site and into the
  // rig-nuxt layer. Without it, every category page fell back to the
  // site-wide description in its JSON-LD.
  defineWebPage({
    name: `${category.label} | ${useSiteConfig().name}`,
    description: category.description,
  }),
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
  <div :data-category="slug">
    <ContentBreadcrumbs :items="breadcrumbs" />
    <Section>
      <template #header>
        <div data-rig-category-header>
          <span data-rig-category-card-icon>
            <CategoryIcon :category="slug" :size="24" />
          </span>
          <h1 data-rig-category-header-title>{{ category.label }}</h1>
          <p data-rig-category-header-description>{{ category.description }}</p>
        </div>
      </template>

      <div v-if="articles?.length" data-rig-article-grid>
        <Card
          v-for="article in articles"
          :key="article.path"
          interactive
          role="link"
          :tabindex="0"
          :data-category="article.category"
          @click="navigateTo(article.path)"
          @keydown.enter="navigateTo(article.path)"
        >
          <div data-rig-card-visual>
            <CategoryIcon :category="article.category ?? ''" :size="32" />
          </div>
          <NuxtLink :to="article.path" data-rig-article-card-link>
            <span data-rig-article-card-category>{{ subcategoryLabel(article.subcategory) }}</span>
            <span data-rig-article-card-title>{{ article.title }}</span>
            <span data-rig-article-card-description>{{ article.description }}</span>
            <span data-rig-article-card-meta>
              <time v-if="article.publishedAt" :datetime="article.publishedAt">{{
                formatDate(article.publishedAt)
              }}</time>
              <span v-if="article.timeToRead">&middot; {{ article.timeToRead }} min</span>
            </span>
          </NuxtLink>
        </Card>
      </div>

      <p v-else data-rig-empty-state>No articles in this category yet. Check back soon.</p>
    </Section>
  </div>
</template>
