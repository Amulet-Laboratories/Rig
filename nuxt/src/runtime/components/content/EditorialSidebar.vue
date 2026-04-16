<script setup lang="ts">
interface Props {
  author: string
  role?: string
  blurb?: string
}

defineProps<Props>()
</script>

<template>
  <div data-rig-editorial-sidebar>
    <div data-rig-editorial-sidebar-header>
      <slot name="avatar">
        <div data-rig-editorial-sidebar-avatar aria-hidden="true">
          {{ author.charAt(0) }}
        </div>
      </slot>
      <div data-rig-editorial-sidebar-identity>
        <span data-rig-editorial-sidebar-name>{{ author }}</span>
        <span v-if="role" data-rig-editorial-sidebar-role>{{ role }}</span>
      </div>
    </div>
    <p v-if="blurb" data-rig-editorial-sidebar-blurb>{{ blurb }}</p>
    <slot />
  </div>
</template>
