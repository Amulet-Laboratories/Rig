/**
 * Flight Tracker — fixture data
 * Real-time flight map, departure board, status updates
 */
import { users as briarUsers } from './briar-cove-users'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type FlightStatus =
  | 'on-time'
  | 'delayed'
  | 'boarding'
  | 'departed'
  | 'in-flight'
  | 'landed'
  | 'cancelled'

export interface Airport {
  code: string
  name: string
  city: string
  lat: number
  lon: number
  timezone: string
}

export interface Flight {
  id: string
  flightNumber: string
  airline: string
  airlineIcon: string
  origin: Airport
  destination: Airport
  status: FlightStatus
  scheduledDeparture: string
  actualDeparture: string | null
  scheduledArrival: string
  actualArrival: string | null
  gate: string
  terminal: string
  aircraft: string
  altitude: number | null      // feet, null if on ground
  speed: number | null         // knots
  progress: number             // 0-100
  passengers: typeof briarUsers[number][]
  delayMinutes: number
}

export interface FlightAlert {
  id: string
  flightId: string
  type: 'delay' | 'gate-change' | 'cancellation' | 'boarding' | 'landed'
  message: string
  timestamp: string
}

// ---------------------------------------------------------------------------
// Airports
// ---------------------------------------------------------------------------
export const airports: Airport[] = [
  {
    code: 'BRC',
    name: 'Briar Cove International',
    city: 'Briar Cove',
    lat: 42.36,
    lon: -71.06,
    timezone: 'EST',
  },
  {
    code: 'ASH',
    name: 'Ashwick Municipal',
    city: 'Ashwick',
    lat: 51.47,
    lon: -0.46,
    timezone: 'GMT',
  },
  {
    code: 'FRN',
    name: 'Fenwick-Roux Airport',
    city: 'Fenwick',
    lat: 48.86,
    lon: 2.35,
    timezone: 'CET',
  },
  {
    code: 'THN',
    name: 'Thorngate Hub',
    city: 'Thorngate',
    lat: 35.68,
    lon: 139.77,
    timezone: 'JST',
  },
  {
    code: 'MRD',
    name: 'Meridian Field',
    city: 'Meridian',
    lat: -33.87,
    lon: 151.21,
    timezone: 'AEST',
  },
]

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------
export const statusConfig: Record<
  FlightStatus,
  { label: string; icon: string; variant: string; color: string }
> = {
  'on-time': {
    label: 'On Time',
    icon: 'codicon:check-all',
    variant: 'success',
    color: 'var(--color-success, #4caf50)',
  },
  delayed: {
    label: 'Delayed',
    icon: 'codicon:warning',
    variant: 'warning',
    color: 'var(--color-warning, #ff9800)',
  },
  boarding: {
    label: 'Boarding',
    icon: 'codicon:sign-in',
    variant: 'primary',
    color: 'var(--color-primary, #6366f1)',
  },
  departed: {
    label: 'Departed',
    icon: 'codicon:arrow-right',
    variant: 'muted',
    color: 'var(--color-muted-foreground, #888)',
  },
  'in-flight': {
    label: 'In Flight',
    icon: 'codicon:rocket',
    variant: 'primary',
    color: 'var(--color-info, #2196f3)',
  },
  landed: {
    label: 'Landed',
    icon: 'codicon:check',
    variant: 'success',
    color: 'var(--color-success, #4caf50)',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'codicon:error',
    variant: 'danger',
    color: 'var(--color-danger, #e53935)',
  },
}

