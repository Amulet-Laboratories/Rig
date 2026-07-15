import { existsSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import {
  defineNuxtModule,
  addImports,
  addComponent,
  addPlugin,
  addServerScanDir,
  createResolver,
} from '@nuxt/kit'
import {
  components as RIG_COMPONENTS,
  composables as RIG_COMPOSABLES,
} from '@amulet-laboratories/rig/manifest'

/**
 * @amulet-laboratories/rig-nuxt
 *
 * Nuxt module that auto-imports all Rig components and composables.
 * Tree-shaking works automatically — only components used in templates are bundled.
 *
 * Usage in nuxt.config.ts:
 *   modules: ['@amulet-laboratories/rig-nuxt']
 *
 * Options:
 *   prefix: string — component prefix (default: '' — no prefix)
 *   composables: boolean — auto-import composables (default: true)
 *   content: boolean | ContentOptions — enable authority-site content features
 */

export interface ContentOptions {
  /** Enable Fathom analytics plugin (default: true) */
  fathom?: boolean
  /** Enable Sentry error tracking plugin (default: true) */
  sentry?: boolean
  /** Enable the global AdSense loader plugin, required by Auto Ads (default: true) */
  adsense?: boolean
  /** Enable product API routes (default: true) */
  products?: boolean
  /** Enable newsletter API route (default: true) */
  newsletter?: boolean
  /** Enable RSS feed route (default: true) */
  feed?: boolean
  /** Enable sitemap route (default: true) */
  sitemap?: boolean
}

export interface NuxtRigOptions {
  /** Prefix for component names (e.g. 'Rig' → RigButton, RigModal) */
  prefix?: string
  /** Whether to auto-import composables (default: true) */
  composables?: boolean
  /** Enable authority-site content features (components, composables, plugins, server routes) */
  content?: boolean | ContentOptions
}

// The component + composable name lists come from `@amulet-laboratories/rig/
// manifest`, which Rig generates from its own barrel and drift-tests in CI. This
// module used to hardcode the list, which silently fell ~18 components behind
// every time Rig shipped new ones. Deriving it means new Rig components are
// auto-imported the moment a consumer bumps Rig — no edit here required.

// Composables deliberately withheld from the global auto-import namespace
// because they collide with an app's own composable of the same name. `useFathom`
// is instead provided under the content-feature block below (authority sites),
// so a plain app keeps its own `useFathom`.
const CONTENT_GATED_COMPOSABLES = new Set<string>(['useFathom'])

// Provide-style setup helpers and singleton objects live outside the `use*`
// naming convention, so they aren't in the manifest's composable list —
// enumerate them here.
const EXTRA_AUTO_IMPORTS = ['provideDragDrop', 'provideConfig', 'toast', 'notification'] as const

export default defineNuxtModule<NuxtRigOptions>({
  meta: {
    name: '@amulet-laboratories/rig-nuxt',
    configKey: 'rig',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    prefix: '',
    composables: true,
    content: false,
  },
  setup(options, nuxt) {
    const prefix = options.prefix ?? ''
    const { resolve } = createResolver(import.meta.url)

    // ── Ship the product data with the server build ──
    //
    // Deliberately ahead of the `content` gate below, and keyed on the directory
    // existing rather than on any option: QuizSort declares no `rig` block at
    // all, so `content` is false there, but its own /go/[slug] route reads the
    // same data. Gating this on `content` would leave that route broken.
    //
    // Why it is needed: the handlers look up data/products/<niche>/<slug>.yaml
    // through a path assembled at runtime. Nitro's bundler traces static imports,
    // not strings built from a router param, so nothing tells it these files are
    // needed and none of them reach the deployed function. Locally every lookup
    // succeeds (cwd is the repo root and the files are right there); in
    // production every lookup misses and /api/products returns [] rather than
    // erroring, so it fails silently. Registering the directory as a server asset
    // is what makes the data present at runtime.
    const productsDir = resolvePath(nuxt.options.rootDir, 'data/products')
    if (existsSync(productsDir)) {
      nuxt.options.nitro ||= {}
      nuxt.options.nitro.serverAssets ||= []
      nuxt.options.nitro.serverAssets.push({ baseName: 'products', dir: productsDir })
    }

    // Auto-import every Rig component (derived from the manifest, never a
    // hardcoded list). Tree-shaking drops any a site doesn't use in a template.
    for (const name of RIG_COMPONENTS) {
      addComponent({
        name: `${prefix}${name}`,
        export: name,
        filePath: '@amulet-laboratories/rig',
      })
    }

    // Auto-import composables (manifest `use*` list, minus content-gated ones),
    // plus the non-`use*` provide/singleton helpers.
    if (options.composables !== false) {
      for (const name of RIG_COMPOSABLES) {
        if (CONTENT_GATED_COMPOSABLES.has(name)) continue
        addImports({ name, from: '@amulet-laboratories/rig' })
      }
      for (const name of EXTRA_AUTO_IMPORTS) {
        addImports({ name, from: '@amulet-laboratories/rig' })
      }
    }

    // ── Content features (authority-site runtime) ──
    if (!options.content) return

    const contentOpts: ContentOptions = options.content === true ? {} : options.content

    // Authority-site analytics composable. Gated to content consumers so it
    // does not shadow an app's own `useFathom` auto-import (e.g. QuizSort's
    // quiz-specific analytics live in its local composables/useFathom.ts).
    addImports({ name: 'useFathom', from: '@amulet-laboratories/rig' })

    // Content components
    const contentComponents: Array<{ name: string; filePath: string }> = [
      {
        name: 'ArticleHeader',
        filePath: resolve('./runtime/components/content/ArticleHeader.vue'),
      },
      {
        name: 'ContentBreadcrumbs',
        filePath: resolve('./runtime/components/content/ContentBreadcrumbs.vue'),
      },
      {
        name: 'TableOfContents',
        filePath: resolve('./runtime/components/content/TableOfContents.vue'),
      },
      {
        name: 'RelatedArticles',
        filePath: resolve('./runtime/components/content/RelatedArticles.vue'),
      },
      {
        name: 'RelatedOnSite',
        filePath: resolve('./runtime/components/content/RelatedOnSite.vue'),
      },
      {
        name: 'NetworkArticles',
        filePath: resolve('./runtime/components/content/NetworkArticles.vue'),
      },
      {
        name: 'NetworkLinks',
        filePath: resolve('./runtime/components/content/NetworkLinks.vue'),
      },
      {
        name: 'ProductCardWrapper',
        filePath: resolve('./runtime/components/content/ProductCardWrapper.vue'),
      },
      {
        name: 'CategoryIcon',
        filePath: resolve('./runtime/components/content/CategoryIcon.vue'),
      },
      {
        name: 'ContentHomePage',
        filePath: resolve('./runtime/components/content/ContentHomePage.vue'),
      },
      {
        name: 'ContentComparePage',
        filePath: resolve('./runtime/components/content/ContentComparePage.vue'),
      },
      {
        name: 'ContentCompareIndexPage',
        filePath: resolve('./runtime/components/content/ContentCompareIndexPage.vue'),
      },
      {
        name: 'ContentBestForPersonaPage',
        filePath: resolve('./runtime/components/content/ContentBestForPersonaPage.vue'),
      },
      {
        name: 'ContentBestForIndexPage',
        filePath: resolve('./runtime/components/content/ContentBestForIndexPage.vue'),
      },
      {
        name: 'AffiliateDisclosure',
        filePath: resolve('./runtime/components/content/AffiliateDisclosure.vue'),
      },
      {
        name: 'ContentNewsletterSignup',
        filePath: resolve('./runtime/components/content/NewsletterSignup.vue'),
      },
      {
        name: 'NewsletterSignup',
        filePath: resolve('./runtime/components/content/NewsletterSignup.vue'),
      },
      { name: 'QuickAnswer', filePath: resolve('./runtime/components/content/QuickAnswer.vue') },
      { name: 'FaqBlock', filePath: resolve('./runtime/components/content/FaqBlock.vue') },
      { name: 'QuizPromo', filePath: resolve('./runtime/components/content/QuizPromo.vue') },
      {
        name: 'QuizEmbedWrapper',
        filePath: resolve('./runtime/components/content/QuizEmbedWrapper.vue'),
      },
      {
        name: 'QuizGatedGuide',
        filePath: resolve('./runtime/components/content/QuizGatedGuide.vue'),
      },
      {
        name: 'PersonalizedHero',
        filePath: resolve('./runtime/components/content/PersonalizedHero.vue'),
      },
      {
        name: 'AdUnit',
        filePath: resolve('./runtime/components/content/AdUnit.vue'),
      },
      {
        name: 'EditorialSidebar',
        filePath: resolve('./runtime/components/content/EditorialSidebar.vue'),
      },
      {
        name: 'ContentAppFooter',
        filePath: resolve('./runtime/components/layout/ContentAppFooter.vue'),
      },
      { name: 'NetworkFooter', filePath: resolve('./runtime/components/layout/NetworkFooter.vue') },
      { name: 'CookieConsent', filePath: resolve('./runtime/components/layout/CookieConsent.vue') },
      { name: 'AdSlot', filePath: resolve('./runtime/components/layout/AdSlot.vue') },
    ]

    for (const comp of contentComponents) {
      addComponent({
        name: `${prefix}${comp.name}`,
        filePath: comp.filePath,
      })
    }

    // Content composables
    addImports({ name: 'useArticleSeo', from: resolve('./runtime/composables/useArticleSeo') })
    addImports({
      name: 'useStructuredData',
      from: resolve('./runtime/composables/useStructuredData'),
    })
    addImports({ name: 'useProducts', from: resolve('./runtime/composables/useProducts') })

    // Plugins
    if (contentOpts.fathom !== false) {
      addPlugin(resolve('./runtime/plugins/fathom.client'))
    }
    if (contentOpts.sentry !== false) {
      addPlugin(resolve('./runtime/plugins/sentry.client'))
    }
    if (contentOpts.adsense !== false) {
      addPlugin(resolve('./runtime/plugins/adsense.client'))
    }

    // Server routes — use addServerScanDir so Nitro transpiles TypeScript
    addServerScanDir(resolve('./runtime/server'))
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    rig?: NuxtRigOptions
  }
}
