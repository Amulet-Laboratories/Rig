<script setup lang="ts">
/**
 * Waypoint — Location picker and route planner
 * Theme: Calcite | Exercises: core, nav, layout, lists, extras
 *
 * Showcase #7 — Map placeholder, location list, category filters,
 * route planner, saved places, location detail.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Input from '@core/primitives/Input.vue'
import Tabs from '@nav/Tabs.vue'
import StatusBar from '@nav/StatusBar.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import SplitView from '@layout/SplitView.vue'
import Modal from '@layout/Modal.vue'
import Collapsible from '@layout/Collapsible.vue'
import ScrollArea from '@layout/ScrollArea.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'
import Tooltip from '@extras/Tooltip.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  waypoints,
  routes,
  categoryConfig,
  modeConfig,
  getRouteWaypoints,
  getSavedWaypoints,
  renderStars,
  formatCoordinates,
  type Waypoint,
  type WaypointCategory,
  type Route,
} from './fixtures/waypoint-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const sidebarTab = ref('explore')
const sidebarTabs = [
  { id: 'explore', label: 'Explore', icon: 'codicon:compass' },
  { id: 'saved', label: 'Saved', icon: 'codicon:bookmark' },
  { id: 'routes', label: 'Routes', icon: 'codicon:git-merge' },
]

const searchQuery = ref('')
const categoryFilter = ref<WaypointCategory | null>(null)
const selectedWaypointId = ref<string | null>(null)
const showDetailModal = ref(false)
const selectedRouteId = ref<string | null>(null)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const filteredWaypoints = computed(() => {
  let items = [...waypoints]
  if (categoryFilter.value) {
    items = items.filter((w) => w.category === categoryFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.address.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }
  return items
})

const selectedWaypoint = computed(
  () => waypoints.find((w) => w.id === selectedWaypointId.value) ?? null,
)

const selectedRoute = computed(
  () => routes.find((r) => r.id === selectedRouteId.value) ?? null,
)

const crumbs = computed(() => {
  const items = [{ id: 'map', label: 'Map' }]
  if (selectedWaypoint.value) {
    items.push({ id: 'detail', label: selectedWaypoint.value.name })
  }
  return items
})

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function openWaypoint(wp: Waypoint) {
  selectedWaypointId.value = wp.id
  showDetailModal.value = true
}

function toggleSave(wp: Waypoint) {
  wp.saved = !wp.saved
  toast.add({
    message: wp.saved ? `Saved "${wp.name}"` : `Removed "${wp.name}"`,
    variant: 'success',
  })
}

function setCategoryFilter(cat: WaypointCategory | null) {
  categoryFilter.value = categoryFilter.value === cat ? null : cat
}

function selectRoute(route: Route) {
  selectedRouteId.value = selectedRouteId.value === route.id ? null : route.id
}

function startNavigation() {
  if (selectedRoute.value) {
    toast.add({
      message: `Starting navigation: ${selectedRoute.value.name}`,
      variant: 'info',
    })
  }
}

function getDirections(wp: Waypoint) {
  showDetailModal.value = false
  toast.add({ message: `Getting directions to ${wp.name}...`, variant: 'info' })
}

function getCategoryBadgeVariant(cat: WaypointCategory): 'success' | 'warning' | 'muted' {
  const color = categoryConfig[cat].color
  if (color === '#4caf50') return 'success'
  if (color === '#ff9800') return 'warning'
  return 'muted'
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'app', content: 'Waypoint', priority: 1, align: 'left' as const },
  {
    id: 'showing',
    content: `${filteredWaypoints.value.length} locations`,
    priority: 2,
    align: 'left' as const,
  },
  {
    id: 'saved',
    content: `${getSavedWaypoints().length} saved`,
    priority: 3,
    align: 'right' as const,
  },
  {
    id: 'routes',
    content: `${routes.length} routes`,
    priority: 4,
    align: 'right' as const,
  },
])
</script>

<template>
  <Story title="Waypoint" icon="codicon:compass" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="wp-shell" data-theme="calcite">
        <SplitView>
          <!-- Sidebar -->
          <template #secondary>
            <div class="wp-sidebar">
              <Tabs v-model="sidebarTab" :tabs="sidebarTabs" size="xs" />

              <!-- Explore -->
              <template v-if="sidebarTab === 'explore'">
                <div class="wp-search">
                  <Input
                    v-model="searchQuery"
                    placeholder="Search locations..."
                    clearable
                    :debounce="150"
                  >
                    <template #leading>
                      <Icon icon="codicon:search" size="sm" />
                    </template>
                  </Input>
                </div>

                <div class="wp-categories">
                  <button
                    v-for="(config, key) in categoryConfig"
                    :key="key"
                    class="wp-cat-chip"
                    :data-active="categoryFilter === key || undefined"
                    @click="setCategoryFilter(key as WaypointCategory)"
                  >
                    <Icon :icon="config.icon" size="xs" :style="{ color: config.color }" />
                    {{ config.label }}
                  </button>
                </div>

                <ScrollArea class="wp-location-scroll">
                  <div v-if="filteredWaypoints.length" class="wp-location-list">
                    <button
                      v-for="wp in filteredWaypoints"
                      :key="wp.id"
                      class="wp-location-item"
                      @click="openWaypoint(wp)"
                    >
                      <div
                        class="wp-loc-icon"
                        :style="{ background: categoryConfig[wp.category].color }"
                      >
                        <Icon :icon="wp.icon" size="xs" style="color: #fff" />
                      </div>
                      <div class="wp-loc-info">
                        <span class="wp-loc-name">{{ wp.name }}</span>
                        <span class="wp-loc-addr">{{ wp.address }}</span>
                      </div>
                      <div class="wp-loc-right">
                        <span class="wp-loc-rating">{{ wp.rating }}</span>
                        <IconButton
                          :ariaLabel="wp.saved ? 'Unsave' : 'Save'"
                          size="sm"
                          @click.stop="toggleSave(wp)"
                        >
                          <Icon
                            :icon="wp.saved ? 'codicon:bookmark' : 'codicon:bookmark'"
                            size="xs"
                            :class="{ 'wp-saved': wp.saved }"
                          />
                        </IconButton>
                      </div>
                    </button>
                  </div>
                  <div v-else class="wp-sidebar-empty">
                    <EmptyState
                      title="No locations found"
                      description="Try a different search or category."
                      icon="codicon:compass"
                    />
                  </div>
                </ScrollArea>
              </template>

              <!-- Saved -->
              <template v-else-if="sidebarTab === 'saved'">
                <ScrollArea class="wp-location-scroll">
                  <div v-if="getSavedWaypoints().length" class="wp-location-list">
                    <button
                      v-for="wp in getSavedWaypoints()"
                      :key="wp.id"
                      class="wp-location-item"
                      @click="openWaypoint(wp)"
                    >
                      <div
                        class="wp-loc-icon"
                        :style="{ background: categoryConfig[wp.category].color }"
                      >
                        <Icon :icon="wp.icon" size="xs" style="color: #fff" />
                      </div>
                      <div class="wp-loc-info">
                        <span class="wp-loc-name">{{ wp.name }}</span>
                        <span class="wp-loc-addr">{{ wp.address }}</span>
                      </div>
                      <span class="wp-loc-rating">{{ wp.rating }}</span>
                    </button>
                  </div>
                  <div v-else class="wp-sidebar-empty">
                    <EmptyState
                      title="No saved places"
                      description="Bookmark locations to find them here."
                      icon="codicon:bookmark"
                    />
                  </div>
                </ScrollArea>
              </template>

              <!-- Routes -->
              <template v-else>
                <div class="wp-route-list">
                  <Card
                    v-for="route in routes"
                    :key="route.id"
                  >
                    <button
                      class="wp-route-card"
                      :data-active="selectedRouteId === route.id || undefined"
                      @click="selectRoute(route)"
                    >
                      <div class="wp-route-header">
                        <Icon :icon="modeConfig[route.mode].icon" size="sm" />
                        <span class="wp-route-name">{{ route.name }}</span>
                        <Badge variant="muted" size="xs">{{ modeConfig[route.mode].label }}</Badge>
                      </div>
                      <div class="wp-route-meta">
                        <span>{{ route.distance }}</span>
                        <span>·</span>
                        <span>{{ route.duration }}</span>
                        <span>·</span>
                        <span>{{ route.waypointIds.length }} stops</span>
                      </div>
                    </button>
                  </Card>

                  <!-- Expanded route -->
                  <div v-if="selectedRoute" class="wp-route-detail">
                    <h4 class="wp-route-detail-title">{{ selectedRoute.name }}</h4>
                    <div class="wp-route-stops">
                      <div
                        v-for="(wp, idx) in getRouteWaypoints(selectedRoute)"
                        :key="wp.id"
                        class="wp-route-stop"
                      >
                        <div class="wp-stop-marker">
                          <span class="wp-stop-num">{{ idx + 1 }}</span>
                          <div v-if="idx < getRouteWaypoints(selectedRoute).length - 1" class="wp-stop-line" />
                        </div>
                        <div class="wp-stop-info">
                          <span class="wp-stop-name">{{ wp.name }}</span>
                          <span class="wp-stop-addr">{{ wp.address }}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="primary" size="sm" @click="startNavigation">
                      <Icon icon="codicon:play" size="sm" />
                      Start Navigation
                    </Button>
                  </div>
                </div>
              </template>
            </div>
          </template>

          <!-- Map area -->
          <template #primary>
            <div class="wp-map-area">
              <Breadcrumbs :items="crumbs" />
              <div class="wp-map-placeholder">
                <div class="wp-map-grid">
                  <!-- Waypoint markers -->
                  <div
                    v-for="wp in filteredWaypoints"
                    :key="wp.id"
                    class="wp-map-marker"
                    :style="{
                      left: `${((wp.coordinates.lng + 74.02) / 0.04) * 80 + 10}%`,
                      top: `${((40.725 - wp.coordinates.lat) / 0.025) * 80 + 10}%`,
                    }"
                  >
                    <Tooltip :text="wp.name" placement="top">
                      <button
                        class="wp-marker-dot"
                        :style="{ background: categoryConfig[wp.category].color }"
                        @click="openWaypoint(wp)"
                      >
                        <Icon :icon="wp.icon" size="xs" style="color: #fff" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div class="wp-map-label">
                  <Icon icon="codicon:compass" size="lg" style="opacity: 0.15" />
                  <span>Map View — {{ filteredWaypoints.length }} locations</span>
                </div>
              </div>
            </div>
          </template>
        </SplitView>

        <!-- Location detail modal -->
        <Modal
          :open="showDetailModal"
          ariaLabel="Location Details"
          @update:open="showDetailModal = $event"
        >
          <div v-if="selectedWaypoint" class="wp-detail">
            <div class="wp-detail-header">
              <div
                class="wp-detail-icon"
                :style="{ background: categoryConfig[selectedWaypoint.category].color }"
              >
                <Icon :icon="selectedWaypoint.icon" size="lg" style="color: #fff" />
              </div>
              <div>
                <h2 class="wp-detail-name">{{ selectedWaypoint.name }}</h2>
                <div class="wp-detail-badges">
                  <Badge variant="primary" size="sm">
                    {{ categoryConfig[selectedWaypoint.category].label }}
                  </Badge>
                  <span class="wp-detail-stars">{{ renderStars(selectedWaypoint.rating) }}</span>
                  <span class="wp-detail-rating">{{ selectedWaypoint.rating }}</span>
                </div>
              </div>
            </div>

            <p class="wp-detail-desc">{{ selectedWaypoint.description }}</p>

            <Collapsible defaultOpen>
              <template #trigger>Details</template>
              <div class="wp-detail-info-grid">
                <div class="wp-info-row">
                  <Icon icon="codicon:location" size="xs" />
                  <span>{{ selectedWaypoint.address }}</span>
                </div>
                <div class="wp-info-row">
                  <Icon icon="codicon:compass" size="xs" />
                  <span>{{ formatCoordinates(selectedWaypoint.coordinates) }}</span>
                </div>
              </div>
            </Collapsible>

            <div class="wp-detail-tags">
              <Badge v-for="tag in selectedWaypoint.tags" :key="tag" variant="muted" size="xs">
                {{ tag }}
              </Badge>
            </div>

            <div class="wp-detail-actions">
              <Button variant="ghost" size="sm" @click="toggleSave(selectedWaypoint)">
                <Icon :icon="selectedWaypoint.saved ? 'codicon:bookmark' : 'codicon:bookmark'" size="sm" />
                {{ selectedWaypoint.saved ? 'Saved' : 'Save' }}
              </Button>
              <Button variant="primary" size="sm" @click="getDirections(selectedWaypoint)">
                <Icon icon="codicon:arrow-right" size="sm" />
                Directions
              </Button>
            </div>
          </div>
        </Modal>

        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: ROUTE VIEW ================== -->
    <Variant title="Route Planner">
      <div class="wp-shell" data-theme="calcite">
        <div class="wp-route-planner">
          <header class="wp-route-header-bar">
            <h2 class="wp-page-title">
              <Icon icon="codicon:git-merge" size="sm" />
              Route Planner
            </h2>
          </header>
          <div class="wp-route-cards">
            <Card v-for="route in routes" :key="route.id">
              <div class="wp-route-full">
                <div class="wp-route-full-header">
                  <Icon :icon="modeConfig[route.mode].icon" size="sm" />
                  <h3 class="wp-route-full-name">{{ route.name }}</h3>
                  <Badge variant="primary" size="sm">{{ modeConfig[route.mode].label }}</Badge>
                </div>
                <div class="wp-route-full-meta">
                  <Badge variant="muted" size="xs">{{ route.distance }}</Badge>
                  <Badge variant="muted" size="xs">{{ route.duration }}</Badge>
                  <Badge variant="muted" size="xs">{{ route.waypointIds.length }} stops</Badge>
                </div>
                <div class="wp-route-stops">
                  <div
                    v-for="(wp, idx) in getRouteWaypoints(route)"
                    :key="wp.id"
                    class="wp-route-stop"
                  >
                    <div class="wp-stop-marker">
                      <span class="wp-stop-num">{{ idx + 1 }}</span>
                      <div v-if="idx < getRouteWaypoints(route).length - 1" class="wp-stop-line" />
                    </div>
                    <div class="wp-stop-info">
                      <span class="wp-stop-name">{{ wp.name }}</span>
                      <span class="wp-stop-addr">{{ wp.address }}</span>
                    </div>
                    <Badge
                      :variant="getCategoryBadgeVariant(wp.category)"
                      size="xs"
                    >
                      {{ categoryConfig[wp.category].label }}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: SAVED PLACES ================== -->
    <Variant title="Saved Places">
      <div class="wp-shell" data-theme="calcite">
        <div class="wp-saved-view">
          <header class="wp-route-header-bar">
            <h2 class="wp-page-title">
              <Icon icon="codicon:bookmark" size="sm" />
              Saved Places
              <Badge variant="primary" size="xs">{{ getSavedWaypoints().length }}</Badge>
            </h2>
          </header>
          <div class="wp-saved-grid">
            <Card v-for="wp in getSavedWaypoints()" :key="wp.id">
              <div class="wp-saved-card">
                <div
                  class="wp-saved-icon"
                  :style="{ background: categoryConfig[wp.category].color }"
                >
                  <Icon :icon="wp.icon" size="sm" style="color: #fff" />
                </div>
                <h4 class="wp-saved-name">{{ wp.name }}</h4>
                <p class="wp-saved-desc">{{ wp.description }}</p>
                <div class="wp-saved-meta">
                  <Badge variant="muted" size="xs">
                    {{ categoryConfig[wp.category].label }}
                  </Badge>
                  <span class="wp-saved-rating">{{ renderStars(wp.rating) }} {{ wp.rating }}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY ================== -->
    <Variant title="No Results">
      <div class="wp-shell" data-theme="calcite">
        <div class="wp-empty-center">
          <EmptyState
            title="No locations found"
            description="Try searching for a different place or adjusting your filters."
            icon="codicon:compass"
          >
            <template #action>
              <Button variant="primary" size="sm">
                <Icon icon="codicon:search" size="sm" />
                Search
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="[{ id: 'status', content: 'No results', priority: 1, align: 'left' }]" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.wp-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 650px;
  background: var(--color-background, #f5f1ed);
  color: var(--color-foreground, #0f0d0a);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

/* ---- Sidebar ---- */
.wp-sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  height: 100%;
  overflow: hidden;
}