// ---------------------------------------------------------------------------
// Flights
// ---------------------------------------------------------------------------
export const flights: Flight[] = [
  {
    id: 'fl-1',
    flightNumber: 'BC-401',
    airline: 'Briar Air',
    airlineIcon: 'codicon:cloud',
    origin: airports[0]!,
    destination: airports[1]!,
    status: 'in-flight',
    scheduledDeparture: '2026-03-11T08:30:00',
    actualDeparture: '2026-03-11T08:45:00',
    scheduledArrival: '2026-03-11T14:20:00',
    actualArrival: null,
    gate: 'A12',
    terminal: 'T1',
    aircraft: 'Airbus A330-300',
    altitude: 36000,
    speed: 485,
    progress: 62,
    passengers: [briarUsers[0]!, briarUsers[3]!],
    delayMinutes: 15,
  },
  {
    id: 'fl-2',
    flightNumber: 'BC-215',
    airline: 'Briar Air',
    airlineIcon: 'codicon:cloud',
    origin: airports[0]!,
    destination: airports[2]!,
    status: 'boarding',
    scheduledDeparture: '2026-03-11T10:00:00',
    actualDeparture: null,
    scheduledArrival: '2026-03-11T17:45:00',
    actualArrival: null,
    gate: 'B7',
    terminal: 'T2',
    aircraft: 'Boeing 787-9',
    altitude: null,
    speed: null,
    progress: 0,
    passengers: [briarUsers[1]!],
    delayMinutes: 0,
  },
  {
    id: 'fl-3',
    flightNumber: 'AW-810',
    airline: 'Ashwick Express',
    airlineIcon: 'codicon:zap',
    origin: airports[1]!,
    destination: airports[0]!,
    status: 'delayed',
    scheduledDeparture: '2026-03-11T11:15:00',
    actualDeparture: null,
    scheduledArrival: '2026-03-11T15:30:00',
    actualArrival: null,
    gate: 'C3',
    terminal: 'T1',
    aircraft: 'Boeing 737 MAX',
    altitude: null,
    speed: null,
    progress: 0,
    passengers: [briarUsers[4]!, briarUsers[5]!],
    delayMinutes: 45,
  },
  {
    id: 'fl-4',
    flightNumber: 'FR-502',
    airline: 'Fenwick Wings',
    airlineIcon: 'codicon:star-full',
    origin: airports[2]!,
    destination: airports[3]!,
    status: 'on-time',
    scheduledDeparture: '2026-03-11T14:00:00',
    actualDeparture: null,
    scheduledArrival: '2026-03-12T09:30:00',
    actualArrival: null,
    gate: 'D11',
    terminal: 'T3',
    aircraft: 'Airbus A350-900',
    altitude: null,
    speed: null,
    progress: 0,
    passengers: [briarUsers[2]!],
    delayMinutes: 0,
  },
  {
    id: 'fl-5',
    flightNumber: 'TG-330',
    airline: 'Thorngate Pacific',
    airlineIcon: 'codicon:globe',
    origin: airports[3]!,
    destination: airports[4]!,
    status: 'departed',
    scheduledDeparture: '2026-03-11T06:00:00',
    actualDeparture: '2026-03-11T06:12:00',
    scheduledArrival: '2026-03-11T17:45:00',
    actualArrival: null,
    gate: 'E5',
    terminal: 'T2',
    aircraft: 'Boeing 777-300ER',
    altitude: 39000,
    speed: 510,
    progress: 48,
    passengers: [briarUsers[6]!, briarUsers[7]!],
    delayMinutes: 12,
  },
  {
    id: 'fl-6',
    flightNumber: 'MR-120',
    airline: 'Meridian Air',
    airlineIcon: 'codicon:compass',
    origin: airports[4]!,
    destination: airports[0]!,
    status: 'landed',
    scheduledDeparture: '2026-03-10T22:00:00',
    actualDeparture: '2026-03-10T22:10:00',
    scheduledArrival: '2026-03-11T08:15:00',
    actualArrival: '2026-03-11T08:22:00',
    gate: 'A4',
    terminal: 'T1',
    aircraft: 'Airbus A380',
    altitude: null,
    speed: null,
    progress: 100,
    passengers: [briarUsers[8]!, briarUsers[9]!],
    delayMinutes: 7,
  },
  {
    id: 'fl-7',
    flightNumber: 'BC-099',
    airline: 'Briar Air',
    airlineIcon: 'codicon:cloud',
    origin: airports[0]!,
    destination: airports[4]!,
    status: 'cancelled',
    scheduledDeparture: '2026-03-11T16:30:00',
    actualDeparture: null,
    scheduledArrival: '2026-03-12T10:00:00',
    actualArrival: null,
    gate: 'B2',
    terminal: 'T2',
    aircraft: 'Boeing 787-9',
    altitude: null,
    speed: null,
    progress: 0,
    passengers: [briarUsers[10]!, briarUsers[11]!],
    delayMinutes: 0,
  },
  {
    id: 'fl-8',
    flightNumber: 'AW-445',
    airline: 'Ashwick Express',
    airlineIcon: 'codicon:zap',
    origin: airports[1]!,
    destination: airports[2]!,
    status: 'on-time',
    scheduledDeparture: '2026-03-11T18:00:00',
    actualDeparture: null,
    scheduledArrival: '2026-03-11T19:30:00',
    actualArrival: null,
    gate: 'F8',
    terminal: 'T1',
    aircraft: 'Embraer E195',
    altitude: null,
    speed: null,
    progress: 0,
    passengers: [],
    delayMinutes: 0,
  },
]

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
export const alerts: FlightAlert[] = [
  {
    id: 'alert-1',
    flightId: 'fl-3',
    type: 'delay',
    message: 'AW-810 delayed 45 minutes due to weather at Ashwick.',
    timestamp: '2026-03-11T09:30:00',
  },
  {
    id: 'alert-2',
    flightId: 'fl-7',
    type: 'cancellation',
    message: 'BC-099 to Meridian has been cancelled. Passengers being rebooked.',
    timestamp: '2026-03-11T10:15:00',
  },
  {
    id: 'alert-3',
    flightId: 'fl-2',
    type: 'boarding',
    message: 'BC-215 now boarding at Gate B7, Terminal T2.',
    timestamp: '2026-03-11T09:40:00',
  },
  {
    id: 'alert-4',
    flightId: 'fl-6',
    type: 'landed',
    message: 'MR-120 from Meridian has landed at Briar Cove.',
    timestamp: '2026-03-11T08:22:00',
  },
  {
    id: 'alert-5',
    flightId: 'fl-1',
    type: 'gate-change',
    message: 'BC-401 gate changed from A10 to A12.',
    timestamp: '2026-03-11T07:50:00',
  },
]

