<script setup lang="ts">
import MiniBar from './MiniBar.vue'
import { ref } from 'vue'

const pgWidth = ref(120)
const pgHeight = ref(32)
const pgGap = ref(2)
</script>

<template>
  <Story title="MiniBar" icon="lucide:bar-chart" group="data">
    <Variant title="Default">
      <MiniBar :data="[12, 28, 18, 35, 22, 30, 15, 40, 25, 38]" />
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; flex-direction: column; gap: 16px">
        <div style="display: flex; align-items: center; gap: 12px; color: var(--foreground)">
          <span style="width: 80px; font-size: 13px">Small</span>
          <MiniBar :data="[5, 10, 8, 15, 12]" :width="80" :height="20" />
        </div>
        <div style="display: flex; align-items: center; gap: 12px; color: var(--foreground)">
          <span style="width: 80px; font-size: 13px">Default</span>
          <MiniBar :data="[5, 10, 8, 15, 12]" />
        </div>
        <div style="display: flex; align-items: center; gap: 12px; color: var(--foreground)">
          <span style="width: 80px; font-size: 13px">Large</span>
          <MiniBar :data="[5, 10, 8, 15, 12]" :width="200" :height="48" />
        </div>
      </div>
    </Variant>

    <Variant title="Inline with Text">
      <div style="display: flex; gap: 24px; color: var(--foreground)">
        <div style="display: flex; align-items: center; gap: 8px">
          CPU <MiniBar :data="[30, 45, 60, 40, 55, 70, 50]" :width="80" :height="20" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          Memory <MiniBar :data="[60, 62, 65, 63, 68, 70, 72]" :width="80" :height="20" />
        </div>
      </div>
    </Variant>

    <Variant title="Playground">
      <MiniBar
        :data="[12, 28, 18, 35, 22, 30, 15, 40, 25, 38]"
        :width="pgWidth"
        :height="pgHeight"
        :gap="pgGap"
      />

      <template #controls>
        <HstSlider v-model="pgWidth" title="Width" :min="60" :max="300" />
        <HstSlider v-model="pgHeight" title="Height" :min="16" :max="80" />
        <HstSlider v-model="pgGap" title="Gap" :min="0" :max="8" />
      </template>
    </Variant>
  </Story>
</template>
