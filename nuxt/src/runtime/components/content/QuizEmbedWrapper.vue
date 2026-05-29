<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const props = defineProps<{
  quizSlug: string
  heading?: string
  cta?: string
}>()

const config = useRuntimeConfig()
const quizOrigin = (config.public.quizEmbedOrigin as string) || 'https://quizsort.com'

const containerRef = ref<HTMLElement>()
const iframeHeight = ref(400)
const isVisible = ref(false)

const embedUrl = `${quizOrigin}/embed/${props.quizSlug}`

const handleMessage = (event: MessageEvent) => {
  if (event.origin !== quizOrigin) return
  if (event.data?.type === 'quizsort:resize' && event.data?.slug === props.quizSlug) {
    iframeHeight.value = event.data.height
  }
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  window.addEventListener('message', handleMessage)

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '200px' },
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
  observer?.disconnect()
})
</script>

<template>
  <section ref="containerRef" data-rig-quiz-embed>
    <h3 v-if="heading" data-rig-quiz-embed-heading>{{ heading }}</h3>
    <p v-if="cta" data-rig-quiz-embed-cta>{{ cta }}</p>
    <iframe
      v-if="isVisible"
      :src="embedUrl"
      :title="`Quiz: ${heading || quizSlug}`"
      :style="{ height: `${iframeHeight}px` }"
      width="100%"
      frameborder="0"
      loading="lazy"
      allow="clipboard-write"
      data-rig-quiz-embed-frame
    />
  </section>
</template>
