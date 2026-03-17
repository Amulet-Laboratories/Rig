<script setup lang="ts">
import Transfer from './Transfer.vue'
import { ref } from 'vue'

const defaultSource = ref([
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
  { id: 4, label: 'Date' },
  { id: 5, label: 'Elderberry' },
])
const defaultTarget = ref<{ id: string | number; label: string }[]>([])

const preSource = ref([
  { id: 1, label: 'JavaScript' },
  { id: 2, label: 'TypeScript' },
  { id: 3, label: 'Rust' },
])
const preTarget = ref([
  { id: 4, label: 'Python' },
  { id: 5, label: 'Go' },
])
</script>

<template>
  <Story title="Transfer" icon="lucide:arrow-left-right" group="core">
    <Variant title="Default">
      <Transfer v-model:source-items="defaultSource" v-model:target-items="defaultTarget" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Source: {{ defaultSource.map((i) => i.label).join(', ') || '(empty)' }} | Target:
        {{ defaultTarget.map((i) => i.label).join(', ') || '(empty)' }}
      </div>
    </Variant>

    <Variant title="Pre-populated">
      <Transfer v-model:source-items="preSource" v-model:target-items="preTarget" />
    </Variant>

    <Variant title="Disabled">
      <Transfer
        :source-items="[
          { id: 1, label: 'Item A' },
          { id: 2, label: 'Item B' },
        ]"
        :target-items="[{ id: 3, label: 'Item C' }]"
        disabled
      />
    </Variant>
  </Story>
</template>
