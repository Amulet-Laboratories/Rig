<script setup lang="ts">
import { computed } from 'vue'

export interface CalendarEvent {
  date: string
  label: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Selected date (ISO YYYY-MM-DD) */
    modelValue?: string
    /** Events to display */
    events?: CalendarEvent[]
    /** View mode */
    view?: 'month' | 'week'
  }>(),
  {
    modelValue: () => new Date().toISOString().slice(0, 10),
    events: () => [],
    view: 'month',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select-event': [event: CalendarEvent]
}>()

const viewDate = computed(() => new Date(props.modelValue))
const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())

const monthName = computed(() =>
  viewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const days = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const last = new Date(year.value, month.value + 1, 0)
  const startDay = first.getDay()
  const result: { date: string; day: number; isCurrentMonth: boolean }[] = []

  // Previous month padding
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year.value, month.value, -i)
    result.push({
      date: formatDate(d),
      day: d.getDate(),
      isCurrentMonth: false,
    })
  }
  // Current month
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(year.value, month.value, d)
    result.push({
      date: formatDate(dt),
      day: d,
      isCurrentMonth: true,
    })
  }
  // Next month padding
  const remaining = 42 - result.length
  for (let d = 1; d <= remaining; d++) {
    const dt = new Date(year.value, month.value + 1, d)
    result.push({
      date: formatDate(dt),
      day: d,
      isCurrentMonth: false,
    })
  }

  return result
})

const weeks = computed(() => {
  const result: (typeof days.value)[] = []
  for (let i = 0; i < days.value.length; i += 7) {
    result.push(days.value.slice(i, i + 7))
  }
  return result
})

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getEvents(date: string): CalendarEvent[] {
  return props.events.filter((e) => e.date === date)
}

function isSelected(date: string): boolean {
  return date === props.modelValue
}

function isToday(date: string): boolean {
  return date === formatDate(new Date())
}

function selectDate(date: string) {
  emit('update:modelValue', date)
}

function prevMonth() {
  const d = new Date(year.value, month.value - 1, 1)
  emit('update:modelValue', formatDate(d))
}

function nextMonth() {
  const d = new Date(year.value, month.value + 1, 1)
  emit('update:modelValue', formatDate(d))
}
</script>

<template>
  <div data-rig-calendar-grid :data-view="view">
    <div data-rig-calendar-grid-header>
      <button
        type="button"
        data-rig-calendar-grid-nav
        aria-label="Previous month"
        @click="prevMonth"
      >
        &lt;
      </button>
      <span data-rig-calendar-grid-title>{{ monthName }}</span>
      <button type="button" data-rig-calendar-grid-nav aria-label="Next month" @click="nextMonth">
        &gt;
      </button>
    </div>

    <div role="grid" :aria-label="monthName">
      <div data-rig-calendar-grid-weekdays role="row">
        <span v-for="d in dayNames" :key="d" data-rig-calendar-grid-weekday role="columnheader">
          {{ d }}
        </span>
      </div>

      <div v-for="(week, wi) in weeks" :key="wi" data-rig-calendar-grid-week role="row">
        <div
          v-for="(day, di) in week"
          :key="di"
          data-rig-calendar-grid-day
          :data-current-month="day.isCurrentMonth || undefined"
          :data-selected="isSelected(day.date) || undefined"
          :data-today="isToday(day.date) || undefined"
          role="gridcell"
          tabindex="0"
          @click="selectDate(day.date)"
          @keydown.enter="selectDate(day.date)"
        >
          <span data-rig-calendar-grid-day-number>{{ day.day }}</span>
          <div v-if="getEvents(day.date).length" data-rig-calendar-grid-events>
            <span
              v-for="(evt, j) in getEvents(day.date)"
              :key="j"
              data-rig-calendar-grid-event
              :style="evt.color ? { '--event-color': evt.color } : undefined"
              @click.stop="$emit('select-event', evt)"
            >
              {{ evt.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
