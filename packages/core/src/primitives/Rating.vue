<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current rating value */
    modelValue?: number
    /** Maximum number of stars */
    max?: number
    /** Whether the rating is read-only */
    readonly?: boolean
    /** Whether the rating is disabled */
    disabled?: boolean
    /** Allow half-star values */
    precision?: 0.5 | 1
    /** Accessible label */
    ariaLabel?: string
  }>(),
  {
    modelValue: 0,
    max: 5,
    readonly: false,
    disabled: false,
    precision: 1,
    ariaLabel: 'Rating',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

defineSlots<{
  star?: (props: { index: number; filled: boolean; half: boolean }) => unknown
}>()

const hovered = ref(-1)

const stars = computed(() =>
  Array.from({ length: props.max }, (_, i) => {
    const starValue = i + 1
    const displayValue = hovered.value >= 0 ? hovered.value : props.modelValue
    return {
      index: i,
      value: starValue,
      filled: displayValue >= starValue,
      half: props.precision === 0.5 && displayValue >= starValue - 0.5 && displayValue < starValue,
    }
  }),
)

function onSelect(value: number) {
  if (props.readonly || props.disabled) return
  emit('update:modelValue', value)
}

function onHover(value: number) {
  if (props.readonly || props.disabled) return
  hovered.value = value
}

function onLeave() {
  hovered.value = -1
}

function onKeydown(e: KeyboardEvent) {
  if (props.readonly || props.disabled) return
  const step = props.precision === 0.5 ? 0.5 : 1
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      e.preventDefault()
      emit('update:modelValue', Math.min(props.modelValue + step, props.max))
      break
    case 'ArrowLeft':
    case 'ArrowDown':
      e.preventDefault()
      emit('update:modelValue', Math.max(props.modelValue - step, 0))
      break
    case 'Home':
      e.preventDefault()
      emit('update:modelValue', 0)
      break
    case 'End':
      e.preventDefault()
      emit('update:modelValue', props.max)
      break
  }
}
</script>

<template>
  <div
    data-rig-rating
    :data-readonly="readonly || undefined"
    :data-disabled="disabled || undefined"
    role="slider"
    :aria-label="ariaLabel"
    :aria-valuenow="modelValue"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :tabindex="disabled ? -1 : 0"
    @mouseleave="onLeave"
    @keydown="onKeydown"
  >
    <span
      v-for="star in stars"
      :key="star.index"
      data-rig-rating-star
      :data-filled="star.filled || undefined"
      :data-half="star.half || undefined"
      :aria-hidden="true"
      @click="onSelect(star.value)"
      @mouseenter="onHover(star.value)"
    >
      <slot name="star" :index="star.index" :filled="star.filled" :half="star.half"> &#9733; </slot>
    </span>
  </div>
</template>
