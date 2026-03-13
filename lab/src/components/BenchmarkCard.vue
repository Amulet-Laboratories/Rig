<script setup lang="ts">
import type { BenchmarkResult } from '../types'

defineProps<{
  results: BenchmarkResult[]
}>()

function formatHz(hz: number): string {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(1)}M`
  if (hz >= 1_000) return `${(hz / 1_000).toFixed(1)}K`
  return hz.toFixed(0)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 0.5rem">
    <div
      v-for="result in results"
      :key="result.name"
      style="
        display: grid;
        grid-template-columns: 1fr auto auto auto;
        gap: 1rem;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.25rem;
        background: rgba(255, 255, 255, 0.02);
        font-size: 0.75rem;
      "
    >
      <span style="opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
        {{ result.name }}
      </span>
      <span style="font-variant-numeric: tabular-nums; color: #4ade80; font-weight: 600">
        {{ formatHz(result.hz) }} ops/s
      </span>
      <span style="font-variant-numeric: tabular-nums; opacity: 0.5">
        mean {{ result.mean.toFixed(3) }}ms
      </span>
      <span style="font-variant-numeric: tabular-nums; opacity: 0.5">
        p99 {{ result.p99.toFixed(3) }}ms
      </span>
    </div>
    <div
      v-if="results.length === 0"
      style="opacity: 0.4; font-size: 0.75rem; text-align: center; padding: 0.5rem"
    >
      No benchmark results available
    </div>
  </div>
</template>
