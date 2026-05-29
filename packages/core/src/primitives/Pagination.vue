<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current page (1-based) */
    modelValue?: number
    /** Total number of items */
    total?: number
    /** Items per page */
    pageSize?: number
    /** Maximum visible page buttons (excluding prev/next) */
    siblingCount?: number
    /** Whether pagination controls are disabled */
    disabled?: boolean
  }>(),
  {
    modelValue: 1,
    total: 0,
    pageSize: 10,
    siblingCount: 1,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const pages = computed(() => {
  const total = totalPages.value
  const current = props.modelValue
  const sibling = props.siblingCount

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  // If total pages fit within the visible window, show all
  const totalSlots = sibling * 2 + 5 // siblings + first + last + 2 ellipses + current
  if (total <= totalSlots) return range(1, total)

  const leftSibling = Math.max(current - sibling, 2)
  const rightSibling = Math.min(current + sibling, total - 1)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  const result: (number | '...')[] = [1]

  if (showLeftEllipsis) {
    result.push('...')
  } else {
    for (let i = 2; i < leftSibling; i++) result.push(i)
  }

  for (let i = leftSibling; i <= rightSibling; i++) result.push(i)

  if (showRightEllipsis) {
    result.push('...')
  } else {
    for (let i = rightSibling + 1; i < total; i++) result.push(i)
  }

  result.push(total)
  return result
})

function goTo(page: number) {
  if (props.disabled) return
  const clamped = Math.min(Math.max(1, page), totalPages.value)
  if (clamped !== props.modelValue) {
    emit('update:modelValue', clamped)
  }
}
</script>

<template>
  <nav
    data-rig-pagination
    :data-disabled="disabled || undefined"
    role="navigation"
    aria-label="Pagination"
  >
    <button
      data-rig-pagination-prev
      :disabled="modelValue <= 1 || disabled"
      :aria-disabled="modelValue <= 1 || disabled"
      aria-label="Previous page"
      @click="goTo(modelValue - 1)"
    >
      <slot name="prev">&lsaquo;</slot>
    </button>
    <template v-for="(page, i) in pages" :key="i">
      <span v-if="page === '...'" data-rig-pagination-ellipsis aria-hidden="true">&hellip;</span>
      <button
        v-else
        data-rig-pagination-page
        :data-active="page === modelValue || undefined"
        :aria-current="page === modelValue ? 'page' : undefined"
        :disabled="disabled"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>
    <button
      data-rig-pagination-next
      :disabled="modelValue >= totalPages || disabled"
      :aria-disabled="modelValue >= totalPages || disabled"
      aria-label="Next page"
      @click="goTo(modelValue + 1)"
    >
      <slot name="next">&rsaquo;</slot>
    </button>
  </nav>
</template>
