<script setup lang="ts">
/**
 * Signal Feed — Real-time data feed with filtering
 * Theme: Obelisk | Exercises: core, nav, layout, lists, extras
 *
 * Showcase #6 — Live signal feed, severity filtering,
 * source filtering, pinned signals, metadata display.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Input from '@core/primitives/Input.vue'
import Avatar from '@core/primitives/Avatar.vue'
import StatusBar from '@nav/StatusBar.vue'
import SplitView from '@layout/SplitView.vue'
import Modal from '@layout/Modal.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  signals,
  severityConfig,
  sourceConfig,
  filterSignals,
  getRelativeTime,
  getUnreadCount,
  getCriticalCount,
  getPinnedSignals,
  type Signal,
  type SignalSeverity,
  type SignalSource,
  type FilterState,
} from './fixtures/signal-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const filter = ref<FilterState>({
  severity: [],
  source: [],
  readStatus: 'all',
})

const searchQuery = ref('')
const selectedSignalId = ref<string | null>(null)
const showDetailModal = ref(false)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const filteredSignals = computed(() => {
  let items = filterSignals(signals, filter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.message.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }
  return items
})

const selectedSignal = computed(
  () => signals.find((s) => s.id === selectedSignalId.value) ?? null,
)

const pinnedSignals = computed(() => getPinnedSignals())

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function toggleSeverityFilter(sev: SignalSeverity) {
  const idx = filter.value.severity.indexOf(sev)
  if (idx >= 0) filter.value.severity.splice(idx, 1)
  else filter.value.severity.push(sev)
}

function toggleSourceFilter(src: SignalSource) {
  const idx = filter.value.source.indexOf(src)
  if (idx >= 0) filter.value.source.splice(idx, 1)
  else filter.value.source.push(src)
}

function openSignal(signal: Signal) {
  selectedSignalId.value = signal.id
  showDetailModal.value = true
}

function clearFilters() {
  filter.value = { severity: [], source: [], readStatus: 'all' }
  searchQuery.value = ''
}

function acknowledgeSignal(signal: Signal) {
  toast.add({ message: `${signal.title} acknowledged`, variant: 'success' })
  showDetailModal.value = false
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'feed', content: 'Signal Feed', priority: 1, align: 'left' as const },
  { id: 'unread', content: `${getUnreadCount()} unread`, priority: 2, align: 'left' as const },
  { id: 'critical', content: `${getCriticalCount()} critical`, priority: 3, align: 'right' as const },
  { id: 'total', content: `${signals.length} signals`, priority: 4, align: 'right' as const },
])
</script>

<template>
  <Story title="Signal Feed" icon="codicon:pulse" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="sf-shell" data-theme="obelisk">
        <SplitView>
          <template #primary>
            <div class="sf-feed">
              <!-- Header -->
              <header class="sf-header">
                <div class="sf-header-top">
                  <h2 class="sf-title">
                    <Icon icon="codicon:pulse" size="sm" />
                    Signal Feed
                    <Badge variant="primary" size="xs">{{ filteredSignals.length }}</Badge>
                  </h2>
                  <div class="sf-header-actions">
                    <Button
                      v-if="filter.severity.length || filter.source.length || filter.readStatus !== 'all'"
                      variant="ghost"
                      size="sm"
                      @click="clearFilters"
                    >
                      <Icon icon="codicon:clear-all" size="sm" />
                      Clear
                    </Button>
                  </div>
                </div>
                <div class="sf-search">
                  <Input
                    v-model="searchQuery"
                    placeholder="Search signals..."
                    clearable
                    :debounce="200"
                  >
                    <template #leading>
                      <Icon icon="codicon:search" size="sm" />
                    </template>
                  </Input>
                </div>
              </header>

              <!-- Signal list -->
              <div v-if="filteredSignals.length" class="sf-list">
                <button
                  v-for="signal in filteredSignals"
                  :key="signal.id"
                  class="sf-signal"
                  :data-severity="signal.severity"
                  :data-read="signal.read || undefined"
                  :data-pinned="signal.pinned || undefined"
                  @click="openSignal(signal)"
                >
                  <div class="sf-signal-icon">
                    <Icon
                      :icon="severityConfig[signal.severity].icon"
                      size="sm"
                      :style="{ color: severityConfig[signal.severity].color }"
                    />
                  </div>
                  <div class="sf-signal-content">
                    <div class="sf-signal-top">
                      <span class="sf-signal-title">
                        <Icon v-if="signal.pinned" icon="codicon:pin" size="xs" class="sf-pin" />
                        {{ signal.title }}
                      </span>
                      <span class="sf-signal-time">{{ getRelativeTime(signal.timestamp) }}</span>
                    </div>
                    <p class="sf-signal-msg">{{ signal.message }}</p>
                    <div class="sf-signal-meta">
                      <Badge :variant="(severityConfig[signal.severity].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')" size="xs">
                        {{ severityConfig[signal.severity].label }}
                      </Badge>
                      <Badge variant="muted" size="xs">
                        <Icon :icon="sourceConfig[signal.source].icon" size="xs" />
                        {{ sourceConfig[signal.source].label }}
                      </Badge>
                      <Badge
                        v-for="tag in signal.tags.slice(0, 2)"
                        :key="tag"
                        variant="muted"
                        size="xs"
                      >
                        {{ tag }}
                      </Badge>
                      <span v-if="!signal.read" class="sf-unread-dot" />
                    </div>
                  </div>
                </button>
              </div>

              <div v-else class="sf-empty">
                <EmptyState
                  title="No signals"
                  description="No signals match your current filters."
                  icon="codicon:pulse"
                >
                  <template #action>
                    <Button variant="primary" size="sm" @click="clearFilters">
                      Clear Filters
                    </Button>
                  </template>
                </EmptyState>
              </div>
            </div>
          </template>

          <template #secondary>
            <div class="sf-sidebar">
              <!-- Severity filters -->
              <section class="sf-filter-section">
                <h3 class="sf-filter-label">Severity</h3>
                <div class="sf-filter-chips">
                  <button
                    v-for="(config, key) in severityConfig"
                    :key="key"
                    class="sf-chip"
                    :data-active="filter.severity.includes(key as SignalSeverity) || undefined"
                    @click="toggleSeverityFilter(key as SignalSeverity)"
                  >
                    <Icon :icon="config.icon" size="xs" :style="{ color: config.color }" />
                    {{ config.label }}
                    <Badge variant="muted" size="xs">
                      {{ signals.filter(s => s.severity === key).length }}
                    </Badge>
                  </button>
                </div>
              </section>

              <!-- Source filters -->
              <section class="sf-filter-section">
                <h3 class="sf-filter-label">Source</h3>
                <div class="sf-filter-chips">
                  <button
                    v-for="(config, key) in sourceConfig"
                    :key="key"
                    class="sf-chip"
                    :data-active="filter.source.includes(key as SignalSource) || undefined"
                    @click="toggleSourceFilter(key as SignalSource)"
                  >
                    <Icon :icon="config.icon" size="xs" />
                    {{ config.label }}
                    <Badge variant="muted" size="xs">
                      {{ signals.filter(s => s.source === key).length }}
                    </Badge>
                  </button>
                </div>
              </section>

              <!-- Read status -->
              <section class="sf-filter-section">
                <h3 class="sf-filter-label">Status</h3>
                <div class="sf-filter-chips">
                  <button
                    v-for="opt in (['all', 'unread', 'read'] as const)"
                    :key="opt"
                    class="sf-chip"
                    :data-active="filter.readStatus === opt || undefined"
                    @click="filter.readStatus = opt"
                  >
                    {{ opt.charAt(0).toUpperCase() + opt.slice(1) }}
                  </button>
                </div>
              </section>

              <!-- Pinned signals -->
              <section class="sf-filter-section">
                <h3 class="sf-filter-label">
                  <Icon icon="codicon:pin" size="xs" />
                  Pinned
                </h3>
                <div class="sf-pinned-list">
                  <button
                    v-for="sig in pinnedSignals"
                    :key="sig.id"
                    class="sf-pinned-item"
                    @click="openSignal(sig)"
                  >
                    <Icon
                      :icon="severityConfig[sig.severity].icon"
                      size="xs"
                      :style="{ color: severityConfig[sig.severity].color }"
                    />
                    <span>{{ sig.title }}</span>
                  </button>
                </div>
              </section>
            </div>
          </template>
        </SplitView>

        <!-- Detail modal -->
        <Modal
          :open="showDetailModal"
          ariaLabel="Signal Details"
          @update:open="showDetailModal = $event"
        >
          <div v-if="selectedSignal" class="sf-detail">
            <div class="sf-detail-header">
              <Icon
                :icon="severityConfig[selectedSignal.severity].icon"
                size="lg"
                :style="{ color: severityConfig[selectedSignal.severity].color }"
              />
              <div>
                <h2 class="sf-detail-title">{{ selectedSignal.title }}</h2>
                <div class="sf-detail-badges">
                  <Badge :variant="(severityConfig[selectedSignal.severity].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')" size="sm">
                    {{ severityConfig[selectedSignal.severity].label }}
                  </Badge>
                  <Badge variant="muted" size="sm">
                    <Icon :icon="sourceConfig[selectedSignal.source].icon" size="xs" />
                    {{ sourceConfig[selectedSignal.source].label }}
                  </Badge>
                  <span class="sf-detail-time">{{ getRelativeTime(selectedSignal.timestamp) }}</span>
                </div>
              </div>
            </div>

            <p class="sf-detail-msg">{{ selectedSignal.message }}</p>

            <!-- Metadata -->
            <div v-if="selectedSignal.metadata" class="sf-metadata">
              <h4 class="sf-meta-title">Metadata</h4>
              <div class="sf-meta-grid">
                <div v-for="(val, key) in selectedSignal.metadata" :key="key" class="sf-meta-item">
                  <span class="sf-meta-key">{{ key }}</span>
                  <span class="sf-meta-val">{{ val }}</span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="sf-detail-tags">
              <Badge v-for="tag in selectedSignal.tags" :key="tag" variant="muted" size="xs">
                {{ tag }}
              </Badge>
            </div>

            <!-- Author -->
            <div v-if="selectedSignal.author" class="sf-detail-author">
              <Avatar :name="selectedSignal.author.name" :color="selectedSignal.author.color" size="sm" />
              <div>
                <span class="sf-author-name">{{ selectedSignal.author.name }}</span>
                <span class="sf-author-role">{{ selectedSignal.author.role }}</span>
              </div>
            </div>

            <div class="sf-detail-actions">
              <Button variant="ghost" size="sm" @click="showDetailModal = false">Close</Button>
              <Button variant="primary" size="sm" @click="acknowledgeSignal(selectedSignal)">
                <Icon icon="codicon:check" size="sm" />
                Acknowledge
              </Button>
            </div>
          </div>
        </Modal>

        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: CRITICAL ONLY ================== -->
    <Variant title="Critical Signals">
      <div class="sf-shell" data-theme="obelisk">
        <div class="sf-feed sf-full">
          <header class="sf-header">
            <h2 class="sf-title">
              <Icon icon="codicon:error" size="sm" style="color: var(--color-danger, #e53935)" />
              Critical Signals
              <Badge variant="danger" size="xs">{{ getCriticalCount() }}</Badge>
            </h2>
          </header>
          <div class="sf-list">
            <div
              v-for="signal in signals.filter(s => s.severity === 'critical')"
              :key="signal.id"
              class="sf-signal"
              data-severity="critical"
            >
              <div class="sf-signal-icon">
                <Icon icon="codicon:error" size="sm" style="color: var(--color-danger, #e53935)" />
              </div>
              <div class="sf-signal-content">
                <div class="sf-signal-top">
                  <span class="sf-signal-title">{{ signal.title }}</span>
                  <span class="sf-signal-time">{{ getRelativeTime(signal.timestamp) }}</span>
                </div>
                <p class="sf-signal-msg">{{ signal.message }}</p>
                <div v-if="signal.metadata" class="sf-inline-meta">
                  <span v-for="(val, key) in signal.metadata" :key="key" class="sf-meta-chip">
                    {{ key }}: {{ val }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: PINNED ================== -->
    <Variant title="Pinned Signals">
      <div class="sf-shell" data-theme="obelisk">
        <div class="sf-feed sf-full">
          <header class="sf-header">
            <h2 class="sf-title">
              <Icon icon="codicon:pin" size="sm" />
              Pinned Signals
              <Badge variant="primary" size="xs">{{ pinnedSignals.length }}</Badge>
            </h2>
          </header>
          <div class="sf-list">
            <Card
              v-for="signal in pinnedSignals"
              :key="signal.id"
            >
              <template #header>
                <div class="sf-card-header">
                  <Icon
                    :icon="severityConfig[signal.severity].icon"
                    size="sm"
                    :style="{ color: severityConfig[signal.severity].color }"
                  />
                  <span class="sf-signal-title">{{ signal.title }}</span>
                  <Badge :variant="(severityConfig[signal.severity].variant as 'success' | 'warning' | 'danger' | 'primary' | 'muted')" size="xs">
                    {{ severityConfig[signal.severity].label }}
                  </Badge>
                </div>
              </template>
              <p class="sf-signal-msg">{{ signal.message }}</p>
              <div v-if="signal.metadata" class="sf-inline-meta">
                <span v-for="(val, key) in signal.metadata" :key="key" class="sf-meta-chip">
                  {{ key }}: {{ val }}
                </span>
              </div>
              <template #footer>
                <div class="sf-card-footer">
                  <span class="sf-signal-time">{{ getRelativeTime(signal.timestamp) }}</span>
                  <Button variant="primary" size="sm">
                    <Icon icon="codicon:check" size="sm" />
                    Acknowledge
                  </Button>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY ================== -->
    <Variant title="Empty Feed">
      <div class="sf-shell" data-theme="obelisk">
        <div class="sf-empty-center">
          <EmptyState
            title="All clear"
            description="No active signals. All systems are operating normally."
            icon="codicon:check-all"
          >
            <template #action>
              <Button variant="ghost" size="sm">
                <Icon icon="codicon:refresh" size="sm" />
                Refresh
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="[{ id: 'status', content: 'All systems normal', priority: 1, align: 'left' }]" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.sf-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #0f0d0a);
  color: var(--color-foreground, #f5f1ed);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

/* ---- Feed ---- */
.sf-feed {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sf-feed.sf-full {
  padding: 0 24px;
}

/* ---- Header ---- */
.sf-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border, #333);
}

