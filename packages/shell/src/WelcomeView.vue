<!--
  WelcomeView — Generic dashboard/welcome screen for the IdeShell editor empty state.
  Provides header + stat grid + content sections + recent items list.
-->
<script setup lang="ts">
import { EmptyState } from '@extras/index'
import { StatCard } from '@data/index'

export interface StatItem {
  label: string
  value: string | number
  color?: string
}

defineProps<{
  /** Dashboard title */
  title?: string
  /** Subtitle or description */
  description?: string
  /** Stat cards to show */
  stats?: StatItem[]
  /** Whether the dashboard has no data */
  empty?: boolean
  /** Empty state title */
  emptyTitle?: string
  /** Empty state description */
  emptyDescription?: string
}>()

defineSlots<{
  /** Header area — overrides default title/description */
  header?: (props: Record<string, never>) => unknown
  /** Stats row — overrides default StatCard grid */
  stats?: (props: Record<string, never>) => unknown
  /** Main sections — domain cards, category cards, etc. */
  default?: (props: Record<string, never>) => unknown
  /** Recent items section */
  recent?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div data-rig-welcome-view>
    <!-- Header -->
    <div data-rig-welcome-view-header>
      <slot name="header">
        <h2 data-rig-welcome-view-title>{{ title }}</h2>
        <p v-if="description" data-rig-welcome-view-description>{{ description }}</p>
      </slot>
    </div>

    <template v-if="empty">
      <EmptyState :title="emptyTitle" :description="emptyDescription" />
    </template>

    <template v-else>
      <!-- Stats -->
      <div v-if="stats?.length || $slots.stats" data-rig-welcome-view-stats>
        <slot name="stats">
          <StatCard
            v-for="stat in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :color="stat.color"
          />
        </slot>
      </div>

      <!-- Sections -->
      <slot />

      <!-- Recent -->
      <slot name="recent" />
    </template>
  </div>
</template>
