<script setup lang="ts">
/**
 * Calendar — Multi-view event calendar
 * Theme: Calcite | Exercises: core, lists, menus, nav, layout, extras
 *
 * Showcase #10 — Month/week/day views with event management,
 * category filtering, and event detail modal.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Avatar from '@core/primitives/Avatar.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import StatusBar from '@nav/StatusBar.vue'
import Modal from '@layout/Modal.vue'
import Toast from '@extras/Toast.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  events,
  categoryConfig,
  generateMonthGrid,
  getWeekDays,
  getEventsForDate,
  getUpcoming,
  getMonthName,
  formatTime,
  formatTimeRange,
  formatDateShort,
  DAY_NAMES,
  type CalendarEvent,
  type EventCategory,
  type CalendarDay,
} from './fixtures/calendar-data'

// ---------------------------------------------------------------------------
// Navigation state
// ---------------------------------------------------------------------------
const currentYear = ref(2026)
const currentMonth = ref(2) // March (0-indexed)
const currentDate = ref(new Date(2026, 2, 11)) // "today"
const viewMode = ref<'month' | 'week' | 'day'>('month')

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
const breadcrumbs = computed(() => [
  { id: 'home', label: 'Anchor' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'current', label: `${getMonthName(currentMonth.value)} ${currentYear.value}` },
])

// ---------------------------------------------------------------------------
// Category filter
// ---------------------------------------------------------------------------
const activeCategories = ref<Set<EventCategory>>(
  new Set(['meeting', 'deadline', 'social', 'reminder', 'holiday', 'review']),
)

function toggleCategory(cat: EventCategory) {
  const next = new Set(activeCategories.value)
  if (next.has(cat)) {
    next.delete(cat)
  } else {
    next.add(cat)
  }
  activeCategories.value = next
}

const filteredEvents = computed(() =>
  events.filter((e) => activeCategories.value.has(e.category)),
)

// ---------------------------------------------------------------------------
// Calendar grids
// ---------------------------------------------------------------------------
const monthGrid = computed(() =>
  generateMonthGrid(currentYear.value, currentMonth.value, filteredEvents.value),
)

const weekDays = computed(() => getWeekDays(currentDate.value, filteredEvents.value))

const dayEvents = computed(() =>
  getEventsForDate(currentDate.value, filteredEvents.value).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  ),
)

const upcomingEvents = computed(() => getUpcoming(filteredEvents.value, 5))

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function goToday() {
  currentYear.value = 2026
  currentMonth.value = 2
  currentDate.value = new Date(2026, 2, 11)
}

function prevWeek() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - 7)
  currentDate.value = d
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
}

function nextWeek() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + 7)
  currentDate.value = d
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
}

function prevDay() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() - 1)
  currentDate.value = d
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
}

function nextDay() {
  const d = new Date(currentDate.value)
  d.setDate(d.getDate() + 1)
  currentDate.value = d
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
}

function selectDay(day: CalendarDay) {
  currentDate.value = day.date
  if (!day.inMonth) {
    currentMonth.value = day.date.getMonth()
    currentYear.value = day.date.getFullYear()
  }
}

// ---------------------------------------------------------------------------
// Event detail modal
// ---------------------------------------------------------------------------
const detailOpen = ref(false)
const detailEvent = ref<CalendarEvent | null>(null)

function openEvent(evt: CalendarEvent) {
  detailEvent.value = evt
  detailOpen.value = true
}

// ---------------------------------------------------------------------------
// Time grid helpers (for week/day view)
// ---------------------------------------------------------------------------
const hours = Array.from({ length: 14 }, (_, i) => i + 7) // 7am - 8pm

function timeSlotTop(iso: string): number {
  const d = new Date(iso)
  const h = d.getHours()
  const m = d.getMinutes()
  return ((h - 7) * 60 + m) * (50 / 60) // 50px per hour
}

function timeSlotHeight(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  const mins = (e.getTime() - s.getTime()) / 60000
  return Math.max(mins * (50 / 60), 20)
}

function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'date', content: `${getMonthName(currentMonth.value)} ${currentYear.value}`, priority: 1, align: 'left' as const },
  { id: 'events', content: `${filteredEvents.value.length} events`, priority: 2, align: 'right' as const },
  { id: 'today', content: `Today: Mar 11`, priority: 3, align: 'right' as const },
])
</script>

<template>
  <Story title="Calendar" icon="codicon:calendar" group="showcase">
    <!-- ================== VARIANT: DEFAULT (MONTH) ================== -->
    <Variant title="Default">
      <div class="cal-shell" data-theme="calcite">
        <!-- Top bar -->
        <header class="cal-topbar">
          <div class="cal-topbar-left">
            <Icon icon="codicon:calendar" size="lg" label="Calendar" />
            <span class="cal-brand">Calendar</span>
            <Breadcrumbs :items="breadcrumbs" />
          </div>
          <div class="cal-topbar-right">
            <Button variant="ghost" size="sm" @click="goToday">Today</Button>
            <div class="cal-nav-arrows">
              <IconButton ariaLabel="Previous month" @click="prevMonth">
                <Icon icon="codicon:chevron-left" size="sm" />
              </IconButton>
              <span class="cal-nav-label">{{ getMonthName(currentMonth) }} {{ currentYear }}</span>
              <IconButton ariaLabel="Next month" @click="nextMonth">
                <Icon icon="codicon:chevron-right" size="sm" />
              </IconButton>
            </div>
            <div class="cal-view-toggle">
              <Button
                :variant="viewMode === 'month' ? 'primary' : 'ghost'"
                size="sm"
                @click="viewMode = 'month'"
              >
                Month
              </Button>
              <Button
                :variant="viewMode === 'week' ? 'primary' : 'ghost'"
                size="sm"
                @click="viewMode = 'week'"
              >
                Week
              </Button>
              <Button
                :variant="viewMode === 'day' ? 'primary' : 'ghost'"
                size="sm"
                @click="viewMode = 'day'"
              >
                Day
              </Button>
            </div>
          </div>
        </header>

        <div class="cal-layout">
          <!-- Sidebar -->
          <aside class="cal-sidebar">
            <!-- Category filters -->
            <div class="cal-sidebar-section">
              <h4 class="cal-sidebar-title">Categories</h4>
              <div class="cal-categories">
                <button
                  v-for="(config, cat) in categoryConfig"
                  :key="cat"
                  class="cal-category-toggle"
                  :data-active="activeCategories.has(cat as EventCategory) || undefined"
                  @click="toggleCategory(cat as EventCategory)"
                >
                  <span class="cal-category-dot" :style="{ background: config.color }" />
                  <span>{{ config.label }}</span>
                </button>
              </div>
            </div>

            <!-- Upcoming events -->
            <div class="cal-sidebar-section">
              <h4 class="cal-sidebar-title">Upcoming</h4>
              <div class="cal-upcoming">
                <button
                  v-for="evt in upcomingEvents"
                  :key="evt.id"
                  class="cal-upcoming-item"
                  @click="openEvent(evt)"
                >
                  <span
                    class="cal-upcoming-bar"
                    :style="{ background: categoryConfig[evt.category].color }"
                  />
                  <div class="cal-upcoming-info">
                    <span class="cal-upcoming-title">{{ evt.title }}</span>
                    <span class="cal-upcoming-time">
                      {{ evt.allDay ? 'All day' : formatTime(evt.start) }}
                      · {{ formatDateShort(new Date(evt.start)) }}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main content -->
          <main class="cal-main">
            <!-- ---- MONTH VIEW ---- -->
            <div v-if="viewMode === 'month'" class="cal-month">
              <div class="cal-month-header">
                <span v-for="day in DAY_NAMES" :key="day" class="cal-day-name">{{ day }}</span>
              </div>
              <div class="cal-month-grid">
                <button
                  v-for="(cell, idx) in monthGrid"
                  :key="idx"
                  class="cal-cell"
                  :data-in-month="cell.inMonth || undefined"
                  :data-today="cell.isToday || undefined"
                  :data-weekend="cell.isWeekend || undefined"
                  :data-selected="cell.date.getTime() === currentDate.getTime() || undefined"
                  @click="selectDay(cell)"
                >
                  <span class="cal-cell-day">{{ cell.day }}</span>
                  <div v-if="cell.events.length" class="cal-cell-events">
                    <span
                      v-for="evt in cell.events.slice(0, 3)"
                      :key="evt.id"
                      class="cal-cell-event"
                      :style="{ '--evt-color': categoryConfig[evt.category].color }"
                      @click.stop="openEvent(evt)"
                    >
                      {{ evt.allDay ? evt.title : `${formatTime(evt.start)} ${evt.title}` }}
                    </span>
                    <span v-if="cell.events.length > 3" class="cal-cell-more">
                      +{{ cell.events.length - 3 }} more
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <!-- ---- WEEK VIEW ---- -->
            <div v-else-if="viewMode === 'week'" class="cal-week">
              <div class="cal-week-nav">
                <IconButton ariaLabel="Previous week" @click="prevWeek">
                  <Icon icon="codicon:chevron-left" size="sm" />
                </IconButton>
                <span class="cal-week-label">
                  {{ formatDateShort(weekDays[0]!.date) }} — {{ formatDateShort(weekDays[6]!.date) }}
                </span>
                <IconButton ariaLabel="Next week" @click="nextWeek">
                  <Icon icon="codicon:chevron-right" size="sm" />
                </IconButton>
              </div>
              <div class="cal-week-grid">
                <!-- Time gutter -->
                <div class="cal-time-gutter">
                  <div v-for="h in hours" :key="h" class="cal-time-label">
                    {{ formatHour(h) }}
                  </div>
                </div>
                <!-- Day columns -->
                <div
                  v-for="day in weekDays"
                  :key="day.date.toISOString()"
                  class="cal-week-column"
                  :data-today="day.isToday || undefined"
                >
                  <div class="cal-week-column-header">
                    <span class="cal-day-name">{{ DAY_NAMES[day.date.getDay()] }}</span>
                    <span class="cal-week-day-num" :data-today="day.isToday || undefined">
                      {{ day.day }}
                    </span>
                  </div>
                  <div class="cal-week-column-body">
                    <!-- Hour lines -->
                    <div v-for="h in hours" :key="h" class="cal-hour-line" />
                    <!-- All-day events -->
                    <div
                      v-for="evt in day.events.filter(e => e.allDay)"
                      :key="evt.id"
                      class="cal-week-allday"
                      :style="{ '--evt-color': categoryConfig[evt.category].color }"
                      @click="openEvent(evt)"
                    >
                      {{ evt.title }}
                    </div>
                    <!-- Timed events -->
                    <button
                      v-for="evt in day.events.filter(e => !e.allDay)"
                      :key="evt.id"
                      class="cal-week-event"
                      :style="{
                        top: `${timeSlotTop(evt.start)}px`,
                        height: `${timeSlotHeight(evt.start, evt.end)}px`,
                        '--evt-color': categoryConfig[evt.category].color,
                      }"
                      @click="openEvent(evt)"
                    >
                      <span class="cal-week-event-time">{{ formatTime(evt.start) }}</span>
                      <span class="cal-week-event-title">{{ evt.title }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ---- DAY VIEW ---- -->
            <div v-else class="cal-day-view">
              <div class="cal-day-nav">
                <IconButton ariaLabel="Previous day" @click="prevDay">
                  <Icon icon="codicon:chevron-left" size="sm" />
                </IconButton>
                <span class="cal-day-label">
                  {{ DAY_NAMES[currentDate.getDay()] }}, {{ formatDateShort(currentDate) }}
                </span>
                <IconButton ariaLabel="Next day" @click="nextDay">
                  <Icon icon="codicon:chevron-right" size="sm" />
                </IconButton>
              </div>

              <!-- All-day events -->
              <div v-if="dayEvents.some(e => e.allDay)" class="cal-day-allday-row">
                <span class="cal-day-allday-label">All Day</span>
                <div class="cal-day-allday-events">
                  <button
                    v-for="evt in dayEvents.filter(e => e.allDay)"
                    :key="evt.id"
                    class="cal-day-allday-event"
                    :style="{ '--evt-color': categoryConfig[evt.category].color }"
                    @click="openEvent(evt)"
                  >
                    {{ evt.title }}
                  </button>
                </div>
              </div>

              <!-- Time grid -->
              <div class="cal-day-grid">
                <div class="cal-time-gutter">
                  <div v-for="h in hours" :key="h" class="cal-time-label">
                    {{ formatHour(h) }}
                  </div>
                </div>
                <div class="cal-day-column">
                  <div v-for="h in hours" :key="h" class="cal-hour-line" />
                  <button
                    v-for="evt in dayEvents.filter(e => !e.allDay)"
                    :key="evt.id"
                    class="cal-week-event cal-day-event"
                    :style="{
                      top: `${timeSlotTop(evt.start)}px`,
                      height: `${timeSlotHeight(evt.start, evt.end)}px`,
                      '--evt-color': categoryConfig[evt.category].color,
                    }"
                    @click="openEvent(evt)"
                  >
                    <span class="cal-week-event-time">{{ formatTimeRange(evt.start, evt.end) }}</span>
                    <span class="cal-week-event-title">{{ evt.title }}</span>
                    <span class="cal-week-event-loc">{{ evt.location ?? 'Remote' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        <!-- Status bar -->
        <StatusBar :items="statusBarItems" />

        <!-- Event Detail Modal -->
        <Modal :open="detailOpen" aria-label="Event Detail" @update:open="detailOpen = $event">
          <div v-if="detailEvent" class="cal-detail">
            <div class="cal-detail-header">
              <Badge
                :variant="categoryConfig[detailEvent.category].label.toLowerCase()"
                :style="{ '--badge-bg': categoryConfig[detailEvent.category].color }"
              >
                <Icon :icon="categoryConfig[detailEvent.category].icon" size="xs" />
                {{ categoryConfig[detailEvent.category].label }}
              </Badge>
              <IconButton ariaLabel="Close" @click="detailOpen = false">
                <Icon icon="codicon:close" size="sm" />
              </IconButton>
            </div>

            <h2 class="cal-detail-title">{{ detailEvent.title }}</h2>
            <p class="cal-detail-desc">{{ detailEvent.description }}</p>

            <div class="cal-detail-meta">
              <div class="cal-detail-field">
                <Icon icon="codicon:clock" size="sm" />
                <span v-if="detailEvent.allDay">All Day — {{ formatDateShort(new Date(detailEvent.start)) }}</span>
                <span v-else>{{ formatTimeRange(detailEvent.start, detailEvent.end) }}</span>
              </div>
              <div v-if="detailEvent.location" class="cal-detail-field">
                <Icon icon="codicon:location" size="sm" />
                <span>{{ detailEvent.location }}</span>
              </div>
              <div v-if="detailEvent.recurring" class="cal-detail-field">
                <Icon icon="codicon:sync" size="sm" />
                <span>Recurring</span>
              </div>
            </div>

            <div v-if="detailEvent.attendees.length" class="cal-detail-attendees">
              <h4 class="cal-detail-section">Attendees ({{ detailEvent.attendees.length }})</h4>
              <div class="cal-attendee-list">
                <div
                  v-for="user in detailEvent.attendees"
                  :key="user.id"
                  class="cal-attendee"
                >
                  <Avatar :name="user.name" :color="user.color" size="sm" />
                  <div class="cal-attendee-info">
                    <span class="cal-attendee-name">{{ user.name }}</span>
                    <span class="cal-attendee-role">{{ user.role }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="cal-detail-actions">
              <Button variant="primary" @click="detailOpen = false">Close</Button>
              <Button
                variant="ghost"
                @click="toast.add({ message: `Reminder set for ${detailEvent.title}`, variant: 'success' }); detailOpen = false"
              >
                <Icon icon="codicon:bell" size="sm" />
                Set Reminder
              </Button>
            </div>
          </div>
        </Modal>

        <!-- Toast container -->
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: WEEK VIEW ================== -->
    <Variant title="Week View">
      <div class="cal-shell" data-theme="calcite">
        <header class="cal-topbar">
          <div class="cal-topbar-left">
            <Icon icon="codicon:calendar" size="lg" label="Calendar" />
            <span class="cal-brand">Week View</span>
          </div>
          <div class="cal-topbar-right">
            <Button variant="ghost" size="sm" @click="goToday">Today</Button>
            <div class="cal-nav-arrows">
              <IconButton ariaLabel="Previous week" @click="prevWeek">
                <Icon icon="codicon:chevron-left" size="sm" />
              </IconButton>
              <span class="cal-nav-label">
                {{ formatDateShort(weekDays[0]!.date) }} — {{ formatDateShort(weekDays[6]!.date) }}
              </span>
              <IconButton ariaLabel="Next week" @click="nextWeek">
                <Icon icon="codicon:chevron-right" size="sm" />
              </IconButton>
            </div>
          </div>
        </header>
        <div class="cal-main-full">
          <div class="cal-week">
            <div class="cal-week-grid">
              <div class="cal-time-gutter">
                <div v-for="h in hours" :key="h" class="cal-time-label">
                  {{ formatHour(h) }}
                </div>
              </div>
              <div
                v-for="day in weekDays"
                :key="day.date.toISOString()"
                class="cal-week-column"
                :data-today="day.isToday || undefined"
              >
                <div class="cal-week-column-header">
                  <span class="cal-day-name">{{ DAY_NAMES[day.date.getDay()] }}</span>
                  <span class="cal-week-day-num" :data-today="day.isToday || undefined">
                    {{ day.day }}
                  </span>
                </div>
                <div class="cal-week-column-body">
                  <div v-for="h in hours" :key="h" class="cal-hour-line" />
                  <div
                    v-for="evt in day.events.filter(e => e.allDay)"
                    :key="evt.id"
                    class="cal-week-allday"
                    :style="{ '--evt-color': categoryConfig[evt.category].color }"
                    @click="openEvent(evt)"
                  >
                    {{ evt.title }}
                  </div>
                  <button
                    v-for="evt in day.events.filter(e => !e.allDay)"
                    :key="evt.id"
                    class="cal-week-event"
                    :style="{
                      top: `${timeSlotTop(evt.start)}px`,
                      height: `${timeSlotHeight(evt.start, evt.end)}px`,
                      '--evt-color': categoryConfig[evt.category].color,
                    }"
                    @click="openEvent(evt)"
                  >
                    <span class="cal-week-event-time">{{ formatTime(evt.start) }}</span>
                    <span class="cal-week-event-title">{{ evt.title }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
        <Modal :open="detailOpen" aria-label="Event Detail" @update:open="detailOpen = $event">
          <div v-if="detailEvent" class="cal-detail">
            <h2 class="cal-detail-title">{{ detailEvent.title }}</h2>
            <p class="cal-detail-desc">{{ detailEvent.description }}</p>
            <div class="cal-detail-actions">
              <Button variant="primary" @click="detailOpen = false">Close</Button>
            </div>
          </div>
        </Modal>
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: DAY VIEW ================== -->
    <Variant title="Day View">
      <div class="cal-shell" data-theme="calcite">
        <header class="cal-topbar">
          <div class="cal-topbar-left">
            <Icon icon="codicon:calendar" size="lg" label="Calendar" />
            <span class="cal-brand">Day View</span>
          </div>
          <div class="cal-topbar-right">
            <div class="cal-nav-arrows">
              <IconButton ariaLabel="Previous day" @click="prevDay">
                <Icon icon="codicon:chevron-left" size="sm" />
              </IconButton>
              <span class="cal-nav-label">
                {{ DAY_NAMES[currentDate.getDay()] }}, {{ formatDateShort(currentDate) }}
              </span>
              <IconButton ariaLabel="Next day" @click="nextDay">
                <Icon icon="codicon:chevron-right" size="sm" />
              </IconButton>
            </div>
          </div>
        </header>
        <div class="cal-main-full">
          <div class="cal-day-view">
            <div v-if="dayEvents.some(e => e.allDay)" class="cal-day-allday-row">
              <span class="cal-day-allday-label">All Day</span>
              <div class="cal-day-allday-events">
                <button
                  v-for="evt in dayEvents.filter(e => e.allDay)"
                  :key="evt.id"
                  class="cal-day-allday-event"
                  :style="{ '--evt-color': categoryConfig[evt.category].color }"
                  @click="openEvent(evt)"
                >
                  {{ evt.title }}
                </button>
              </div>
            </div>
            <div class="cal-day-grid">
              <div class="cal-time-gutter">
                <div v-for="h in hours" :key="h" class="cal-time-label">
                  {{ formatHour(h) }}
                </div>
              </div>
              <div class="cal-day-column">
                <div v-for="h in hours" :key="h" class="cal-hour-line" />
                <button
                  v-for="evt in dayEvents.filter(e => !e.allDay)"
                  :key="evt.id"
                  class="cal-week-event cal-day-event"
                  :style="{
                    top: `${timeSlotTop(evt.start)}px`,
                    height: `${timeSlotHeight(evt.start, evt.end)}px`,
                    '--evt-color': categoryConfig[evt.category].color,
                  }"
                  @click="openEvent(evt)"
                >
                  <span class="cal-week-event-time">{{ formatTimeRange(evt.start, evt.end) }}</span>
                  <span class="cal-week-event-title">{{ evt.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
        <Modal :open="detailOpen" aria-label="Event Detail" @update:open="detailOpen = $event">
          <div v-if="detailEvent" class="cal-detail">
            <h2 class="cal-detail-title">{{ detailEvent.title }}</h2>
            <p class="cal-detail-desc">{{ detailEvent.description }}</p>
            <div class="cal-detail-actions">
              <Button variant="primary" @click="detailOpen = false">Close</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Variant>

    <!-- ================== VARIANT: EVENT DETAIL ================== -->
    <Variant title="Event Detail">
      <div class="cal-shell" data-theme="calcite">
        <header class="cal-topbar">
          <div class="cal-topbar-left">
            <Icon icon="codicon:calendar" size="lg" label="Calendar" />
            <span class="cal-brand">Event Detail</span>
          </div>
        </header>
        <div class="cal-main-full cal-centered">
          <div class="cal-detail cal-detail-inline">
            <div class="cal-detail-header">
              <Badge style="--badge-bg: #3b82f6">
                <Icon icon="codicon:device-camera-video" size="xs" />
                Meeting
              </Badge>
            </div>
            <h2 class="cal-detail-title">Sprint Planning</h2>
            <p class="cal-detail-desc">Plan Sprint 5 — scope backlog items and assign owners.</p>
            <div class="cal-detail-meta">
              <div class="cal-detail-field">
                <Icon icon="codicon:clock" size="sm" />
                <span>9:00 AM – 10:30 AM</span>
              </div>
              <div class="cal-detail-field">
                <Icon icon="codicon:location" size="sm" />
                <span>Conference Room A</span>
              </div>
              <div class="cal-detail-field">
                <Icon icon="codicon:sync" size="sm" />
                <span>Recurring</span>
              </div>
            </div>
            <div class="cal-detail-attendees">
              <h4 class="cal-detail-section">Attendees (4)</h4>
              <div class="cal-attendee-list">
                <div class="cal-attendee">
                  <Avatar name="Elara Voss" color="#7c3aed" size="sm" />
                  <div class="cal-attendee-info">
                    <span class="cal-attendee-name">Elara Voss</span>
                    <span class="cal-attendee-role">Lead</span>
                  </div>
                </div>
                <div class="cal-attendee">
                  <Avatar name="Marcus Thorne" color="#2563eb" size="sm" />
                  <div class="cal-attendee-info">
                    <span class="cal-attendee-name">Marcus Thorne</span>
                    <span class="cal-attendee-role">Engineer</span>
                  </div>
                </div>
                <div class="cal-attendee">
                  <Avatar name="Jasper Cole" color="#059669" size="sm" />
                  <div class="cal-attendee-info">
                    <span class="cal-attendee-name">Jasper Cole</span>
                    <span class="cal-attendee-role">Backend</span>
                  </div>
                </div>
                <div class="cal-attendee">
                  <Avatar name="Rowan Blackwood" color="#dc2626" size="sm" />
                  <div class="cal-attendee-info">
                    <span class="cal-attendee-name">Rowan Blackwood</span>
                    <span class="cal-attendee-role">DevOps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: CATEGORY FILTERS ================== -->
    <Variant title="Category Filters">
      <div class="cal-shell" data-theme="calcite">
        <header class="cal-topbar">
          <div class="cal-topbar-left">
            <Icon icon="codicon:calendar" size="lg" label="Calendar" />
            <span class="cal-brand">Category Filters</span>
          </div>
        </header>
        <div class="cal-layout">
          <aside class="cal-sidebar">
            <div class="cal-sidebar-section">
              <h4 class="cal-sidebar-title">Categories</h4>
              <p class="cal-sidebar-hint">Toggle categories to filter events on the calendar.</p>
              <div class="cal-categories">
                <button
                  v-for="(config, cat) in categoryConfig"
                  :key="cat"
                  class="cal-category-toggle"
                  :data-active="activeCategories.has(cat as EventCategory) || undefined"
                  @click="toggleCategory(cat as EventCategory)"
                >
                  <span class="cal-category-dot" :style="{ background: config.color }" />
                  <Icon :icon="config.icon" size="sm" />
                  <span>{{ config.label }}</span>
                </button>
              </div>
            </div>
          </aside>
          <main class="cal-main">
            <div class="cal-month">
              <div class="cal-month-header">
                <span v-for="day in DAY_NAMES" :key="day" class="cal-day-name">{{ day }}</span>
              </div>
              <div class="cal-month-grid">
                <button
                  v-for="(cell, idx) in monthGrid"
                  :key="idx"
                  class="cal-cell"
                  :data-in-month="cell.inMonth || undefined"
                  :data-today="cell.isToday || undefined"
                  :data-weekend="cell.isWeekend || undefined"
                  @click="selectDay(cell)"
                >
                  <span class="cal-cell-day">{{ cell.day }}</span>
                  <div v-if="cell.events.length" class="cal-cell-events">
                    <span
                      v-for="evt in cell.events.slice(0, 2)"
                      :key="evt.id"
                      class="cal-cell-event"
                      :style="{ '--evt-color': categoryConfig[evt.category].color }"
                    >
                      {{ evt.title }}
                    </span>
                    <span v-if="cell.events.length > 2" class="cal-cell-more">
                      +{{ cell.events.length - 2 }} more
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </main>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: MINI CALENDAR ================== -->
    <Variant title="Mini Calendar">
      <div class="cal-shell" data-theme="calcite">
        <header class="cal-topbar">
          <div class="cal-topbar-left">
            <Icon icon="codicon:calendar" size="lg" label="Calendar" />
            <span class="cal-brand">Mini Calendar</span>
          </div>
        </header>
        <div class="cal-main-full cal-centered">
          <Card>
            <div class="cal-mini">
              <div class="cal-mini-header">
                <IconButton ariaLabel="Previous month" @click="prevMonth">
                  <Icon icon="codicon:chevron-left" size="sm" />
                </IconButton>
                <span class="cal-mini-label">{{ getMonthName(currentMonth) }} {{ currentYear }}</span>
                <IconButton ariaLabel="Next month" @click="nextMonth">
                  <Icon icon="codicon:chevron-right" size="sm" />
                </IconButton>
              </div>
              <div class="cal-mini-days">
                <span v-for="day in DAY_NAMES" :key="day" class="cal-mini-day-name">
                  {{ day.charAt(0) }}
                </span>
              </div>
              <div class="cal-mini-grid">
                <button
                  v-for="(cell, idx) in monthGrid"
                  :key="idx"
                  class="cal-mini-cell"
                  :data-in-month="cell.inMonth || undefined"
                  :data-today="cell.isToday || undefined"
                  :data-has-events="cell.events.length > 0 || undefined"
                  :data-selected="cell.date.getTime() === currentDate.getTime() || undefined"
                  @click="selectDay(cell)"
                >
                  {{ cell.day }}
                </button>
              </div>
            </div>
          </Card>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.cal-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 700px;
  background: var(--color-background, #f8f5f1);
  color: var(--color-foreground, #1a1714);
  font-family: var(--font-sans, Inter, sans-serif);
}

/* ---- Topbar ---- */
.cal-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border, #e0dbd5);
  background: var(--color-card, #eee9e3);
  gap: 12px;
}

