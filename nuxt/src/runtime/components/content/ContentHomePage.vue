<script setup lang="ts">
import { computed } from 'vue'
import {
  defineWebPage,
  defineWebSite,
  navigateTo,
  queryCollection,
  useAppConfig,
  useAsyncData,
  useFormatDate,
  useSchemaOrg,
  useSeoMeta,
  useSiteConfig,
} from '#imports'

const { data: featuredArticles } = await useAsyncData('featured', () =>
  queryCollection('articles')
    .where('pillar', '=', true)
    .order('publishedAt', 'DESC')
    .limit(3)
    .all(),
)

const { data: latestArticles } = await useAsyncData('latest', () =>
  queryCollection('articles').order('publishedAt', 'DESC').limit(6).all(),
)

const { data: moreArticles } = await useAsyncData('more', () =>
  queryCollection('articles').order('publishedAt', 'DESC').limit(9).all(),
)

const appConfig = useAppConfig()
const categories = appConfig.categories as Record<string, { label: string; description: string }>
const homepage = appConfig.homepage as {
  eyebrow: string
  headline: string
  description: string
  cta: string
  seo: { title: string; description: string }
  quiz: { slug: string; title: string; description: string }
}

const categoryImages = computed(() => {
  const images: Record<string, string> = {}
  for (const slug of Object.keys(categories)) {
    images[slug] = `/images/categories/${slug}.svg`
  }
  return images
})

const { formatDate } = useFormatDate()
const siteConfig = useSiteConfig()

useSeoMeta({
  title: homepage.seo.title,
  ogTitle: homepage.seo.title,
  description: homepage.seo.description,
  ogDescription: homepage.seo.description,
})

useSchemaOrg([
  defineWebSite({ name: siteConfig.name }),
  defineWebPage({ name: homepage.seo.title }),
])
</script>

<template>
  <div>
    <Hero layout="centered">
      <template #eyebrow>{{ homepage.eyebrow }}</template>
      <template #title>
        <h1>{{ homepage.headline }}</h1>
      </template>
      <template #description>
        <p>{{ homepage.description }}</p>
      </template>
      <template #actions>
        <Button variant="primary" @click="navigateTo('/category/' + Object.keys(categories)[0])">
          {{ homepage.cta }}
        </Button>
      </template>
    </Hero>

    <Section v-if="featuredArticles?.length" title="Featured" subtitle="Editor's picks">
      <div data-rig-magazine-grid>
        <Card
          v-for="article in featuredArticles"
          :key="article.path"
          interactive
          role="link"
          :tabindex="0"
          :data-category="article.category"
          @click="navigateTo(article.path)"
          @keydown.enter="navigateTo(article.path)"
        >
          <div data-rig-card-visual>
            <CategoryIcon :category="article.category ?? ''" :size="40" />
          </div>
          <NuxtLink :to="article.path" data-rig-featured-card-link>
            <span data-rig-featured-card-category>
              <CategoryIcon :category="article.category ?? ''" :size="14" />
              {{ article.category }}
            </span>
            <span data-rig-featured-card-title>{{ article.title }}</span>
            <span data-rig-featured-card-description>{{ article.description }}</span>
            <span v-if="article.publishedAt || article.timeToRead" data-rig-featured-card-meta>
              <time v-if="article.publishedAt" :datetime="article.publishedAt">
                {{ formatDate(article.publishedAt) }}
              </time>
              <span v-if="article.timeToRead">&middot; {{ article.timeToRead }} min read</span>
            </span>
          </NuxtLink>
        </Card>
      </div>
    </Section>

    <Section title="Explore by Category" subtitle="Find what you need" variant="alternate">
      <div data-rig-category-grid>
        <Card
          v-for="(category, slug) in categories"
          :key="slug"
          interactive
          role="link"
          :tabindex="0"
          :data-category="slug"
          @click="navigateTo(`/category/${slug}`)"
          @keydown.enter="navigateTo(`/category/${slug}`)"
        >
          <div
            data-rig-card-photo
            :style="{ backgroundImage: `url(${categoryImages[String(slug)]})` }"
          >
            <span data-rig-card-photo-overlay>
              <CategoryIcon :category="String(slug)" :size="28" />
            </span>
          </div>
          <NuxtLink :to="`/category/${slug}`" data-rig-category-card-link>
            <span data-rig-category-card-title>{{ category.label }}</span>
            <span data-rig-category-card-description>{{ category.description }}</span>
          </NuxtLink>
        </Card>
      </div>
    </Section>

    <Section variant="alternate">
      <QuizPromo
        :quiz-slug="homepage.quiz.slug"
        :quiz-title="homepage.quiz.title"
        :description="homepage.quiz.description"
      />
    </Section>

    <CTABanner layout="centered" variant="card">
      <ContentNewsletterSignup />
    </CTABanner>

    <Section v-if="latestArticles?.length" title="Latest Articles" subtitle="Recently published">
      <div data-rig-article-grid>
        <Card
          v-for="article in latestArticles"
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
            <span data-rig-article-card-category>{{ article.category }}</span>
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
    </Section>

    <Section
      v-if="moreArticles?.length && moreArticles.length > 6"
      title="More to Read"
      variant="alternate"
    >
      <div data-rig-article-grid>
        <Card
          v-for="article in moreArticles.slice(6)"
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
            <span data-rig-article-card-category>{{ article.category }}</span>
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
    </Section>
  </div>
</template>
