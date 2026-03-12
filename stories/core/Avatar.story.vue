<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '@core/primitives/Avatar.vue'
import type { Size } from '@core/types'

const size = ref<Size>('md')
const status = ref<'online' | 'away' | 'dnd' | 'offline' | ''>('')

const users = [
  { name: 'Elara Voss', color: '#7c3aed' },
  { name: 'Caspian Hale', color: '#0891b2' },
  { name: 'Rowan Blackwood', color: '#b45309' },
  { name: 'Ivy Delacroix', color: '#059669' },
  { name: 'Jasper Thorne', color: '#dc2626' },
  { name: 'Luna Ashford' },
  { name: 'Marcus Chen' },
  { name: 'Sage Whitaker' },
]
</script>

<template>
  <Story title="Avatar" icon="lucide:user-circle">
    <template #controls>
      <HstSelect
        v-model="size"
        title="Size"
        :options="['xs', 'sm', 'md', 'lg', 'xl']"
      />
      <HstSelect
        v-model="status"
        title="Status"
        :options="['', 'online', 'away', 'dnd', 'offline']"
      />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; display: flex; gap: 12px; align-items: center">
        <Avatar
          name="Elara Voss"
          :size="size"
          :status="(status as 'online' | 'away' | 'dnd' | 'offline') || undefined"
          color="#7c3aed"
        />
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 24px; display: flex; gap: 12px; align-items: center">
        <Avatar name="Elara Voss" size="xs" color="#7c3aed" />
        <Avatar name="Caspian Hale" size="sm" color="#0891b2" />
        <Avatar name="Rowan Blackwood" size="md" color="#b45309" />
        <Avatar name="Ivy Delacroix" size="lg" color="#059669" />
        <Avatar name="Jasper Thorne" size="xl" color="#dc2626" />
      </div>
    </Variant>

    <Variant title="Status Indicators">
      <div style="padding: 24px; display: flex; gap: 16px; align-items: center">
        <Avatar name="Online User" size="lg" status="online" color="#7c3aed" />
        <Avatar name="Away User" size="lg" status="away" color="#0891b2" />
        <Avatar name="Do Not Disturb" size="lg" status="dnd" color="#b45309" />
        <Avatar name="Offline User" size="lg" status="offline" color="#059669" />
      </div>
    </Variant>

    <Variant title="Auto-Color (from name hash)">
      <div style="padding: 24px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
        <Avatar
          v-for="user in users"
          :key="user.name"
          :name="user.name"
          :color="user.color"
          size="lg"
          status="online"
        />
      </div>
    </Variant>

    <Variant title="Group Stack">
      <div style="padding: 24px; display: flex">
        <div style="display: flex">
          <Avatar
            v-for="(user, i) in users.slice(0, 5)"
            :key="user.name"
            :name="user.name"
            :color="user.color"
            size="md"
            :style="{
              marginLeft: i > 0 ? '-8px' : '0',
              zIndex: 10 - i,
              border: '2px solid var(--color-background, #0f0d0a)',
              borderRadius: '9999px',
            }"
          />
        </div>
      </div>
    </Variant>
  </Story>
</template>
