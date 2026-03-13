<script setup lang="ts">
import type { TestMetrics } from '../types'

defineProps<{
  tests: TestMetrics
  expanded?: boolean
}>()
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 0.5rem">
    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem">
      <span
        style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #4ade80;
          font-weight: 600;
        "
      >
        {{ tests.passed }} passed
      </span>
      <span
        v-if="tests.failed > 0"
        style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #f87171;
          font-weight: 600;
        "
      >
        {{ tests.failed }} failed
      </span>
      <span style="opacity: 0.4; font-size: 0.75rem; margin-left: auto">
        {{ tests.duration }}ms
      </span>
    </div>

    <div v-if="expanded" style="display: flex; flex-direction: column; gap: 0.125rem">
      <div
        v-for="test in tests.names"
        :key="test.name"
        style="
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          border-radius: 0.25rem;
          background: rgba(255, 255, 255, 0.02);
        "
      >
        <span
          :style="{
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            background: test.status === 'passed' ? '#4ade80' : '#f87171',
            flexShrink: 0,
          }"
        />
        <span style="flex: 1; opacity: 0.8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
          {{ test.name }}
        </span>
        <span style="opacity: 0.4; font-variant-numeric: tabular-nums; flex-shrink: 0">
          {{ test.duration }}ms
        </span>
      </div>
    </div>
  </div>
</template>
