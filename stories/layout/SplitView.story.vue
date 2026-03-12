<script setup lang="ts">
import { ref } from 'vue'
import SplitView from '@layout/SplitView.vue'
import type { Orientation } from '@core/types'
const orientation = ref<Orientation>('horizontal')
const sizes = ref([300, 300])
</script>

<template>
  <Story title="SplitView" icon="lucide:columns">
    <template #controls>
      <HstSelect
        v-model="orientation"
        title="Orientation"
        :options="['horizontal', 'vertical']"
      />
    </template>

    <Variant title="Two Panes">
      <div style="height: 400px">
        <SplitView
          v-model:sizes="sizes"
          :orientation="orientation"
          :min-sizes="[100, 100]"
          resizable
        >
          <template #pane-0>
            <div style="padding: 12px">Pane A ({{ sizes[0] }}px)</div>
          </template>
          <template #pane-1>
            <div style="padding: 12px">Pane B ({{ sizes[1] }}px)</div>
          </template>
        </SplitView>
      </div>
    </Variant>
  </Story>
</template>
