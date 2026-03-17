<script setup lang="ts">
import Rating from './Rating.vue'
import { ref } from 'vue'

const defaultRating = ref(3)
const halfRating = ref(2.5)
const playRating = ref(3)
const max = ref(5)
const precision = ref<0.5 | 1>(1)
const readonly_ = ref(false)
const disabled = ref(false)
</script>

<template>
  <Story title="Rating" icon="lucide:star" group="core">
    <Variant title="Default">
      <Rating v-model="defaultRating" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ defaultRating }}
      </div>
    </Variant>

    <Variant title="Readonly">
      <Rating :model-value="4" readonly />
    </Variant>

    <Variant title="Half Stars">
      <Rating v-model="halfRating" :precision="0.5" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ halfRating }}
      </div>
    </Variant>

    <Variant title="Disabled">
      <Rating :model-value="2" disabled />
    </Variant>

    <Variant title="Custom Max">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Rating :model-value="7" :max="10" readonly />
        <Rating :model-value="2" :max="3" readonly />
      </div>
    </Variant>

    <Variant title="Playground">
      <Rating
        v-model="playRating"
        :max="max"
        :precision="precision"
        :readonly="readonly_"
        :disabled="disabled"
      />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ playRating }}
      </div>

      <template #controls>
        <HstSlider v-model="max" title="Max Stars" :min="1" :max="10" :step="1" />
        <HstSelect v-model="precision" title="Precision" :options="[1, 0.5]" />
        <HstCheckbox v-model="readonly_" title="Readonly" />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
