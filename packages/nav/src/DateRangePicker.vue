<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Selected date range [start, end] */
    modelValue?: [string | null, string | null]
    /** Minimum selectable date */
    min?: string
    /** Maximum selectable date */
    max?: string
    /** Placeholder for start date */
    startPlaceholder?: string
    /** Placeholder for end date */
    endPlaceholder?: string
  }>(),
  {
    modelValue: () => [null, null] as [string | null, string | null],
    startPlaceholder: 'Start date',
    endPlaceholder: 'End date',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: [string | null, string | null]]
}>()

const open = ref(false)
const selecting = ref<'start' | 'end'>('start')
const viewDate = ref(props.modelValue[0] ? new Date(props.modelValue[0]) : new Date())

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
  return false
}

function isInRange(date: string | null): boolean {
  if (!date) return false
  const [start, end] = props.modelValue
  if (!start || !end) return false
  return date >= start && date <= end
}

function isRangeStart(date: string | null): boolean {
  return date === props.modelValue[0]
}

function isRangeEnd(date: string | null): boolean {
  return date === props.modelValue[1]
}

function selectDate(date: string | null) {
  if (!date || isDisabled(date)) return
  const [start, end] = props.modelValue

  if (selecting.value === 'start') {
    emit('update:modelValue', [date, end && date <= end ? end : null])
    selecting.value = 'end'
  } else {
    if (start && date >= start) {
      emit('update:modelValue', [start, date])
      selecting.value = 'start'
      open.value = false
    } else {
      emit('update:modelValue', [date, null])
      selecting.value = 'end'
    }
  }
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
  if (e.key === 'Escape') open.value = false
}
</script>

<template>
  <div
    data-rig-date-range-picker
    :data-state="open ? 'open' : 'closed'"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <button
      data-rig-date-range-picker-trigger
      type="button"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <span data-rig-date-range-picker-start>
        {{ modelValue[0] ?? startPlaceholder }}
      </span>
      <span data-rig-date-range-picker-separator>&ndash;</span>
      <span data-rig-date-range-picker-end>
        {{ modelValue[1] ?? endPlaceholder }}
      </span>
    </button>

    <div
      v-if="open"
      data-rig-date-range-picker-popover
      role="dialog"
      aria-label="Date range picker"
    >
      <div data-rig-date-range-picker-header>
        <button type="button" aria-label="Previous month" @click="prevMonth">&lt;</button>
        <span>{{ monthName }}</span>
        <button type="button" aria-label="Next month" @click="nextMonth">&gt;</button>
      </div>

      <div data-rig-date-range-picker-grid role="grid">
        <div data-rig-date-range-picker-weekdays>
          <span v-for="d in dayNames" :key="d">{{ d }}</span>
        </div>
        <div data-rig-date-range-picker-days>
          <button
            v-for="(day, i) in days"
            :key="i"
            type="button"
            data-rig-date-range-picker-day
            :data-disabled="day ? isDisabled(day) || undefined : undefined"
            :data-in-range="day ? isInRange(day) || undefined : undefined"
            :data-range-start="day ? isRangeStart(day) || undefined : undefined"
            :data-range-end="day ? isRangeEnd(day) || undefined : undefined"
            :disabled="!day || isDisabled(day)"
            @click="selectDate(day)"
          >
            {{ day ? dayNumber(day) : '' }}
          </button>
        </div>
      </div>

      <div data-rig-date-range-picker-info>
        <span>{{ selecting === 'start' ? 'Select start date' : 'Select end date' }}</span>
      </div>
    </div>
  </div>
</template>
