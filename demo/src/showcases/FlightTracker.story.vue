<script setup lang="ts">
/**
 * Flight Tracker — Real-time flight monitoring dashboard
 * Theme: Obelisk | Exercises: core, nav, layout, lists, extras
 *
 * Showcase #12 — Departure/arrival boards, flight detail,
 * live map placeholder, alerts feed, passenger list.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Input from '@core/primitives/Input.vue'
import Avatar from '@core/primitives/Avatar.vue'
import Tabs from '@nav/Tabs.vue'
import StatusBar from '@nav/StatusBar.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import Modal from '@layout/Modal.vue'
import SplitView from '@layout/SplitView.vue'
import Table from '@lists/Table.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'
import Tooltip from '@extras/Tooltip.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  flights,
  alerts,
  statusConfig,
  boardColumns,
  arrivalColumns,
  formatFlightTime,
  getDelayDisplay,
  getDepartures,
  getArrivals,
  getActiveFlights,
  getAlertIcon,
  getAlertVariant,
  type Flight,
} from './fixtures/flight-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const boardTab = ref('departures')
const boardTabs = [
  { id: 'departures', label: 'Departures', icon: 'codicon:arrow-up' },
  { id: 'arrivals', label: 'Arrivals', icon: 'codicon:arrow-down' },
]

const selectedFlightId = ref<string | null>(null)
const showFlightModal = ref(false)
const searchQuery = ref('')

const selectedFlight = computed(
  () => flights.find((f) => f.id === selectedFlightId.value) ?? null,
)

// ---------------------------------------------------------------------------
// Filtered flights
// ---------------------------------------------------------------------------
const filteredDepartures = computed(() => {
  const deps = getDepartures()
  if (!searchQuery.value) return deps
  const q = searchQuery.value.toLowerCase()
  return deps.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(q) ||
      f.destination.city.toLowerCase().includes(q) ||
      f.airline.toLowerCase().includes(q),
  )
})

const filteredArrivals = computed(() => {
  const arrs = getArrivals()
  if (!searchQuery.value) return arrs
  const q = searchQuery.value.toLowerCase()
  return arrs.filter(
    (f) =>
      f.flightNumber.toLowerCase().includes(q) ||
      f.origin.city.toLowerCase().includes(q) ||
      f.airline.toLowerCase().includes(q),
  )
})

// ---------------------------------------------------------------------------
// Table row adapters
// ---------------------------------------------------------------------------
const departureRows = computed(() =>
  filteredDepartures.value.map((f) => ({
    id: f.id,
    flight: f.flightNumber,
    destination: `${f.destination.city} (${f.destination.code})`,
    departure: formatFlightTime(f.scheduledDeparture),
    gate: `${f.terminal}-${f.gate}`,
    status: f.status,
    _raw: f,
  })),
)

const arrivalRows = computed(() =>
  filteredArrivals.value.map((f) => ({
    id: f.id,
    flight: f.flightNumber,
    origin: `${f.origin.city} (${f.origin.code})`,
    arrival: formatFlightTime(f.scheduledArrival),
    gate: `${f.terminal}-${f.gate}`,
    status: f.status,
    _raw: f,
  })),
)

// ---------------------------------------------------------------------------
// Flight selection
// ---------------------------------------------------------------------------
function openFlight(flight: Flight) {
  selectedFlightId.value = flight.id
  showFlightModal.value = true
}

function openFlightFromRow(row: Record<string, unknown>) {
  const raw = row._raw as Flight
  openFlight(raw)
}

// ---------------------------------------------------------------------------
// Map data (simulated positions)
// ---------------------------------------------------------------------------
const activeFlights = computed(() => getActiveFlights())

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'airport', content: 'BRC — Briar Cove International', priority: 1, align: 'left' as const },
  { id: 'time', content: 'Mar 11, 2026 10:30', priority: 2, align: 'left' as const },
  { id: 'active', content: `${activeFlights.value.length} in flight`, priority: 3, align: 'right' as const },
  { id: 'total', content: `${flights.length} flights`, priority: 4, align: 'right' as const },
])
</script>

<template>
  <Story title="Flight Tracker" icon="codicon:rocket" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="ft-shell" data-theme="obelisk">
        <Breadcrumbs
          :items="[
            { id: 'home', label: 'Flight Tracker' },
            { id: 'brc', label: 'Briar Cove (BRC)' },
          ]"
        />

        <SplitView>
          <template #primary>
            <div class="ft-board">
              <!-- Header -->
              <header class="ft-header">
                <div class="ft-header-left">
                  <h2 class="ft-board-title">Flight Board</h2>
                  <div class="ft-search">
                    <Input
                      v-model="searchQuery"
                      placeholder="Search flights..."
                      clearable
                      :debounce="200"
                    >
                      <template #leading>
                        <Icon icon="codicon:search" size="sm" />
                      </template>
                    </Input>
                  </div>
                </div>
                <Tabs v-model="boardTab" :tabs="boardTabs" />
              </header>

              <!-- Departure board -->
              <div v-if="boardTab === 'departures'" class="ft-table-wrap">
                <Table
                  :columns="boardColumns"
                  :rows="(departureRows as unknown as Record<string, unknown>[])"
                  row-key="id"
                  :sort="{ column: 'departure', direction: 'asc' }"
                  @row-click="openFlightFromRow($event as unknown as Record<string, unknown>)"
                >
                  <template #cell-flight="{ row }">
                    <div class="ft-flight-cell">
                      <Icon :icon="(row as Record<string, unknown>)._raw ? ((row as Record<string, unknown>)._raw as Flight).airlineIcon : 'codicon:cloud'" size="sm" />
                      <strong>{{ (row as Record<string, unknown>).flight }}</strong>
                    </div>
                  </template>
                  <template #cell-status="{ row }">
                    <Badge
                      :variant="(statusConfig[((row as Record<string, unknown>).status as Flight['status'])].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')"
                      size="xs"
                    >
                      <Icon :icon="statusConfig[((row as Record<string, unknown>).status as Flight['status'])].icon" size="xs" />
                      {{ statusConfig[((row as Record<string, unknown>).status as Flight['status'])].label }}
                    </Badge>
                  </template>
                </Table>
              </div>

              <!-- Arrival board -->
              <div v-else class="ft-table-wrap">
                <Table
                  :columns="arrivalColumns"
                  :rows="(arrivalRows as unknown as Record<string, unknown>[])"
                  row-key="id"
                  :sort="{ column: 'arrival', direction: 'asc' }"
                  @row-click="openFlightFromRow($event as unknown as Record<string, unknown>)"
                >
                  <template #cell-flight="{ row }">
                    <div class="ft-flight-cell">
                      <Icon :icon="(row as Record<string, unknown>)._raw ? ((row as Record<string, unknown>)._raw as Flight).airlineIcon : 'codicon:cloud'" size="sm" />
                      <strong>{{ (row as Record<string, unknown>).flight }}</strong>
                    </div>
                  </template>
                  <template #cell-status="{ row }">
                    <Badge
                      :variant="(statusConfig[((row as Record<string, unknown>).status as Flight['status'])].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')"
                      size="xs"
                    >
                      <Icon :icon="statusConfig[((row as Record<string, unknown>).status as Flight['status'])].icon" size="xs" />
                      {{ statusConfig[((row as Record<string, unknown>).status as Flight['status'])].label }}
                    </Badge>
                  </template>
                </Table>
              </div>
            </div>
          </template>

          <template #secondary>
            <!-- Sidebar: Map placeholder + active flights -->
            <div class="ft-sidebar">
              <!-- Map placeholder -->
              <Card>
                <template #header>
                  <div class="ft-map-header">
                    <Icon icon="codicon:map" size="sm" />
                    <span>Live Map</span>
                  </div>
                </template>
                <div class="ft-map-placeholder">
                  <div class="ft-map-grid">
                    <div
                      v-for="flight in activeFlights"
                      :key="flight.id"
                      class="ft-map-dot"
                      :style="{
                        left: `${30 + flight.progress * 0.4}%`,
                        top: `${20 + Math.random() * 50}%`,
                      }"
                    >
                      <Tooltip :text="`${flight.flightNumber} — ${flight.altitude?.toLocaleString() ?? 0}ft`">
                        <span class="ft-plane-icon">
                          <Icon icon="codicon:rocket" size="sm" />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                  <span class="ft-map-label">{{ activeFlights.length }} active flights</span>
                </div>
              </Card>

              <!-- Active flights list -->
              <div class="ft-active-list">
                <h3 class="ft-section-label">Active Flights</h3>
                <button
                  v-for="flight in activeFlights"
                  :key="flight.id"
                  class="ft-active-item"
                  @click="openFlight(flight)"
                >
                  <div class="ft-active-info">
                    <Icon :icon="flight.airlineIcon" size="sm" />
                    <div>
                      <strong>{{ flight.flightNumber }}</strong>
                      <span class="ft-route">
                        {{ flight.origin.code }} → {{ flight.destination.code }}
                      </span>
                    </div>
                  </div>
                  <div class="ft-active-stat">
                    <div class="ft-progress-mini">
                      <div class="ft-progress-bar-mini" :style="{ width: `${flight.progress}%` }" />
                    </div>
                    <span class="ft-progress-label">{{ flight.progress }}%</span>
                  </div>
                </button>
              </div>

              <!-- Alerts feed -->
              <div class="ft-alerts">
                <h3 class="ft-section-label">
                  <Icon icon="codicon:bell" size="sm" />
                  Alerts
                  <Badge variant="primary" size="xs">{{ alerts.length }}</Badge>
                </h3>
                <div
                  v-for="alert in alerts"
                  :key="alert.id"
                  class="ft-alert-item"
                >
                  <Icon
                    :icon="getAlertIcon(alert.type)"
                    size="sm"
                    :style="{ color: statusConfig[flights.find(f => f.id === alert.flightId)?.status ?? 'on-time'].color }"
                  />
                  <div class="ft-alert-info">
                    <span class="ft-alert-msg">{{ alert.message }}</span>
                    <span class="ft-alert-time">{{ formatFlightTime(alert.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </SplitView>

        <!-- Flight detail modal -->
        <Modal
          :open="showFlightModal"
          ariaLabel="Flight Details"
          @update:open="showFlightModal = $event"
        >
          <div v-if="selectedFlight" class="ft-detail">
            <div class="ft-detail-head">
              <div class="ft-detail-top">
                <Icon :icon="selectedFlight.airlineIcon" size="lg" />
                <div>
                  <h2 class="ft-detail-flight">{{ selectedFlight.flightNumber }}</h2>
                  <span class="ft-detail-airline">{{ selectedFlight.airline }}</span>
                </div>
                <Badge
                  :variant="(statusConfig[selectedFlight.status].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')"
                  size="sm"
                >
                  <Icon :icon="statusConfig[selectedFlight.status].icon" size="xs" />
                  {{ statusConfig[selectedFlight.status].label }}
                </Badge>
              </div>

              <!-- Route -->
              <div class="ft-route-card">
                <div class="ft-route-end">
                  <span class="ft-route-code">{{ selectedFlight.origin.code }}</span>
                  <span class="ft-route-city">{{ selectedFlight.origin.city }}</span>
                  <span class="ft-route-time">{{ formatFlightTime(selectedFlight.scheduledDeparture) }}</span>
                  <span v-if="selectedFlight.actualDeparture" class="ft-route-actual">
                    Actual: {{ formatFlightTime(selectedFlight.actualDeparture) }}
                  </span>
                </div>
                <div class="ft-route-line">
                  <div class="ft-route-progress" :style="{ width: `${selectedFlight.progress}%` }" />
                  <Icon v-if="selectedFlight.progress > 0 && selectedFlight.progress < 100" icon="codicon:rocket" size="sm" class="ft-route-plane" :style="{ left: `${selectedFlight.progress}%` }" />
                </div>
                <div class="ft-route-end">
                  <span class="ft-route-code">{{ selectedFlight.destination.code }}</span>
                  <span class="ft-route-city">{{ selectedFlight.destination.city }}</span>
                  <span class="ft-route-time">{{ formatFlightTime(selectedFlight.scheduledArrival) }}</span>
                  <span v-if="selectedFlight.actualArrival" class="ft-route-actual">
                    Actual: {{ formatFlightTime(selectedFlight.actualArrival) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Info grid -->
            <div class="ft-detail-grid">
              <div class="ft-detail-cell">
                <span class="ft-detail-label">Aircraft</span>
                <span class="ft-detail-val">{{ selectedFlight.aircraft }}</span>
              </div>
              <div class="ft-detail-cell">
                <span class="ft-detail-label">Gate</span>
                <span class="ft-detail-val">{{ selectedFlight.terminal }}-{{ selectedFlight.gate }}</span>
              </div>
              <div v-if="selectedFlight.altitude" class="ft-detail-cell">
                <span class="ft-detail-label">Altitude</span>
                <span class="ft-detail-val">{{ selectedFlight.altitude.toLocaleString() }} ft</span>
              </div>
              <div v-if="selectedFlight.speed" class="ft-detail-cell">
                <span class="ft-detail-label">Speed</span>
                <span class="ft-detail-val">{{ selectedFlight.speed }} kts</span>
              </div>
              <div v-if="selectedFlight.delayMinutes > 0" class="ft-detail-cell">
                <span class="ft-detail-label">Delay</span>
                <span class="ft-detail-val ft-delay">{{ getDelayDisplay(selectedFlight) }}</span>
              </div>
            </div>

            <!-- Passengers -->
            <div v-if="selectedFlight.passengers.length" class="ft-passengers">
              <h4 class="ft-section-label">Passengers</h4>
              <div class="ft-passenger-list">
                <div v-for="p in selectedFlight.passengers" :key="p.id" class="ft-passenger">
                  <Avatar :name="p.name" :color="p.color" size="sm" />
                  <div>
                    <span class="ft-pass-name">{{ p.name }}</span>
                    <span class="ft-pass-role">{{ p.role }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="ft-detail-actions">
              <Button variant="ghost" size="sm" @click="showFlightModal = false">Close</Button>
              <Button variant="primary" size="sm" @click="toast.add({ message: `Tracking ${selectedFlight.flightNumber}`, variant: 'success' }); showFlightModal = false">
                <Icon icon="codicon:bell" size="sm" />
                Track Flight
              </Button>
            </div>
          </div>
        </Modal>

        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: DEPARTURE BOARD ================== -->
    <Variant title="Departure Board">
      <div class="ft-shell" data-theme="obelisk">
        <header class="ft-board-header-full">
          <Icon icon="codicon:arrow-up" size="lg" />
          <h1 class="ft-board-heading">Departures — Briar Cove (BRC)</h1>
        </header>
        <div class="ft-table-fullscreen">
          <Table
            :columns="boardColumns"
            :rows="(departureRows as unknown as Record<string, unknown>[])"
            row-key="id"
            :sort="{ column: 'departure', direction: 'asc' }"
          >
            <template #cell-flight="{ row }">
              <div class="ft-flight-cell">
                <Icon :icon="(row as Record<string, unknown>)._raw ? ((row as Record<string, unknown>)._raw as Flight).airlineIcon : 'codicon:cloud'" size="sm" />
                <strong>{{ (row as Record<string, unknown>).flight }}</strong>
              </div>
            </template>
            <template #cell-status="{ row }">
              <Badge
                :variant="(statusConfig[((row as Record<string, unknown>).status as Flight['status'])].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')"
                size="sm"
              >
                <Icon :icon="statusConfig[((row as Record<string, unknown>).status as Flight['status'])].icon" size="xs" />
                {{ statusConfig[((row as Record<string, unknown>).status as Flight['status'])].label }}
              </Badge>
            </template>
          </Table>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: ALERTS FEED ================== -->
    <Variant title="Alerts Feed">
      <div class="ft-shell" data-theme="obelisk">
        <div class="ft-alerts-full">
          <h2 class="ft-alerts-heading">
            <Icon icon="codicon:bell" size="lg" />
            Flight Alerts
            <Badge variant="primary" size="sm">{{ alerts.length }}</Badge>
          </h2>
          <div class="ft-alerts-list">
            <Card
              v-for="alert in alerts"
              :key="alert.id"
            >
              <div class="ft-alert-card-inner">
                <div class="ft-alert-card-left">
                  <Icon :icon="getAlertIcon(alert.type)" size="md" />
                  <Badge :variant="(getAlertVariant(alert.type) as 'success' | 'warning' | 'danger' | 'primary')" size="xs">
                    {{ alert.type.replace('-', ' ') }}
                  </Badge>
                </div>
                <div class="ft-alert-card-right">
                  <p class="ft-alert-card-msg">{{ alert.message }}</p>
                  <span class="ft-alert-card-time">{{ formatFlightTime(alert.timestamp) }}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: FLIGHT DETAIL ================== -->
    <Variant title="Flight Detail">
      <div class="ft-shell" data-theme="obelisk">
        <div class="ft-detail-standalone">
          <div class="ft-detail">
            <div class="ft-detail-head">
              <div class="ft-detail-top">
                <Icon :icon="flights[0]!.airlineIcon" size="lg" />
                <div>
                  <h2 class="ft-detail-flight">{{ flights[0]!.flightNumber }}</h2>
                  <span class="ft-detail-airline">{{ flights[0]!.airline }}</span>
                </div>
                <Badge
                  :variant="(statusConfig[flights[0]!.status].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')"
                  size="sm"
                >
                  <Icon :icon="statusConfig[flights[0]!.status].icon" size="xs" />
                  {{ statusConfig[flights[0]!.status].label }}
                </Badge>
              </div>

              <div class="ft-route-card">
                <div class="ft-route-end">
                  <span class="ft-route-code">{{ flights[0]!.origin.code }}</span>
                  <span class="ft-route-city">{{ flights[0]!.origin.city }}</span>
                  <span class="ft-route-time">{{ formatFlightTime(flights[0]!.scheduledDeparture) }}</span>
                </div>
                <div class="ft-route-line">
                  <div class="ft-route-progress" :style="{ width: `${flights[0]!.progress}%` }" />
                  <Icon icon="codicon:rocket" size="sm" class="ft-route-plane" :style="{ left: `${flights[0]!.progress}%` }" />
                </div>
                <div class="ft-route-end">
                  <span class="ft-route-code">{{ flights[0]!.destination.code }}</span>
                  <span class="ft-route-city">{{ flights[0]!.destination.city }}</span>
                  <span class="ft-route-time">{{ formatFlightTime(flights[0]!.scheduledArrival) }}</span>
                </div>
              </div>
            </div>

            <div class="ft-detail-grid">
              <div class="ft-detail-cell">
                <span class="ft-detail-label">Aircraft</span>
                <span class="ft-detail-val">{{ flights[0]!.aircraft }}</span>
              </div>
              <div class="ft-detail-cell">
                <span class="ft-detail-label">Gate</span>
                <span class="ft-detail-val">{{ flights[0]!.terminal }}-{{ flights[0]!.gate }}</span>
              </div>
              <div class="ft-detail-cell">
                <span class="ft-detail-label">Altitude</span>
                <span class="ft-detail-val">{{ flights[0]!.altitude?.toLocaleString() }} ft</span>
              </div>
              <div class="ft-detail-cell">
                <span class="ft-detail-label">Speed</span>
                <span class="ft-detail-val">{{ flights[0]!.speed }} kts</span>
              </div>
            </div>

            <div v-if="flights[0]!.passengers.length" class="ft-passengers">
              <h4 class="ft-section-label">Passengers</h4>
              <div class="ft-passenger-list">
                <div v-for="p in flights[0]!.passengers" :key="p.id" class="ft-passenger">
                  <Avatar :name="p.name" :color="p.color" size="sm" />
                  <div>
                    <span class="ft-pass-name">{{ p.name }}</span>
                    <span class="ft-pass-role">{{ p.role }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY STATE ================== -->
    <Variant title="No Flights">
      <div class="ft-shell" data-theme="obelisk">
        <div class="ft-empty-center">
          <EmptyState
            title="No flights found"
            description="There are currently no flights matching your search criteria."
            icon="codicon:rocket"
          >
            <template #action>
              <Button variant="primary" size="sm">
                <Icon icon="codicon:refresh" size="sm" />
                Refresh Board
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.ft-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #0f0d0a);
  color: var(--color-foreground, #f5f1ed);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

/* ---- Board header ---- */
.ft-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border, #333);
  gap: 16px;
  flex-wrap: wrap;
}

