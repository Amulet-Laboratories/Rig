<script setup lang="ts">
/**
 * Performance Showcase — Demonstrates virtual scrolling with large data sets.
 * Uses Rig's useVirtualList composable for efficient rendering of 100k+ items.
 */
import { ref, computed, onMounted } from 'vue'
import { useVirtualList } from '@core/composables'
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Progress from '@core/primitives/Progress.vue'

// ---- Configuration ----
const itemCount = ref(10_000)
const itemHeight = 32
const renderStartTime = ref(0)
const renderEndTime = ref(0)
const isGenerating = ref(false)

// ---- Generate items ----
interface DataItem {
  id: string
  label: string
  value: number
  status: 'ok' | 'warn' | 'error'
}

const items = ref<DataItem[]>([])

function generateItems(count: number) {
  isGenerating.value = true
  renderStartTime.value = performance.now()

  const result: DataItem[] = new Array(count)
  for (let i = 0; i < count; i++) {
    const status = i % 100 === 0 ? 'error' : i % 17 === 0 ? 'warn' : 'ok'
    result[i] = {
      id: `item-${i}`,
      label: `Record #${i.toLocaleString()}`,
      value: Math.round(Math.random() * 1000),
      status,
    }
  }
  items.value = result

  requestAnimationFrame(() => {
    renderEndTime.value = performance.now()
    isGenerating.value = false
  })
}

// ---- Virtual list ----
const {
  containerRef: virtualContainerRef,
  virtualState,
  onScroll,
} = useVirtualList(() => items.value, {
  itemHeight,
  overscan: 5,
})

const visibleItems = computed(() => virtualState.value.items)
const totalHeight = computed(() => virtualState.value.totalHeight)
const paddingTop = computed(() => virtualState.value.paddingTop)

// ---- Stats ----
const renderTime = computed(() => {
  if (!renderEndTime.value || !renderStartTime.value) return 0
  return Math.round(renderEndTime.value - renderStartTime.value)
})

const domNodeCount = computed(() => visibleItems.value.length)

const statusColor = (s: string) =>
  s === 'error' ? 'var(--color-destructive, #e74c3c)' :
  s === 'warn' ? 'var(--color-warning, #f5a623)' :
  'var(--color-success, #4caf50)'

onMounted(() => generateItems(itemCount.value))
</script>

<template>
  <Story title="Performance" icon="lucide:zap" group="showcase">
    <div class="perf-showcase">
      <header class="perf-header">
        <h2 class="perf-title">Virtual Scrolling</h2>
        <p class="perf-desc">
          Scroll through {{ items.length.toLocaleString() }} items.
          Only {{ domNodeCount }} DOM nodes are rendered at any time.
        </p>
      </header>

      <!-- Controls -->
      <div class="perf-controls">
        <div class="perf-presets">
          <Button
            v-for="n in [1_000, 10_000, 50_000, 100_000]"
            :key="n"
            :variant="itemCount === n ? 'primary' : 'ghost'"
            @click="itemCount = n; generateItems(n)"
          >
            {{ (n / 1000).toFixed(0) }}k
          </Button>
        </div>

        <div class="perf-stats">
          <Card class="perf-stat">
            <span class="perf-stat-value">{{ items.length.toLocaleString() }}</span>
            <span class="perf-stat-label">Total Items</span>
          </Card>
          <Card class="perf-stat">
            <span class="perf-stat-value">{{ domNodeCount }}</span>
            <span class="perf-stat-label">DOM Nodes</span>
          </Card>
          <Card class="perf-stat">
            <span class="perf-stat-value">{{ renderTime }}ms</span>
            <span class="perf-stat-label">Gen + Render</span>
          </Card>
        </div>
      </div>

      <!-- Virtual list -->
      <div
        ref="virtualContainerRef"
        class="perf-list-container"
        @scroll="onScroll"
      >
        <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
          <div :style="{ transform: `translateY(${paddingTop}px)` }">
            <div
              v-for="vItem in visibleItems"
              :key="vItem.item.id"
              class="perf-list-item"
              :data-status="vItem.item.status"
            >
              <span class="perf-item-indicator" :style="{ background: statusColor(vItem.item.status) }" />
              <span class="perf-item-label">{{ vItem.item.label }}</span>
              <span class="perf-item-value">{{ vItem.item.value }}</span>
              <Badge v-if="vItem.item.status !== 'ok'">{{ vItem.item.status }}</Badge>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading overlay -->
      <div v-if="isGenerating" class="perf-loading">
        <Progress indeterminate />
        <span class="perf-loading-text">Generating {{ itemCount.toLocaleString() }} items...</span>
      </div>
    </div>
  </Story>
</template>

<style scoped>
.perf-showcase {
  padding: 16px;
  max-width: 720px;
  position: relative;
}

.perf-header {
  margin-bottom: 16px;
}

.perf-title {
  font-family: var(--font-mono, monospace);
  font-size: 18px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0 0 8px;
}

.perf-desc {
  font-size: 13px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
}

.perf-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.perf-presets {
  display: flex;
  gap: 8px;
}

.perf-stats {
  display: flex;
  gap: 8px;
}

.perf-stat {
  flex: 1;
  text-align: center;
  padding: 8px;
}

.perf-stat-value {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary, #c9956d);
}

.perf-stat-label {
  display: block;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground, #888);
  margin-top: 2px;
}

.perf-list-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
  background: var(--color-background, #1a1a1a);
}

.perf-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  border-bottom: 1px solid var(--color-border, #333);
}

.perf-list-item:hover {
  background: var(--color-muted, #262626);
}

.perf-item-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.perf-item-label {
  flex: 1;
  color: var(--color-foreground, #d4d4d4);
}

.perf-item-value {
  color: var(--color-muted-foreground, #888);
  font-size: 12px;
}

.perf-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--color-background, #1a1a1a);
  opacity: 0.9;
}

.perf-loading-text {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}
</style>
