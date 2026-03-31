<script setup lang="ts">
const props = defineProps<{
  quizSlug: string
  siteSlug: string
}>()

const result = ref<string | null>(null)
const resultLabel = computed(
  () =>
    result.value
      ?.replace(/^the-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? '',
)

onMounted(() => {
  result.value = localStorage.getItem(`quizsort-result-${props.quizSlug}`)
})
</script>

<template>
  <div v-if="result" data-rig-personalized-hero>
    <span data-rig-persona-badge>Welcome back</span>
    <p data-rig-personalized-hero-text>
      Picks for <strong>{{ resultLabel }}</strong> readers
    </p>
    <NuxtLink :to="`/best-for/${result}`" data-rig-personalized-hero-link>
      See your personalized picks &rarr;
    </NuxtLink>
  </div>
</template>