.cal-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cal-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cal-brand {
  font-family: var(--font-mono, monospace);
  font-weight: 700;
  font-size: 15px;
}

.cal-nav-arrows {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cal-nav-label {
  font-size: 14px;
  font-weight: 600;
  min-width: 160px;
  text-align: center;
}

.cal-view-toggle {
  display: flex;
  gap: 2px;
}

/* ---- Layout ---- */
.cal-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.cal-sidebar {
  width: 240px;
  border-right: 1px solid var(--color-border, #e0dbd5);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cal-sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cal-sidebar-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #6b6560);
  margin: 0;
}

.cal-sidebar-hint {
  font-size: 11px;
  color: var(--color-muted-foreground, #6b6560);
  margin: 0;
}

.cal-main {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.cal-main-full {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.cal-centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ---- Categories ---- */
.cal-categories {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-category-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: none;
  background: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  color: var(--color-muted-foreground, #6b6560);
  transition: background 0.1s, color 0.1s;
}

.cal-category-toggle[data-active] {
  color: var(--color-foreground, #1a1714);
}

.cal-category-toggle:not([data-active]) {
  opacity: 0.5;
}

.cal-category-toggle:hover {
  background: color-mix(in srgb, var(--color-foreground, #1a1714) 5%, transparent);
}

.cal-category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ---- Upcoming ---- */
.cal-upcoming {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-upcoming-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.cal-upcoming-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #1a1714) 5%, transparent);
}

.cal-upcoming-bar {
  width: 3px;
  min-height: 28px;
  border-radius: 2px;
  flex-shrink: 0;
}

.cal-upcoming-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-upcoming-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-foreground, #1a1714);
}

.cal-upcoming-time {
  font-size: 11px;
  color: var(--color-muted-foreground, #6b6560);
}

/* ---- Month view ---- */
.cal-month {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cal-month-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--color-border, #e0dbd5);
}

.cal-day-name {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #6b6560);
  padding: 6px 8px;
  text-align: center;
}

.cal-month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
}

.cal-cell {
  display: flex;
  flex-direction: column;
  min-height: 90px;
  padding: 4px;
  border: 1px solid var(--color-border, #e0dbd5);
  border-top: none;
  border-left: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  font-family: inherit;
  color: inherit;
}

.cal-cell:nth-child(7n) {
  border-right: none;
}

.cal-cell:not([data-in-month]) {
  opacity: 0.4;
}

.cal-cell[data-today] {
  background: color-mix(in srgb, var(--color-primary, #a0714a) 8%, transparent);
}

.cal-cell[data-selected] {
  background: color-mix(in srgb, var(--color-primary, #a0714a) 15%, transparent);
}

.cal-cell[data-weekend] .cal-cell-day {
  color: var(--color-muted-foreground, #6b6560);
}

.cal-cell:hover {
  background: color-mix(in srgb, var(--color-foreground, #1a1714) 4%, transparent);
}

.cal-cell-day {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 4px;
}

.cal-cell[data-today] .cal-cell-day {
  background: var(--color-primary, #a0714a);
  color: #fff;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-cell-events {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 2px;
  overflow: hidden;
}

.cal-cell-event {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--evt-color, #6b7280) 15%, transparent);
  color: var(--evt-color, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  border-left: 2px solid var(--evt-color, #6b7280);
}

.cal-cell-event:hover {
  background: color-mix(in srgb, var(--evt-color, #6b7280) 25%, transparent);
}

.cal-cell-more {
  font-size: 10px;
  color: var(--color-muted-foreground, #6b6560);
  padding: 1px 4px;
}

/* ---- Week view ---- */
.cal-week {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cal-week-nav,
.cal-day-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.cal-week-label,
.cal-day-label {
  font-size: 14px;
  font-weight: 600;
  min-width: 200px;
  text-align: center;
}

.cal-week-grid {
  display: flex;
  flex: 1;
  border: 1px solid var(--color-border, #e0dbd5);
  border-radius: 4px;
  overflow: hidden;
}

.cal-time-gutter {
  width: 60px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border, #e0dbd5);
}

.cal-time-label {
  height: 50px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 2px 6px;
  font-size: 10px;
  color: var(--color-muted-foreground, #6b6560);
  font-family: var(--font-mono, monospace);
}

.cal-week-column {
  flex: 1;
  border-right: 1px solid var(--color-border, #e0dbd5);
  display: flex;
  flex-direction: column;
}

.cal-week-column:last-child {
  border-right: none;
}

.cal-week-column[data-today] {
  background: color-mix(in srgb, var(--color-primary, #a0714a) 5%, transparent);
}

.cal-week-column-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  border-bottom: 1px solid var(--color-border, #e0dbd5);
  gap: 2px;
}

.cal-week-day-num {
  font-size: 16px;
  font-weight: 600;
}

.cal-week-day-num[data-today] {
  background: var(--color-primary, #a0714a);
  color: #fff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-week-column-body {
  position: relative;
  flex: 1;
}

.cal-hour-line {
  height: 50px;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border, #e0dbd5) 50%, transparent);
}

.cal-week-allday {
  font-size: 10px;
  padding: 2px 4px;
  margin: 2px 2px 0;
  border-radius: 2px;
  background: color-mix(in srgb, var(--evt-color, #6b7280) 20%, transparent);
  color: var(--evt-color, #6b7280);
  cursor: pointer;
  border-left: 2px solid var(--evt-color, #6b7280);
}

.cal-week-event {
  position: absolute;
  left: 2px;
  right: 2px;
  padding: 2px 4px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--evt-color, #3b82f6) 20%, transparent);
  border-left: 3px solid var(--evt-color, #3b82f6);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  font-family: inherit;
  color: inherit;
  text-align: left;
  transition: background 0.1s;
}

.cal-week-event:hover {
  background: color-mix(in srgb, var(--evt-color, #3b82f6) 30%, transparent);
}

.cal-week-event-time {
  font-size: 9px;
  font-weight: 600;
  color: var(--evt-color, #3b82f6);
}

.cal-week-event-title {
  font-size: 11px;
  font-weight: 500;
}

.cal-week-event-loc {
  font-size: 9px;
  color: var(--color-muted-foreground, #6b6560);
}

/* ---- Day view ---- */
.cal-day-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cal-day-allday-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border, #e0dbd5);
  margin-bottom: 8px;
}

.cal-day-allday-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-muted-foreground, #6b6560);
  width: 60px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 8px;
}

.cal-day-allday-events {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.cal-day-allday-event {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: color-mix(in srgb, var(--evt-color, #6b7280) 15%, transparent);
  color: var(--evt-color, #6b7280);
  border: 1px solid color-mix(in srgb, var(--evt-color, #6b7280) 30%, transparent);
  cursor: pointer;
  border-left: 3px solid var(--evt-color, #6b7280);
}

.cal-day-grid {
  display: flex;
  flex: 1;
}

.cal-day-column {
  flex: 1;
  position: relative;
}

.cal-day-event {
  right: 20px;
}

/* ---- Detail modal ---- */
.cal-detail {
  padding: 24px;
  min-width: 420px;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-card, #eee9e3);
  color: var(--color-foreground, #1a1714);
  border-radius: 8px;
}

.cal-detail-inline {
  border: 1px solid var(--color-border, #e0dbd5);
}

.cal-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cal-detail-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.cal-detail-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-muted-foreground, #6b6560);
  margin: 0;
}

.cal-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cal-detail-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.cal-detail-attendees {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cal-detail-section {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #6b6560);
  margin: 0;
}

.cal-attendee-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cal-attendee {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cal-attendee-info {
  display: flex;
  flex-direction: column;
}

.cal-attendee-name {
  font-size: 13px;
  font-weight: 500;
}

.cal-attendee-role {
  font-size: 11px;
  color: var(--color-muted-foreground, #6b6560);
}

.cal-detail-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
}

/* ---- Mini calendar ---- */
.cal-mini {
  padding: 16px;
  width: 260px;
}

.cal-mini-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.cal-mini-label {
  font-size: 14px;
  font-weight: 600;
}

.cal-mini-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}

.cal-mini-day-name {
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  color: var(--color-muted-foreground, #6b6560);
  padding: 4px;
}

.cal-mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.cal-mini-cell {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  color: inherit;
  transition: background 0.1s;
}

.cal-mini-cell:not([data-in-month]) {
  opacity: 0.3;
}

.cal-mini-cell[data-today] {
  background: var(--color-primary, #a0714a);
  color: #fff;
  font-weight: 700;
}

.cal-mini-cell[data-selected]:not([data-today]) {
  background: color-mix(in srgb, var(--color-primary, #a0714a) 20%, transparent);
}

.cal-mini-cell[data-has-events]:not([data-today]) {
  font-weight: 600;
}

.cal-mini-cell[data-has-events]::after {
  content: '';
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-primary, #a0714a);
}

.cal-mini-cell:hover:not([data-today]) {
  background: color-mix(in srgb, var(--color-foreground, #1a1714) 8%, transparent);
}
</style>
