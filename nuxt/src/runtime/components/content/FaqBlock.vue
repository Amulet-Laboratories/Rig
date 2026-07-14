<script setup lang="ts">
// Renders an article's FAQ (from `faq` frontmatter) and emits FAQPage
// schema.org — which wins FAQ rich results in Google and gives AI answer
// engines clean, structured Q&A to cite. Inert unless the article defines
// `faq:` in its frontmatter.
//
// Visual treatment lives in Hex (`data-rig-faq*`) + Rig's structural styles —
// no per-site CSS. Replaces the hand-rolled `components/content/FaqBlock.vue`
// that shipped its own `<style scoped>` accordion.
//
// Requires the consumer app to provide the schema.org auto-imports
// (`useSchemaOrg` / `defineQuestion` from @nuxtjs/seo's nuxt-schema-org).
//
// Frontmatter:
//   faq:
//     - question: How do I get started?
//       answer: A short, direct answer that search and AI engines can cite.
const props = defineProps<{
  items: { question: string; answer: string }[]
}>()

if (import.meta.server && props.items?.length) {
  // useSchemaOrg + defineQuestion are auto-imported by nuxt-schema-org (@nuxtjs/seo)
  useSchemaOrg(
    props.items.map((f) => defineQuestion({ name: f.question, acceptedAnswer: f.answer })),
  )
}
</script>

<template>
  <section v-if="items?.length" data-rig-faq aria-labelledby="faq-heading">
    <h2 id="faq-heading" data-rig-faq-heading>Frequently asked questions</h2>
    <details v-for="(f, i) in items" :key="i" data-rig-faq-item>
      <summary data-rig-faq-question>{{ f.question }}</summary>
      <div data-rig-faq-answer>{{ f.answer }}</div>
    </details>
  </section>
</template>
