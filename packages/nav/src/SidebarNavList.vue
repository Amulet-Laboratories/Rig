<script setup lang="ts">
export interface SidebarNavItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Icon identifier (e.g. Iconify name) */
  icon?: string
}

withDefaults(
  defineProps<{
    /** Array of navigation items */
    items: SidebarNavItem[]
    /** Currently active item ID */
    activeId?: string
  }>(),
  { activeId: '' },
)

defineEmits<{
  select: [item: SidebarNavItem]
}>()
</script>

<template>
  <nav data-rig-sidebar-nav-list role="navigation">
    <button
      v-for="item in items"
      :key="item.id"
      data-rig-sidebar-nav-item
      :data-state="item.id === activeId ? 'active' : undefined"
      :title="item.label"
      :aria-current="item.id === activeId ? 'page' : undefined"
      @click="$emit('select', item)"
    >
      <slot name="icon" :item="item">
        <span v-if="item.icon" data-rig-sidebar-nav-icon>{{ item.icon }}</span>
      </slot>
      <span data-rig-sidebar-nav-label>{{ item.label }}</span>
    </button>
  </nav>
</template>
