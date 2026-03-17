<script setup lang="ts">
import Avatar from './Avatar.vue'
import { ref } from 'vue'

const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const status = ref<'online' | 'away' | 'dnd' | 'offline' | null>(null)
</script>

<template>
  <Story title="Avatar" icon="lucide:user-circle" group="core">
    <Variant title="Default">
      <Avatar name="Anthony Passanisi" />
    </Variant>

    <Variant title="With Image">
      <Avatar name="Anthony Passanisi" src="https://i.pravatar.cc/150?u=ap" />
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 12px; align-items: center">
        <Avatar name="XS" size="xs" />
        <Avatar name="SM" size="sm" />
        <Avatar name="MD" size="md" />
        <Avatar name="LG" size="lg" />
      </div>
    </Variant>

    <Variant title="Status">
      <div style="display: flex; gap: 12px; align-items: center">
        <Avatar name="Online" status="online" />
        <Avatar name="Away" status="away" />
        <Avatar name="DND" status="dnd" />
        <Avatar name="Offline" status="offline" />
      </div>
    </Variant>

    <Variant title="With Icon">
      <Avatar name="Bot" icon="lucide:bot" />
    </Variant>

    <Variant title="Playground">
      <Avatar name="Anthony Passanisi" :size="size" :status="status" />

      <template #controls>
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
        <HstSelect
          v-model="status"
          title="Status"
          :options="['online', 'away', 'dnd', 'offline']"
        />
      </template>
    </Variant>
  </Story>
</template>