.wp-search {
  padding: 0;
}

.wp-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.wp-cat-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 14px;
  background: none;
  color: var(--color-muted-foreground, #666);
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.1s;
}

.wp-cat-chip:hover {
  border-color: var(--color-primary, #c9956d);
}

.wp-cat-chip[data-active] {
  background: color-mix(in srgb, var(--color-primary, #c9956d) 12%, transparent);
  border-color: var(--color-primary, #c9956d);
  color: var(--color-foreground, #0f0d0a);
}

/* ---- Location list ---- */
.wp-location-scroll {
  flex: 1;
}

.wp-location-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wp-location-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;
  text-align: left;
}

.wp-location-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #000) 4%, transparent);
}

.wp-loc-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wp-loc-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.wp-loc-name {
  font-size: 13px;
  font-weight: 600;
}

.wp-loc-addr {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

.wp-loc-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.wp-loc-rating {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-warning, #ff9800);
}

.wp-saved {
  color: var(--color-primary, #c9956d);
}

/* ---- Map area ---- */
.wp-map-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
}

.wp-map-placeholder {
  flex: 1;
  border-radius: 8px;
  border: 1px solid var(--color-border, #ddd);
  background: color-mix(in srgb, var(--color-foreground, #000) 2%, var(--color-background, #fff));
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.wp-map-grid {
  position: absolute;
  inset: 0;
}

.wp-map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.wp-marker-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s;
}

.wp-marker-dot:hover {
  transform: scale(1.15);
}

.wp-map-label {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Route cards ---- */
.wp-route-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wp-route-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.wp-route-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wp-route-name {
  font-size: 13px;
  font-weight: 600;
  flex: 1;
}

.wp-route-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Route detail / stops ---- */
.wp-route-detail {
  padding: 12px;
  margin-top: 8px;
}

.wp-route-detail-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
}

.wp-route-stops {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.wp-route-stop {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-height: 48px;
}

.wp-stop-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.wp-stop-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary, #c9956d);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.wp-stop-line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: var(--color-border, #ddd);
}

.wp-stop-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
}

.wp-stop-name {
  font-size: 13px;
  font-weight: 500;
}

.wp-stop-addr {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Detail modal ---- */
.wp-detail {
  padding: 20px;
  max-width: 480px;
}

.wp-detail-header {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.wp-detail-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wp-detail-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px;
}

.wp-detail-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wp-detail-stars {
  color: var(--color-warning, #ff9800);
  font-size: 13px;
}

.wp-detail-rating {
  font-size: 12px;
  font-weight: 600;
}

.wp-detail-desc {
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 14px;
}

.wp-detail-info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
}

.wp-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.wp-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 12px 0;
}

.wp-detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ---- Route planner view ---- */
.wp-route-planner,
.wp-saved-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.wp-route-header-bar {
  padding: 16px 0;
}

.wp-page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.wp-route-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wp-route-full {
  padding: 4px;
}

.wp-route-full-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.wp-route-full-name {
  font-size: 15px;
  font-weight: 600;
  flex: 1;
  margin: 0;
}

.wp-route-full-meta {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

/* ---- Saved grid ---- */
.wp-saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.wp-saved-card {
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wp-saved-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wp-saved-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.wp-saved-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
  line-height: 1.4;
}

.wp-saved-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wp-saved-rating {
  font-size: 12px;
  color: var(--color-warning, #ff9800);
}

/* ---- Empty ---- */
.wp-sidebar-empty,
.wp-empty-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
