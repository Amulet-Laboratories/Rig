<script setup lang="ts">
import { ref } from 'vue'
import Skeleton from '@extras/Skeleton.vue'
const lines = ref(3)
const animate = ref(true)
</script>

<template>
  <Story title="Skeleton" icon="lucide:loader">
    <template #controls>
      <HstNumber v-model="lines" title="Lines" />
      <HstCheckbox v-model="animate" title="Animate" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 400px">
        <Skeleton :lines="lines" :animate="animate" />
      </div>
    </Variant>

    <Variant title="Card Layout">
      <div style="padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 12px">
        <Skeleton :lines="1" :width="['60%']" />
        <Skeleton :lines="3" />
        <Skeleton :lines="1" :width="['40%']" />
      </div>
    </Variant>
  </Story>
</template>
