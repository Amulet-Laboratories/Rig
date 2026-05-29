<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { Button } from '@amulet-laboratories/rig'

const props = defineProps<{
  quizSlug: string
  heading?: string
}>()

const config = useRuntimeConfig()
const quizOrigin = (config.public.quizEmbedOrigin as string) || 'https://quizsort.com'

const resultKey = `quizsort-result-${props.quizSlug}`
const result = ref<string | null>(null)
const showQuiz = ref(false)

onMounted(() => {
  result.value = localStorage.getItem(resultKey)

  window.addEventListener('message', (event) => {
    if (event.origin !== quizOrigin) return
    if (event.data?.type === 'quizsort:result' && event.data?.slug === props.quizSlug) {
      result.value = event.data.character
      localStorage.setItem(resultKey, event.data.character)
      showQuiz.value = false
    }
  })
})

const resultLabel = computed(
  () =>
    result.value
      ?.replace(/-/g, ' ')
      .replace(/\bthe\b/gi, '')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? '',
)
</script>

<template>
  <section data-rig-quiz-gated>
    <template v-if="result">
      <div data-rig-quiz-gated-result>
        <span data-rig-quiz-gated-badge>Your result: {{ resultLabel }}</span>
        <slot :result="result" />
      </div>
    </template>
    <template v-else-if="showQuiz">
      <iframe
        :src="`${quizOrigin}/embed/${quizSlug}`"
        width="100%"
        height="600"
        frameborder="0"
        loading="lazy"
        allow="clipboard-write"
        data-rig-quiz-embed-frame
      />
    </template>
    <template v-else>
      <div data-rig-quiz-gated-prompt>
        <h3 v-if="heading">{{ heading }}</h3>
        <p>Take a quick quiz to get recommendations tailored to your style.</p>
        <Button variant="primary" @click="showQuiz = true"> Take the Quiz </Button>
      </div>
    </template>
  </section>
</template>
