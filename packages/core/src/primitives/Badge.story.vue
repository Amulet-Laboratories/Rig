<script setup lang="ts">
import Badge from './Badge.vue'
import type { Size } from '../types'
import { ref } from 'vue'

const variant = ref('default')
const size = ref<Size>('md')
const label = ref('Badge')
</script>

<template>
  <Story title="Badge" icon="lucide:tag" group="core">
    <Variant title="Default">
      <Badge>Badge</Badge>
    </Variant>

    <Variant title="Variants">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 8px; align-items: center">
        <Badge size="xs">XS</Badge>
        <Badge size="sm">SM</Badge>
        <Badge size="md">MD</Badge>
        <Badge size="lg">LG</Badge>
      </div>
    </Variant>

    <Variant title="Playground">
      <Badge :variant="variant" :size="size">{{ label }}</Badge>

      <template #controls>
        <HstText v-model="label" title="Label" />
        <HstSelect
          v-model="variant"
          title="Variant"
          :options="[
            'default',
            'primary',
            'secondary',
            'destructive',
            'outline',
            'success',
            'warning',
          ]"
        />
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
      </template>
    </Variant>
  </Story>
</template>
