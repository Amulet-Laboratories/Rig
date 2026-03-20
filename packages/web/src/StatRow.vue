<script setup lang="ts">
/**
 * StatRow — horizontal stats strip for marketing sites.
 *
 * Renders a grid of stat items (value + label) with responsive 2→4 columns.
 * Three variants: bordered (border-y + card bg), card (card bg only),
 * filled (primary bg with inverted text).
 *
 * Slots:
 *   #stat({ stat }) — override individual stat rendering
 */
export interface WebStatItem {
  value: string
  label: string
  change?: string
}

defineProps<{
  /** Array of stat items to display. */
  stats: WebStatItem[]
  /** Visual variant. */
  variant?: 'bordered' | 'card' | 'filled'
}>()
</script>

<template>
  <section data-rig-stat-row :data-variant="variant ?? 'bordered'">
    <div data-rig-stat-row-container>
      <div v-for="stat in stats" :key="stat.label" data-rig-stat-row-item>
        <slot name="stat" :stat="stat">
          <span data-rig-stat-row-value>{{ stat.value }}</span>
          <span data-rig-stat-row-label>{{ stat.label }}</span>
          <span v-if="stat.change" data-rig-stat-row-change>{{ stat.change }}</span>
        </slot>
      </div>
    </div>
  </section>
</template>
