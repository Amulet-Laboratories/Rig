# Changelog

All notable changes to `@amulet-laboratories/rig-nuxt` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **A Nuxt layer at `@amulet-laboratories/rig-nuxt/layer`.** The six affiliate sites each carried byte-identical copies of `pages/index.vue`, `pages/category/[slug].vue`, `pages/compare/index.vue`, `pages/best-for/index.vue`, `pages/[...slug].vue`, `error.vue`, and `server/api/newsletter/subscribe.post.ts` — 741 lines per site, ~3,700 redundant across the network. Sites now `extends: ['@amulet-laboratories/rig-nuxt/layer']` and delete their copies. A site still overrides any of them by defining a file at the same path; project files win over layer files, which is also how per-site pieces like `components/content/CategoryIcon.vue` keep taking precedence.
  - Three of the layer's pages are thin wrappers around `ContentHomePage`, `ContentCompareIndexPage`, and `ContentBestForIndexPage`. **Those components already existed in this module's runtime and no site had ever consumed them** — they were registered, shipped, and dead. The layer is what finally puts them to work.

### Fixed

- **`readAllProducts()` returned products in unspecified order.** `storage.getKeys()` makes no ordering guarantee, and the comparison index picks pairs off the front of that list, so **two builds of identical source emitted 30 completely different `/compare/*` routes** — every deploy 404'd the URLs the previous one published, and the sitemap churned. The keys are now sorted.
- **`ContentHomePage` 500'd for any site without a quiz.** It dereferenced `appConfig.homepage.quiz.slug` unconditionally. All six affiliate sites define a quiz, so it was never hit — but `site-boilerplate`, the template every new site is cloned from, does not, and its homepage failed to prerender the moment it adopted the layer. `quiz` is now optional and the section is skipped when absent.
- **Schema.org descriptions fell back to the site-wide description** on `/`, `/compare`, `/best-for`, `/category/*`, and every static page. `nuxt-schema-org` infers `WebPage.description` from the meta tag only when the component runs before schema-org resolves — which held while these pages lived in each site and stopped holding once they came from a layer or this module. `ContentHomePage`, `ContentCompareIndexPage`, `ContentBestForIndexPage`, and the layer's category and catch-all pages now state `description` explicitly.

### Changed

- **BREAKING: peer dependency is now `@amulet-laboratories/rig >= 3.0.0`** (was `>= 0.6.0`), and the stale optional peer entry for `@amulet-laboratories/hex` is gone — hex ships inside rig as of 3.0.0.

## [0.6.5] — 2026-07-17

### Changed

- **Sentry `environment` is now the reporting site's hostname instead of a flat `'production'`.** The whole affiliate network reports into one shared Sentry project; tagging every site `'production'` made errors indistinguishable in the shared view. The client plugin now uses `window.location.hostname` (e.g. `beanwoven.com`, `quizsort.com`) so events are filterable per site with no per-site config; local dev still reports as `'development'`. No API change — sites pick this up on bump.

## [0.5.0] — 2026-07-14

### Added

- **`QuickAnswer` and `FaqBlock` content components** (registered under `content`). These were the two content-layer pieces every site hand-rolled locally with their own `<style scoped>` blocks (because Hex styled neither). They now ship headless — `QuickAnswer` renders `data-rig-callout*`, `FaqBlock` renders `data-rig-faq*` and still emits FAQPage schema.org — with all visual treatment in Hex + Rig's structural styles. Sites can delete `components/content/QuickAnswer.vue` and `FaqBlock.vue` once they bump. (`ProductCardWrapper` / `CategoryIcon` already shipped here; local copies had merely drifted and are likewise deletable.)
- **`@nuxtjs/seo` added as an optional peer dependency** — `FaqBlock` uses its `useSchemaOrg` / `defineQuestion` auto-imports to emit FAQ structured data.

### Changed

- **Auto-import list is now derived from Rig's `/manifest` export instead of a hardcoded array.** The module previously kept a hand-maintained `COMPONENTS` list that silently fell ~18 components behind every time Rig shipped new ones — `ChatPanel`, `ConfirmDialog`, `ContentViewer`, `ErrorBoundary`, `FileBrowser`, `FormView`, `SidebarSection`, `SplitEditorArea`, `StatLine`, `WelcomeView`, and 7 others were not auto-importable for Nuxt consumers. Components (and `use*` composables) are now read from `@amulet-laboratories/rig/manifest`, which Rig generates from its own barrel and drift-tests in CI, so new Rig components are auto-imported the moment a consumer bumps Rig — no edit here required.
- **Composables** are derived from the manifest too, minus `useFathom` (kept content-gated so it does not shadow an app's own `useFathom`). The non-`use*` helpers (`provideDragDrop`, `provideConfig`, `toast`, `notification`) remain explicitly enumerated.

### Breaking Changes

- **Peer dependency `@amulet-laboratories/rig` raised to `>=0.6.0`** — the version that introduced the `/manifest` export this module now imports. Bump `@amulet-laboratories/rig` and `@amulet-laboratories/rig-nuxt` together.

### Fixed

- **README:** corrected the stale "auto-imports all 98 components and 16 composables" claim (Rig now ships 148) and the example theme import (`hex/vscode` → `hex/cobalt`; the `vscode` theme was removed in Hex 0.5.0).

## [0.4.0]

- Content-site feature layer: authority-site components, composables, plugins (Fathom, Sentry), and server routes (products, newsletter, feed, sitemap), gated behind the `content` module option.
- Auto-import of Rig components and composables via a hardcoded name list.
