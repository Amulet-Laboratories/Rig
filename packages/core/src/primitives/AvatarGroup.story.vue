<script setup lang="ts">
import AvatarGroup from './AvatarGroup.vue'
import { ref } from 'vue'

const avatars = [
  { name: 'Alice', color: '#c9956d' },
  { name: 'Bob', color: '#6d8fc9' },
  { name: 'Charlie', color: '#6dc99e' },
  { name: 'Diana', color: '#c96d8f' },
  { name: 'Eve', color: '#c9c16d' },
  { name: 'Frank', color: '#8f6dc9' },
  { name: 'Grace', color: '#6dc9c1' },
]

const max = ref(5)
const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
</script>

<template>
  <Story title="AvatarGroup" icon="lucide:users" group="core">
    <Variant title="Default">
      <AvatarGroup :avatars="avatars" />
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <AvatarGroup :avatars="avatars" size="xs" />
        <AvatarGroup :avatars="avatars" size="sm" />
        <AvatarGroup :avatars="avatars" size="md" />
        <AvatarGroup :avatars="avatars" size="lg" />
      </div>
    </Variant>

    <Variant title="Max Visible">
      <div style="display: flex; flex-direction: column; gap: 12px">
        <AvatarGroup :avatars="avatars" :max="3" />
        <AvatarGroup :avatars="avatars" :max="5" />
        <AvatarGroup :avatars="avatars" :max="7" />
      </div>
    </Variant>

    <Variant title="Playground">
      <AvatarGroup :avatars="avatars" :max="max" :size="size" />

      <template #controls>
        <HstSlider v-model="max" title="Max" :min="1" :max="7" />
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
      </template>
    </Variant>
  </Story>
</template>
