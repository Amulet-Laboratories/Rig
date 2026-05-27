import { useRuntimeConfig, useRoute, useSeoMeta, useHead } from 'nuxt/app'

export interface SeoMetaOptions {
  title: string
  description?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

export const useArticleSeo = (options: SeoMetaOptions) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public?.siteUrl as string) || ''
  const siteName = (config.public?.siteName as string) || ''
  const route = useRoute()
  const canonicalUrl = `${siteUrl}${route.path}`
  const ogImage = options.ogImage || `${siteUrl}/og-default.svg`

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: (options.ogType || 'article') as 'article',
    ogSiteName: siteName,
    ogUrl: canonicalUrl,
    ogImage,
    twitterCard: (options.twitterCard || 'summary_large_image') as 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: options.ogImage,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  })
}