.sf-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.sf-header-actions {
  display: flex;
  gap: 6px;
}

.sf-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.sf-search {
  max-width: 100%;
}

/* ---- Signal list ---- */
.sf-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.sf-signal {
  display: flex;
  gap: 12px;
  padding: 12px 20px;
  border: none;
  background: none;
  color: inherit;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.1s;
}

.sf-signal:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 4%, transparent);
}

.sf-signal[data-severity='critical'] {
  border-left-color: var(--color-danger, #e53935);
}

.sf-signal[data-severity='warning'] {
  border-left-color: var(--color-warning, #ff9800);
}

.sf-signal[data-read] {
  opacity: 0.7;
}

.sf-signal-icon {
  flex-shrink: 0;
  padding-top: 2px;
}

.sf-signal-content {
  flex: 1;
  min-width: 0;
}

.sf-signal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.sf-signal-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
}

.sf-pin {
  color: var(--color-primary, #c9956d);
}

.sf-signal-time {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
  flex-shrink: 0;
}

.sf-signal-msg {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-muted-foreground, #aaa);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sf-signal-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.sf-unread-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary, #c9956d);
  flex-shrink: 0;
}

/* ---- Sidebar ---- */
.sf-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}

.sf-filter-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sf-filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #888);
  margin: 0;
}

