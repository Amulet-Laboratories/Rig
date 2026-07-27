<script setup lang="ts">
import { Icon } from '@amulet-laboratories/rig'

defineProps<{ icon: string }>()
</script>

<template>
  <Icon v-if="icon === 'home'" icon="heroicons:home" aria-hidden="true" />
  <Icon v-else-if="icon === 'scroll'" icon="heroicons:document-text" aria-hidden="true" />
  <Icon v-else icon="heroicons:building-office-2" aria-hidden="true" />
</template>