.ft-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.ft-board-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

.ft-search {
  max-width: 260px;
}

/* ---- Table ---- */
.ft-board {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.ft-table-wrap {
  flex: 1;
  overflow-y: auto;
}

.ft-flight-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ---- Sidebar ---- */
.ft-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}

/* ---- Map placeholder ---- */
.ft-map-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 13px;
}

.ft-map-placeholder {
  position: relative;
  height: 200px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 3%, transparent);
  border-radius: 6px;
  overflow: hidden;
}

.ft-map-grid {
  position: absolute;
  inset: 0;
}

.ft-map-dot {
  position: absolute;
  transform: translate(-50%, -50%);
}

.ft-plane-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-primary, #c9956d) 30%, transparent);
  color: var(--color-primary, #c9956d);
  cursor: pointer;
}

.ft-map-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Active flights ---- */
.ft-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px;
}

.ft-active-list {
  display: flex;
  flex-direction: column;
}

.ft-active-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;
}

.ft-active-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
}

.ft-active-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ft-active-info div {
  display: flex;
  flex-direction: column;
}

.ft-route {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

.ft-active-stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ft-progress-mini {
  width: 60px;
  height: 3px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 10%, transparent);
  border-radius: 2px;
  overflow: hidden;
}

.ft-progress-bar-mini {
  height: 100%;
  background: var(--color-primary, #c9956d);
  border-radius: 2px;
}

.ft-progress-label {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--color-muted-foreground, #888);
}

/* ---- Alerts ---- */
.ft-alerts {
  display: flex;
  flex-direction: column;
}

.ft-alert-item {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
}

.ft-alert-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ft-alert-msg {
  font-size: 12px;
  line-height: 1.4;
}

.ft-alert-time {
  font-size: 10px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Flight detail ---- */
.ft-detail {
  padding: 20px;
  max-width: 600px;
}

.ft-detail-standalone {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px;
  overflow-y: auto;
}

.ft-detail-head {
  margin-bottom: 20px;
}

.ft-detail-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.ft-detail-flight {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.ft-detail-airline {
  font-size: 13px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Route card ---- */
.ft-route-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 4%, transparent);
}

.ft-route-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.ft-route-code {
  font-size: 20px;
  font-weight: 700;
}

.ft-route-city {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

.ft-route-time {
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
}

.ft-route-actual {
  font-size: 11px;
  color: var(--color-warning, #ff9800);
}

.ft-route-line {
  flex: 1;
  height: 3px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 10%, transparent);
  border-radius: 2px;
  position: relative;
}

.ft-route-progress {
  height: 100%;
  background: var(--color-primary, #c9956d);
  border-radius: 2px;
}

.ft-route-plane {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-primary, #c9956d);
}

/* ---- Detail grid ---- */
.ft-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.ft-detail-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 3%, transparent);
}

.ft-detail-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #888);
}

.ft-detail-val {
  font-size: 15px;
  font-weight: 600;
}

.ft-delay {
  color: var(--color-warning, #ff9800);
}

/* ---- Passengers ---- */
.ft-passengers {
  margin-top: 16px;
}

.ft-passenger-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ft-passenger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
}

.ft-passenger:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 3%, transparent);
}

.ft-pass-name {
  font-size: 13px;
  font-weight: 500;
  display: block;
}

.ft-pass-role {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

.ft-detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

/* ---- Departure board fullscreen ---- */
.ft-board-header-full {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border, #333);
}

.ft-board-heading {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.ft-table-fullscreen {
  flex: 1;
  overflow-y: auto;
}

/* ---- Alerts full ---- */
.ft-alerts-full {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.ft-alerts-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px;
}

.ft-alerts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ft-alert-card-inner {
  display: flex;
  gap: 14px;
}

.ft-alert-card-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 80px;
}

.ft-alert-card-right {
  flex: 1;
}

.ft-alert-card-msg {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.ft-alert-card-time {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin-top: 4px;
  display: block;
}

/* ---- Empty ---- */
.ft-empty-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
