<script setup lang="ts">
/**
 * RecordViewer — renders a mock vault record with fields, tags, and body.
 * Modeled after Obelisk's RecordViewer, using Rig primitives.
 * Reusable across showcase stories.
 */
import type { RecordContent } from '../fixtures/obelisk-records'
import Badge from '@core/primitives/Badge.vue'
import Divider from '@core/primitives/Divider.vue'

defineProps<{
  record: RecordContent
}>()

const emit = defineEmits<{
  edit: []
}>()

function formatKey(key: string): string {
  return key.replace(/-/g, ' ')
}

function formatValue(value: string | number | boolean | string[]): string {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
</script>

<template>
  <div class="showcase-record-viewer">
    <!-- Record header -->
    <div class="showcase-record-header">
      <div class="showcase-record-title-row">
        <h1 class="showcase-record-name">{{ record.name }}</h1>
        <button class="showcase-record-edit-btn" @click="emit('edit')">edit</button>
      </div>
      <div class="showcase-record-meta">
        <span class="showcase-record-id">{{ record.id }}</span>
        <Badge v-if="record.status" :variant="record.status">{{ record.status }}</Badge>
      </div>
    </div>

    <Divider />

    <div class="showcase-record-body">
      <!-- Fields -->
      <section class="showcase-record-section">
        <h2 class="showcase-record-section-title">Fields</h2>
        <div class="showcase-record-fields">
          <div v-for="(value, key) in record.fields" :key="key" class="showcase-record-field">
            <span class="showcase-record-field-key">{{ formatKey(key as string) }}</span>
            <span class="showcase-record-field-value">{{ formatValue(value) }}</span>
          </div>
        </div>
      </section>

      <!-- Tags -->
      <section v-if="record.tags && record.tags.length > 0" class="showcase-record-section">
        <h2 class="showcase-record-section-title">Tags</h2>
        <div class="showcase-record-tags">
          <Badge v-for="tag in record.tags" :key="tag" variant="muted">{{ tag }}</Badge>
        </div>
      </section>

      <!-- Body (rendered as plain text — no markdown renderer in Rig) -->
      <section class="showcase-record-section">
        <h2 class="showcase-record-section-title">Body</h2>
        <pre class="showcase-record-content">{{ record.body }}</pre>
      </section>
    </div>
  </div>
</template>
