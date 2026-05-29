<script setup lang="ts">
import PointCloud from './PointCloud.vue'

const data = Array.from({ length: 200 }, () => ({
  x: Math.random() * 500,
  y: Math.random() * 400,
  z: Math.random() * 100,
  color: `hsl(${Math.random() * 360}, 60%, 60%)`,
  size: Math.random() * 4 + 1,
}))
</script>

<template>
  <Story title="PointCloud" icon="lucide:cloud" group="spatial">
    <Variant title="Default">
      <PointCloud :data="data" :width="500" :height="400" />
    </Variant>

    <Variant title="Dense">
      <PointCloud :data="data" :width="500" :height="400" density />
    </Variant>

    <Variant title="Large Points">
      <PointCloud :data="data.slice(0, 50)" :width="500" :height="400" :point-size="5" />
    </Variant>
  </Story>
</template>
