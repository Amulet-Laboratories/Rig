<script setup lang="ts">
import { useRuntimeConfig } from '#imports'

const props = defineProps<{
  quizSlug: string
  quizTitle: string
  description: string
  resultCount?: number
}>()

const config = useRuntimeConfig()
const quizOrigin = (config.public.quizEmbedOrigin as string) || 'https://quizsort.com'
const quizUrl = `${quizOrigin}/quiz/${props.quizSlug}`
</script>

<template>
  <a :href="quizUrl" target="_blank" rel="noopener" data-rig-quiz-promo>
    <div data-rig-quiz-promo-icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
    <div data-rig-quiz-promo-content>
      <span data-rig-quiz-promo-badge>Quiz</span>
      <span data-rig-quiz-promo-title>{{ quizTitle }}</span>
      <span data-rig-quiz-promo-description>{{ description }}</span>
    </div>
    <div data-rig-quiz-promo-arrow>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </div>
  </a>
</template>
