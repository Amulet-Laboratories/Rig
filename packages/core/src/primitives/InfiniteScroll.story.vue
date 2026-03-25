<script setup lang="ts">
import InfiniteScroll from './InfiniteScroll.vue'
import { ref } from 'vue'

const items = ref(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
const loading = ref(false)
const allLoaded = ref(false)

function loadMore() {
  if (loading.value || allLoaded.value) return
  loading.value = true
  setTimeout(() => {
    const start = items.value.length
    const newItems = Array.from({ length: 10 }, (_, i) => `Item ${start + i + 1}`)
    items.value = [...items.value, ...newItems]
    loading.value = false
    if (items.value.length >= 100) {
      allLoaded.value = true
    }
  }, 1000)
}
</script>

<template>
  <Story title="InfiniteScroll" icon="lucide:arrow-down-to-line" group="core">
    <Variant title="Default">
      <div style="height: 400px; overflow: auto; border: 1px solid var(--border, #333)">
        <InfiniteScroll :loading="loading" :disabled="allLoaded" @load-more="loadMore">
          <div
            v-for="item in items"
            :key="item"
            style="padding: 12px 16px; border-bottom: 1px solid var(--border, #222)"
          >
            {{ item }}
          </div>

          <template #loading>
            <div style="padding: 16px; text-align: center; color: var(--muted-foreground)">
              Loading more items...
            </div>
          </template>
        </InfiniteScroll>
        <div
          v-if="allLoaded"
          style="padding: 16px; text-align: center; color: var(--muted-foreground); font-size: 12px"
        >
          All items loaded ({{ items.length }} total)
        </div>
      </div>
    </Variant>
  </Story>
</template>
