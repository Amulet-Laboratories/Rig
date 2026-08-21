<script setup lang="ts">
import { ref } from 'vue'
import Lightbox from './Lightbox.vue'

const open = ref(false)
const index = ref(0)

const items = Array.from({ length: 8 }, (_, i) => ({
  src: `https://picsum.photos/seed/rig-${i}/900/600`,
  alt: `Sample ${i + 1}`,
  caption: `Sample image ${i + 1} of 8`,
}))
</script>

<template>
  <Story title="Lightbox" icon="lucide:maximize-2" group="extras">
    <Variant title="Default">
      <button type="button" style="padding: 6px 12px" @click="open = true">
        Open lightbox at {{ index + 1 }}
      </button>
      <Lightbox v-model:open="open" v-model:index="index" :items="items" />
    </Variant>

    <Variant title="Extra slot (non-image stage)">
      <button type="button" style="padding: 6px 12px" @click="open = true">Open</button>
      <Lightbox v-model:open="open" v-model:index="index" :items="items">
        <template #extra="{ item, index: i }">
          <div
            style="
              width: 480px;
              height: 320px;
              display: grid;
              place-items: center;
              border: 1px dashed var(--border);
            "
          >
            A 3D viewer or video for {{ item.alt }} (item {{ i + 1 }}) renders here.
          </div>
        </template>
      </Lightbox>
    </Variant>
  </Story>
</template>