.sf-filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sf-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--color-border, #333);
  border-radius: 16px;
  background: none;
  color: var(--color-muted-foreground, #888);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.1s;
}

.sf-chip:hover {
  border-color: var(--color-primary, #c9956d);
  color: var(--color-foreground, #fff);
}

.sf-chip[data-active] {
  background: color-mix(in srgb, var(--color-primary, #c9956d) 15%, transparent);
  border-color: var(--color-primary, #c9956d);
  color: var(--color-foreground, #fff);
}

/* ---- Pinned ---- */
.sf-pinned-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sf-pinned-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s;
}

.sf-pinned-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
}

/* ---- Detail modal ---- */
.sf-detail {
  padding: 20px;
  max-width: 550px;
}

.sf-detail-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.sf-detail-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px;
}

.sf-detail-badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sf-detail-time {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

.sf-detail-msg {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px;
}

/* ---- Metadata ---- */
.sf-metadata {
  margin-bottom: 16px;
}

.sf-meta-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #888);
  margin: 0 0 8px;
}

.sf-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.sf-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 4%, transparent);
}

.sf-meta-key {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #888);
}

.sf-meta-val {
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.sf-inline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.sf-meta-chip {
  padding: 2px 8px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
  font-size: 11px;
  font-family: monospace;
  color: var(--color-muted-foreground, #aaa);
}

/* ---- Tags ---- */
.sf-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
}

/* ---- Author ---- */
.sf-detail-author {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 3%, transparent);
  margin-bottom: 16px;
}

.sf-author-name {
  font-size: 13px;
  font-weight: 500;
  display: block;
}

.sf-author-role {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
}

.sf-detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ---- Card variants ---- */
.sf-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sf-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ---- Empty ---- */
.sf-empty,
.sf-empty-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
