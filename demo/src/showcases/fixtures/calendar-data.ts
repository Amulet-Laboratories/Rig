/**
 * Calendar — Date utilities and event data
 * Theme: Calcite | Archetype: Multi-view calendar with events
 */
import { users, type BriarCoveUser } from './briar-cove-users'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EventCategory = 'meeting' | 'deadline' | 'social' | 'reminder' | 'holiday' | 'review'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  start: string // ISO datetime
  end: string // ISO datetime
  allDay: boolean
  category: EventCategory
  location: string | null
  attendees: BriarCoveUser[]
  recurring: boolean
  color: string
}

export interface CalendarDay {
  date: Date
  day: number
  inMonth: boolean
  isToday: boolean
  isWeekend: boolean
  events: CalendarEvent[]
}

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

export const categoryConfig: Record<
  EventCategory,
  { label: string; color: string; icon: string }
> = {
  meeting: { label: 'Meeting', color: '#3b82f6', icon: 'codicon:device-camera-video' },
  deadline: { label: 'Deadline', color: '#ef4444', icon: 'codicon:flame' },
  social: { label: 'Social', color: '#22c55e', icon: 'codicon:smiley' },
  reminder: { label: 'Reminder', color: '#f59e0b', icon: 'codicon:bell' },
  holiday: { label: 'Holiday', color: '#8b5cf6', icon: 'codicon:calendar' },
  review: { label: 'Review', color: '#06b6d4', icon: 'codicon:git-pull-request' },
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const events: CalendarEvent[] = [
  // Week 1 of March 2026
  {
    id: 'evt-001',
    title: 'Sprint Planning',
    description: 'Plan Sprint 5 — scope backlog items and assign owners.',
    start: '2026-03-02T09:00:00',
    end: '2026-03-02T10:30:00',
    allDay: false,
    category: 'meeting',
    location: 'Conference Room A',
    attendees: [users[0]!, users[1]!, users[6]!, users[10]!],
    recurring: true,
    color: '#3b82f6',
  },
  {
    id: 'evt-002',
    title: 'Design Review — Client Portal',
    description: 'Review mockups for the client-facing invoice portal.',
    start: '2026-03-03T14:00:00',
    end: '2026-03-03T15:00:00',
    allDay: false,
    category: 'review',
    location: null,
    attendees: [users[4]!, users[7]!, users[0]!],
    recurring: false,
    color: '#06b6d4',
  },
  {
    id: 'evt-003',
    title: 'Stripe Integration Deadline',
    description: 'Webhook listener and payment status sync must be production-ready.',
    start: '2026-03-05T00:00:00',
    end: '2026-03-05T23:59:00',
    allDay: true,
    category: 'deadline',
    location: null,
    attendees: [users[6]!],
    recurring: false,
    color: '#ef4444',
  },
  {
    id: 'evt-004',
    title: 'Team Lunch — Briar Cove Diner',
    description: 'Monthly team lunch. Reservations under Voss.',
    start: '2026-03-06T12:00:00',
    end: '2026-03-06T13:30:00',
    allDay: false,
    category: 'social',
    location: 'Briar Cove Diner',
    attendees: users.slice(0, 8),
    recurring: false,
    color: '#22c55e',
  },

  // Week 2
  {
    id: 'evt-005',
    title: 'Standup',
    description: 'Daily check-in — blockers and progress.',
    start: '2026-03-09T09:30:00',
    end: '2026-03-09T09:45:00',
    allDay: false,
    category: 'meeting',
    location: null,
    attendees: [users[0]!, users[1]!, users[3]!, users[4]!],
    recurring: true,
    color: '#3b82f6',
  },
  {
    id: 'evt-006',
    title: 'Invoice PDF Review',
    description: 'Review PDF export quality and layout. Test A4 and Letter formats.',
    start: '2026-03-10T11:00:00',
    end: '2026-03-10T12:00:00',
    allDay: false,
    category: 'review',
    location: 'Conference Room B',
    attendees: [users[0]!, users[1]!],
    recurring: false,
    color: '#06b6d4',
  },
  {
    id: 'evt-007',
    title: 'Accessibility Audit Due',
    description: 'Complete WCAG AAA audit and remediation report.',
    start: '2026-03-12T00:00:00',
    end: '2026-03-12T23:59:00',
    allDay: true,
    category: 'deadline',
    location: null,
    attendees: [users[11]!],
    recurring: false,
    color: '#ef4444',
  },
  {
    id: 'evt-008',
    title: 'Revenue Chart Demo',
    description: 'Present the new comparison chart to stakeholders.',
    start: '2026-03-11T15:00:00',
    end: '2026-03-11T16:00:00',
    allDay: false,
    category: 'meeting',
    location: 'Main Office',
    attendees: [users[1]!, users[0]!, users[7]!],
    recurring: false,
    color: '#3b82f6',
  },
  {
    id: 'evt-009',
    title: 'Reminder: Update Dependencies',
    description: 'Monthly dependency audit and update cycle.',
    start: '2026-03-13T10:00:00',
    end: '2026-03-13T10:30:00',
    allDay: false,
    category: 'reminder',
    location: null,
    attendees: [users[10]!],
    recurring: true,
    color: '#f59e0b',
  },

  // Week 3
  {
    id: 'evt-010',
    title: 'Mid-Sprint Review',
    description: 'Review progress against Sprint 5 goals. Re-scope if needed.',
    start: '2026-03-16T10:00:00',
    end: '2026-03-16T11:30:00',
    allDay: false,
    category: 'meeting',
    location: 'Conference Room A',
    attendees: [users[0]!, users[1]!, users[3]!, users[6]!, users[10]!],
    recurring: false,
    color: '#3b82f6',
  },
  {
    id: 'evt-011',
    title: "St. Patrick's Day",
    description: 'Office closed.',
    start: '2026-03-17T00:00:00',
    end: '2026-03-17T23:59:00',
    allDay: true,
    category: 'holiday',
    location: null,
    attendees: [],
    recurring: false,
    color: '#8b5cf6',
  },
  {
    id: 'evt-012',
    title: 'Client Onboarding — Tidewater Inn',
    description: 'Kickoff call for new hotel client. Scope initial invoice setup.',
    start: '2026-03-18T13:00:00',
    end: '2026-03-18T14:00:00',
    allDay: false,
    category: 'meeting',
    location: null,
    attendees: [users[0]!, users[3]!],
    recurring: false,
    color: '#3b82f6',
  },
  {
    id: 'evt-013',
    title: 'API Rate Limiting PR Review',
    description: 'Final review before merge. Check Redis integration and test coverage.',
    start: '2026-03-19T14:00:00',
    end: '2026-03-19T15:00:00',
    allDay: false,
    category: 'review',
    location: null,
    attendees: [users[10]!, users[6]!],
    recurring: false,
    color: '#06b6d4',
  },
  {
    id: 'evt-014',
    title: 'Game Night',
    description: 'Board games at Sable\'s. Bring snacks.',
    start: '2026-03-20T19:00:00',
    end: '2026-03-20T22:00:00',
    allDay: false,
    category: 'social',
    location: "Sable's Place",
    attendees: [users[2]!, users[4]!, users[8]!, users[9]!],
    recurring: false,
    color: '#22c55e',
  },

  // Week 4
  {
    id: 'evt-015',
    title: 'Sprint Retro',
    description: 'What went well, what to improve, and action items for Sprint 6.',
    start: '2026-03-23T14:00:00',
    end: '2026-03-23T15:30:00',
    allDay: false,
    category: 'meeting',
    location: 'Conference Room A',
    attendees: users.slice(0, 6),
    recurring: true,
    color: '#3b82f6',
  },
  {
    id: 'evt-016',
    title: 'Client Portal Launch',
    description: 'Go-live for the read-only client invoice portal.',
    start: '2026-03-25T00:00:00',
    end: '2026-03-25T23:59:00',
    allDay: true,
    category: 'deadline',
    location: null,
    attendees: [users[0]!, users[1]!, users[4]!],
    recurring: false,
    color: '#ef4444',
  },
  {
    id: 'evt-017',
    title: 'Reminder: Quarterly Tax Filing',
    description: 'Q1 estimated taxes due for all Briar Cove businesses.',
    start: '2026-03-27T09:00:00',
    end: '2026-03-27T09:30:00',
    allDay: false,
    category: 'reminder',
    location: null,
    attendees: [users[2]!],
    recurring: false,
    color: '#f59e0b',
  },
  {
    id: 'evt-018',
    title: 'Sprint 6 Planning',
    description: 'Scope next sprint. Review backlog priorities.',
    start: '2026-03-30T09:00:00',
    end: '2026-03-30T10:30:00',
    allDay: false,
    category: 'meeting',
    location: 'Conference Room A',
    attendees: [users[0]!, users[1]!, users[6]!, users[10]!],
    recurring: true,
    color: '#3b82f6',
  },
]

// ---------------------------------------------------------------------------
// Calendar engine
// ---------------------------------------------------------------------------

const DAYS_IN_WEEK = 7
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export { MONTH_NAMES, DAY_NAMES, DAY_NAMES_FULL }

export function getMonthName(month: number): string {
  return MONTH_NAMES[month] ?? ''
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isToday(date: Date): boolean {
  // For demo purposes, "today" is March 11, 2026
  return isSameDay(date, new Date(2026, 2, 11))
}

export function getEventsForDate(date: Date, allEvents: CalendarEvent[]): CalendarEvent[] {
  return allEvents.filter((evt) => {
    const start = new Date(evt.start)
    const end = new Date(evt.end)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    return start <= dayEnd && end >= dayStart
  })
}

export function generateMonthGrid(year: number, month: number, allEvents: CalendarEvent[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay() // 0=Sun

  const days: CalendarDay[] = []

  // Previous month padding
  for (let i = startOffset - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      day: date.getDate(),
      inMonth: false,
      isToday: isToday(date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      events: getEventsForDate(date, allEvents),
    })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    days.push({
      date,
      day: d,
      inMonth: true,
      isToday: isToday(date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      events: getEventsForDate(date, allEvents),
    })
  }

  // Next month padding (fill to 6 rows)
  const totalCells = Math.ceil(days.length / DAYS_IN_WEEK) * DAYS_IN_WEEK
  const remaining = totalCells - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      day: i,
      inMonth: false,
      isToday: isToday(date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      events: getEventsForDate(date, allEvents),
    })
  }

  return days
}

export function getWeekDays(date: Date, allEvents: CalendarEvent[]): CalendarDay[] {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())

  const days: CalendarDay[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    days.push({
      date: d,
      day: d.getDate(),
      inMonth: d.getMonth() === date.getMonth(),
      isToday: isToday(d),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      events: getEventsForDate(d, allEvents),
    })
  }
  return days
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`
}

// ---------------------------------------------------------------------------
// Upcoming events (sorted by start time)
// ---------------------------------------------------------------------------

export function getUpcoming(allEvents: CalendarEvent[], count: number): CalendarEvent[] {
  const now = new Date(2026, 2, 11, 8, 0) // "now" for demo
  return allEvents
    .filter((e) => new Date(e.start) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, count)
}
