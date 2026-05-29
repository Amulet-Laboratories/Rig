<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Selected date in ISO format (YYYY-MM-DD) */
    modelValue?: string | null
    /** Minimum selectable date */
    min?: string
    /** Maximum selectable date */
    max?: string
    /** Array of disabled dates */
    disabledDates?: string[]
    /** Placeholder text */
    placeholder?: string
  }>(),
  {
    modelValue: null,
    disabledDates: () => [],
    placeholder: 'Select date',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const open = ref(false)
const viewDate = ref(props.modelValue ? new Date(props.modelValue) : new Date())

const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())

const monthName = computed(() =>
  viewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const days = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const last = new Date(year.value, month.value + 1, 0)
  const startDay = first.getDay()
  const result: (string | null)[] = []

  for (let i = 0; i < startDay; i++) result.push(null)
  for (let d = 1; d <= last.getDate(); d++) {
    const iso = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    result.push(iso)
  }
  return result
})

function isDisabled(date: string | null): boolean {
  if (!date) return true
  if (props.min && date < props.min) return true
  if (props.max && date > props.max) return true
  return props.disabledDates.includes(date)
}

function isSelected(date: string | null): boolean {
  return date === props.modelValue
}

function isToday(date: string | null): boolean {
  if (!date) return false
  const today = new Date()
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return date === iso
}

function selectDate(date: string | null) {
  if (!date || isDisabled(date)) return
  emit('update:modelValue', date)
  open.value = false
}

function prevMonth() {
  viewDate.value = new Date(year.value, month.value - 1, 1)
}

function nextMonth() {
  viewDate.value = new Date(year.value, month.value + 1, 1)
}

function dayNumber(date: string): number {
  return parseInt(date.split('-')[2] ?? '', 10)
}

function toggle() {
  open.value = !open.value
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) viewDate.value = new Date(val)
  },
)
</script>

<template>
  <div
    data-rig-date-picker
    :data-state="open ? 'open' : 'closed'"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <button
      data-rig-date-picker-trigger
      type="button"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <span v-if="modelValue" data-rig-date-picker-value>{{ modelValue }}</span>
      <span v-else data-rig-date-picker-placeholder>{{ placeholder }}</span>
    </button>

    <div v-if="open" data-rig-date-picker-popover role="dialog" aria-label="Date picker">
      <div data-rig-date-picker-header>
        <button
          type="button"
          data-rig-date-picker-nav
          aria-label="Previous month"
          @click="prevMonth"
        >
          &lt;
        </button>
        <span data-rig-date-picker-month>{{ monthName }}</span>
        <button type="button" data-rig-date-picker-nav aria-label="Next month" @click="nextMonth">
          &gt;
        </button>
      </div>

      <div data-rig-date-picker-grid role="grid" :aria-label="monthName">
        <div data-rig-date-picker-weekdays>
          <span v-for="d in dayNames" :key="d" data-rig-date-picker-weekday>{{ d }}</span>
        </div>
        <div data-rig-date-picker-days>
          <button
            v-for="(day, i) in days"
            :key="i"
            type="button"
            data-rig-date-picker-day
            :data-disabled="day ? isDisabled(day) || undefined : undefined"
            :data-selected="day ? isSelected(day) || undefined : undefined"
            :data-today="day ? isToday(day) || undefined : undefined"
            :aria-selected="day ? isSelected(day) : undefined"
            :disabled="!day || isDisabled(day)"
            @click="selectDate(day)"
          >
            {{ day ? dayNumber(day) : '' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
