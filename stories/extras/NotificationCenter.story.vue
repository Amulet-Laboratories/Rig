<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import NotificationCenter from '@extras/NotificationCenter.vue'
import { useNotifications } from '@extras/useNotifications'

const { theme, themeOptions } = useHexTheme()

const { push } = useNotifications()

function addNotification() {
  push({
    message: 'Project compiled successfully.',
    variant: 'info',
  })
}
</script>

<template>
  <Story title="Extras / NotificationCenter" icon="lucide:bell">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Interactive">
      <div style="display: flex; align-items: center; gap: 16px; padding: 16px">
        <button @click="addNotification">Add Notification</button>
        <NotificationCenter />
      </div>
    </Variant>
  </Story>
</template>
