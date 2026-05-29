<script setup lang="ts">
import Icon from './Icon.vue'
import { ref } from 'vue'

const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const icon = ref('lucide:star')
</script>

<template>
  <Story title="Icon" icon="lucide:image" group="core">
    <Variant title="Default">
      <Icon icon="lucide:star" label="Star" />
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 12px; align-items: center; color: var(--foreground)">
        <Icon icon="lucide:heart" size="xs" label="XS" />
        <Icon icon="lucide:heart" size="sm" label="SM" />
        <Icon icon="lucide:heart" size="md" label="MD" />
        <Icon icon="lucide:heart" size="lg" label="LG" />
      </div>
    </Variant>

    <Variant title="Various Icons">
      <div style="display: flex; gap: 12px; align-items: center; color: var(--foreground)">
        <Icon icon="lucide:home" label="Home" />
        <Icon icon="lucide:settings" label="Settings" />
        <Icon icon="lucide:search" label="Search" />
        <Icon icon="lucide:bell" label="Bell" />
        <Icon icon="lucide:user" label="User" />
        <Icon icon="lucide:folder" label="Folder" />
      </div>
    </Variant>

    <Variant title="Playground">
      <Icon :icon="icon" :size="size" label="Playground icon" />

      <template #controls>
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
        <HstSelect
          v-model="icon"
          title="Icon"
          :options="[
            'lucide:star',
            'lucide:heart',
            'lucide:home',
            'lucide:settings',
            'lucide:search',
            'lucide:bell',
          ]"
        />
      </template>
    </Variant>
  </Story>
</template>