// ---------------------------------------------------------------------------
// Departure board columns for Table
// ---------------------------------------------------------------------------
export const boardColumns = [
  { id: 'flight', label: 'Flight', width: 100, sortable: true },
  { id: 'destination', label: 'Destination', width: 160, sortable: true },
  { id: 'departure', label: 'Departure', width: 100, sortable: true },
  { id: 'gate', label: 'Gate', width: 80 },
  { id: 'status', label: 'Status', width: 120 },
]

export const arrivalColumns = [
  { id: 'flight', label: 'Flight', width: 100, sortable: true },
  { id: 'origin', label: 'Origin', width: 160, sortable: true },
  { id: 'arrival', label: 'Arrival', width: 100, sortable: true },
  { id: 'gate', label: 'Gate', width: 80 },
  { id: 'status', label: 'Status', width: 120 },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function formatFlightTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function getDelayDisplay(flight: Flight): string | null {
  if (flight.delayMinutes <= 0) return null
  if (flight.delayMinutes < 60) return `+${flight.delayMinutes}m`
  const hrs = Math.floor(flight.delayMinutes / 60)
  const mins = flight.delayMinutes % 60
  return mins > 0 ? `+${hrs}h ${mins}m` : `+${hrs}h`
}

export function getDepartures(): Flight[] {
  return flights.filter(
    (f) => f.origin.code === 'BRC' && f.status !== 'landed',
  )
}

export function getArrivals(): Flight[] {
  return flights.filter(
    (f) => f.destination.code === 'BRC' || f.status === 'landed',
  )
}

export function getActiveFlights(): Flight[] {
  return flights.filter(
    (f) => f.status === 'in-flight' || f.status === 'departed',
  )
}

export function getAlertIcon(type: FlightAlert['type']): string {
  const map: Record<FlightAlert['type'], string> = {
    delay: 'codicon:warning',
    'gate-change': 'codicon:arrow-swap',
    cancellation: 'codicon:error',
    boarding: 'codicon:sign-in',
    landed: 'codicon:check',
  }
  return map[type]
}

export function getAlertVariant(type: FlightAlert['type']): string {
  const map: Record<FlightAlert['type'], string> = {
    delay: 'warning',
    'gate-change': 'primary',
    cancellation: 'danger',
    boarding: 'primary',
    landed: 'success',
  }
  return map[type]
}
