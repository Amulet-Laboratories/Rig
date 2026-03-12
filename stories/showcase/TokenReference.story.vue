<script setup lang="ts">
/**
 * Token Reference — Interactive documentation of all design tokens.
 * Shows each token's CSS variable, current value, and a live preview swatch.
 */
import { ref, computed, onMounted } from 'vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Input from '@core/primitives/Input.vue'

interface TokenEntry {
  name: string
  variable: string
  category: string
}

const filter = ref('')

const tokens: TokenEntry[] = [
  // Background
  { name: 'background', variable: '--color-background', category: 'Surface' },
  { name: 'foreground', variable: '--color-foreground', category: 'Surface' },
  { name: 'muted', variable: '--color-muted', category: 'Surface' },
  { name: 'muted-foreground', variable: '--color-muted-foreground', category: 'Surface' },
  { name: 'card', variable: '--color-card', category: 'Surface' },
  { name: 'card-foreground', variable: '--color-card-foreground', category: 'Surface' },
  { name: 'popover', variable: '--color-popover', category: 'Surface' },
  { name: 'popover-foreground', variable: '--color-popover-foreground', category: 'Surface' },

  // Interactive
  { name: 'primary', variable: '--color-primary', category: 'Interactive' },
  { name: 'primary-foreground', variable: '--color-primary-foreground', category: 'Interactive' },
  { name: 'secondary', variable: '--color-secondary', category: 'Interactive' },
  { name: 'secondary-foreground', variable: '--color-secondary-foreground', category: 'Interactive' },
  { name: 'accent', variable: '--color-accent', category: 'Interactive' },
  { name: 'accent-foreground', variable: '--color-accent-foreground', category: 'Interactive' },

  // Feedback
  { name: 'destructive', variable: '--color-destructive', category: 'Feedback' },
  { name: 'destructive-foreground', variable: '--color-destructive-foreground', category: 'Feedback' },
  { name: 'success', variable: '--color-success', category: 'Feedback' },
  { name: 'warning', variable: '--color-warning', category: 'Feedback' },
  { name: 'info', variable: '--color-info', category: 'Feedback' },

  // Structure
  { name: 'border', variable: '--color-border', category: 'Structure' },
  { name: 'input', variable: '--color-input', category: 'Structure' },
  { name: 'ring', variable: '--color-ring', category: 'Structure' },

  // Typography
  { name: 'radius', variable: '--radius', category: 'Typography' },
  { name: 'font-sans', variable: '--font-sans', category: 'Typography' },
  { name: 'font-mono', variable: '--font-mono', category: 'Typography' },
]

const categories = computed(() => {
  const cats = new Map<string, TokenEntry[]>()
  for (const t of filteredTokens.value) {
    const list = cats.get(t.category) ?? []
    list.push(t)
    cats.set(t.category, list)
  }
  return cats
})

const filteredTokens = computed(() => {
  const q = filter.value.toLowerCase()
  if (!q) return tokens
  return tokens.filter(
    (t) => t.name.includes(q) || t.variable.includes(q) || t.category.toLowerCase().includes(q),
  )
})

const resolvedValues = ref<Record<string, string>>({})

onMounted(() => {
  const root = document.documentElement
  const styles = getComputedStyle(root)
  for (const t of tokens) {
    resolvedValues.value[t.variable] = styles.getPropertyValue(t.variable).trim() || '(unset)'
  }
})

function isColor(variable: string): boolean {
  return variable.startsWith('--color-')
}

function copyVariable(variable: string) {
  navigator.clipboard.writeText(`var(${variable})`)
}
</script>

<template>
  <Story title="Token Reference" icon="lucide:book-open" group="showcase">
    <div class="token-ref">
      <div class="token-ref-header">
        <h2 class="token-ref-title">Design Tokens</h2>
        <Input
          v-model="filter"
          placeholder="Filter tokens..."
          class="token-ref-filter"
        />
      </div>

      <div v-for="[category, items] of categories" :key="category" class="token-category">
        <h3 class="token-category-title">
          {{ category }}
          <Badge>{{ items.length }}</Badge>
        </h3>

        <div class="token-list">
          <div
            v-for="token in items"
            :key="token.variable"
            class="token-entry"
            @click="copyVariable(token.variable)"
            title="Click to copy"
          >
            <div
              v-if="isColor(token.variable)"
              class="token-swatch"
              :style="{ background: `var(${token.variable})` }"
            />
            <div v-else class="token-swatch token-swatch-text">
              {{ resolvedValues[token.variable]?.slice(0, 3) ?? '—' }}
            </div>
            <div class="token-info">
              <span class="token-name">{{ token.name }}</span>
              <code class="token-var">var({{ token.variable }})</code>
            </div>
            <code class="token-value">{{ resolvedValues[token.variable] ?? '—' }}</code>
          </div>
        </div>
      </div>
    </div>
  </Story>
</template>

<style scoped>
.token-ref {
  padding: 16px;
  max-width: 800px;
}

.token-ref-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.token-ref-title {
  font-family: var(--font-mono, monospace);
  font-size: 18px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0;
}

.token-ref-filter {
  max-width: 240px;
}

.token-category {
  margin-bottom: 24px;
}

.token-category-title {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground, #888);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.token-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius, 4px);
  cursor: pointer;
  transition: background 0.1s;
}

.token-entry:hover {
  background: var(--color-muted, #262626);
}

.token-swatch {
  width: 32px;
  height: 32px;
  border-radius: var(--radius, 4px);
  border: 1px solid var(--color-border, #333);
  flex-shrink: 0;
}

.token-swatch-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-family: var(--font-mono, monospace);
  color: var(--color-muted-foreground, #888);
  background: var(--color-muted, #262626);
}

.token-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.token-name {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-foreground, #d4d4d4);
}

.token-var {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

.token-value {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-primary, #c9956d);
  flex-shrink: 0;
}
</style>
