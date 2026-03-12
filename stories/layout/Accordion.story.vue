<script setup lang="ts">
import { ref } from 'vue'
import Accordion from '@layout/Accordion.vue'
const value = ref<string | string[]>('item-1')
const type = ref<'single' | 'multiple'>('single')
const disabled = ref(false)

const items = [
  { id: 'item-1', title: 'What is Rig?', content: 'Rig is a headless, accessible Vue 3 component library with a VSCode-style layout system.' },
  { id: 'item-2', title: 'What is Hex?', content: 'Hex is a multi-theme CSS layer for Rig. It provides curated palettes targeting data-rig-* selectors.' },
  { id: 'item-3', title: 'How do themes work?', content: 'Themes define design tokens (ink, parchment, bronze) that automatically adapt all component styles through CSS custom properties.' },
]
</script>

<template>
  <Story title="Accordion" icon="lucide:list-collapse">
    <template #controls>
      <HstSelect v-model="type" title="Type" :options="['single', 'multiple']" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 500px">
        <Accordion v-model="value" :type="type" :disabled="disabled">
          <template #default="{ isOpen, toggle, headerId, panelId }">
            <div v-for="item in items" :key="item.id" style="border-bottom: 1px solid rgba(128,128,128,0.2)">
              <button
                :id="headerId(item.id)"
                :aria-expanded="isOpen(item.id)"
                :aria-controls="panelId(item.id)"
                style="width: 100%; text-align: left; padding: 12px 8px; cursor: pointer; font-weight: 500"
                @click="toggle(item.id)"
              >
                {{ isOpen(item.id) ? '▾' : '▸' }} {{ item.title }}
              </button>
              <div
                v-if="isOpen(item.id)"
                :id="panelId(item.id)"
                role="region"
                :aria-labelledby="headerId(item.id)"
                style="padding: 4px 8px 16px 20px"
              >
                {{ item.content }}
              </div>
            </div>
          </template>
        </Accordion>
      </div>
    </Variant>
  </Story>
</template>
