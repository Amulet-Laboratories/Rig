<script setup lang="ts">
import ImagePreview from './ImagePreview.vue'
import { ref } from 'vue'

const zoomSrc = ref('')
</script>

<template>
  <Story title="ImagePreview" icon="lucide:image" group="extras">
    <Variant title="Default">
      <ImagePreview src="https://picsum.photos/400/300" alt="Random landscape" />
    </Variant>

    <Variant title="Fallback">
      <ImagePreview
        src="https://invalid-url.example/broken.jpg"
        fallback="https://picsum.photos/400/300?grayscale"
        alt="Image with fallback"
      />
    </Variant>

    <Variant title="Zoomable">
      <ImagePreview
        src="https://picsum.photos/400/300"
        alt="Zoomable image"
        zoomable
        @zoom="(src) => (zoomSrc = src)"
      />
      <div v-if="zoomSrc" style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        Zoom triggered for: {{ zoomSrc }}
      </div>
    </Variant>
  </Story>
</template>
