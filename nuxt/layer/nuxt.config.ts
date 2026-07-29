// Nuxt layer for the content-network sites.
//
// Everything here was, until 2026-07-28, copied byte-for-byte into each of the
// six affiliate sites. Extend it instead:
//
//   export default defineNuxtConfig({
//     extends: ['@amulet-laboratories/rig-nuxt/layer'],
//   })
//
// What the layer provides:
//   pages/index.vue              → <ContentHomePage />
//   pages/compare/index.vue      → <ContentCompareIndexPage />
//   pages/best-for/index.vue     → <ContentBestForIndexPage />
//   pages/category/[slug].vue    the category listing, in full
//   pages/[...slug].vue          the article route, in full
//   error.vue                    the error page
//
// The first three are thin wrappers because the page bodies already existed as
// components in this module's runtime (`ContentHomePage` and friends) — they
// were registered but no site ever consumed them.
//
// A consuming site overrides any of these by defining a file at the same path;
// project files win over layer files. That is also how per-site pieces keep
// working: `pages/index.vue` here renders `<CategoryIcon>`, and each site's own
// `components/content/CategoryIcon.vue` takes precedence over the module's.
//
// This layer deliberately sets no `modules`, `css`, or `site` config — a layer's
// config merges into the consumer's, and the sites already declare those
// themselves. It exists to contribute files, not configuration.
export default defineNuxtConfig({})
