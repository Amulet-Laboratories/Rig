<script setup lang="ts">
import Skeleton from './Skeleton.vue'
import { ref } from 'vue'

const mode = ref<'skeleton' | 'shimmer'>('skeleton')
const animate = ref(true)
</script>

<template>
  <Story title="Skeleton" icon="lucide:loader" group="extras">
    <Variant title="Default">
      <div style="display: flex; flex-direction: column; gap: 8px; width: 300px">
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </div>
    </Variant>

    <Variant title="Multi-line">
      <div style="width: 300px">
        <Skeleton :lines="4" />
      </div>
    </Variant>

    <Variant title="Card Skeleton">
      <div
        style="
          width: 280px;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        "
      >
        <Skeleton height="120px" border-radius="4px" />
        <Skeleton width="70%" height="1.2rem" />
        <Skeleton :lines="2" />
        <div style="display: flex; gap: 8px">
          <Skeleton width="60px" height="28px" border-radius="4px" />
          <Skeleton width="60px" height="28px" border-radius="4px" />
        </div>
      </div>
    </Variant>

    <Variant title="Shimmer Mode">
      <div style="width: 300px">
        <Skeleton mode="shimmer" :lines="3" />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 300px">
        <Skeleton :mode="mode" :animate="animate" :lines="3" />
      </div>

      <template #controls>
        <HstSelect v-model="mode" title="Mode" :options="['skeleton', 'shimmer']" />
        <HstCheckbox v-model="animate" title="Animate" />
      </template>
    </Variant>
  </Story>
</template>
