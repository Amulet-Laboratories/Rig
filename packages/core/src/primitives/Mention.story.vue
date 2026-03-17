<script setup lang="ts">
import Mention from './Mention.vue'
import { ref } from 'vue'

const defaultText = ref('')
const customText = ref('')

const users = [
  { id: 1, label: 'Alice' },
  { id: 2, label: 'Bob' },
  { id: 3, label: 'Charlie' },
  { id: 4, label: 'Diana' },
  { id: 5, label: 'Eve' },
]

const tags = [
  { id: 1, label: 'bug' },
  { id: 2, label: 'feature' },
  { id: 3, label: 'docs' },
  { id: 4, label: 'chore' },
]
</script>

<template>
  <Story title="Mention" icon="lucide:at-sign" group="core">
    <Variant title="Default">
      <Mention v-model="defaultText" :items="users" placeholder="Type @ to mention someone" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: "{{ defaultText }}"
      </div>
    </Variant>

    <Variant title="Custom Trigger">
      <Mention v-model="customText" trigger="#" :items="tags" placeholder="Type # to add a tag" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: "{{ customText }}"
      </div>
    </Variant>

    <Variant title="Disabled">
      <Mention
        model-value="Hello @Alice"
        :items="users"
        disabled
        placeholder="Disabled mention input"
      />
    </Variant>
  </Story>
</template>
