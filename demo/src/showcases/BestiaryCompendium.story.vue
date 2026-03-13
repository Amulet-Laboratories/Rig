<script setup lang="ts">
/**
 * Bestiary Compendium — Filterable creature catalog showcase
 * Theme: Obelisk | Exercises: core, lists, menus, layout, nav, extras
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Input from '@core/primitives/Input.vue'
import Select from '@core/primitives/Select.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Tabs from '@nav/Tabs.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import DropdownMenu from '@menus/DropdownMenu.vue'
import ContextMenu from '@menus/ContextMenu.vue'
import SplitView from '@layout/SplitView.vue'
import EmptyState from '@extras/EmptyState.vue'
import Toast from '@extras/Toast.vue'
import PropertyGrid from '@extras/PropertyGrid.vue'
import Skeleton from '@extras/Skeleton.vue'
import Popover from '@layout/Popover.vue'
import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  creatures,
  allClassifications,
  allHabitats,
  sortOptions,
  threatColors,
  type Creature,
  type Classification,
  type Habitat,
} from './fixtures/bestiary-data'

import type { Action } from '@core/types'

// ---------------------------------------------------------------------------
// View mode
// ---------------------------------------------------------------------------
const viewMode = ref<'grid' | 'list'>('grid')

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
const activeTab = ref('all')
const favorites = ref<Set<string>>(new Set())

// ---------------------------------------------------------------------------
// Search & Filters
// ---------------------------------------------------------------------------
const searchQuery = ref('')
const activeClassifications = ref<Set<Classification>>(new Set())
const activeHabitats = ref<Set<Habitat>>(new Set())
const activeTraits = ref<Set<string>>(new Set())
const sortBy = ref('name-asc')

function toggleFilter<T>(set: Set<T>, value: T) {
  if (set.has(value)) {
    set.delete(value)
  } else {
    set.add(value)
  }
}

function clearFilters() {
  searchQuery.value = ''
  activeClassifications.value.clear()
  activeHabitats.value.clear()
  activeTraits.value.clear()
}

const hasActiveFilters = computed(
  () =>
    searchQuery.value !== '' ||
    activeClassifications.value.size > 0 ||
    activeHabitats.value.size > 0 ||
    activeTraits.value.size > 0,
)

// ---------------------------------------------------------------------------
// Filtering & Sorting
// ---------------------------------------------------------------------------
const filteredCreatures = computed(() => {
  let result = [...creatures]

  // Tab filter
  if (activeTab.value === 'favorites') {
    result = result.filter((c) => favorites.value.has(c.id))
  }

  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.classification.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.traits.some((t) => t.toLowerCase().includes(q)),
    )
  }

  // Classification filter
  if (activeClassifications.value.size > 0) {
    result = result.filter((c) => activeClassifications.value.has(c.classification))
  }

  // Habitat filter
  if (activeHabitats.value.size > 0) {
    result = result.filter((c) => c.habitat.some((h) => activeHabitats.value.has(h)))
  }

  // Trait filter
  if (activeTraits.value.size > 0) {
    result = result.filter((c) => c.traits.some((t) => activeTraits.value.has(t)))
  }

  // Sort
  const [field, dir] = sortBy.value.split('-') as [string, string]
  const mult = dir === 'asc' ? 1 : -1
  result.sort((a, b) => {
    if (field === 'name') return a.name.localeCompare(b.name) * mult
    if (field === 'threat') return (a.threatLevel - b.threatLevel) * mult
    if (field === 'encounters') return (a.encounters - b.encounters) * mult
    return 0
  })

  return result
})

// ---------------------------------------------------------------------------
// Detail panel
// ---------------------------------------------------------------------------
const selectedCreature = ref<Creature | null>(null)
const detailOpen = computed(() => selectedCreature.value !== null)
const splitSizes = ref([70, 30])
const detailLoading = ref(false)

const creatureProperties = computed(() => {
  if (!selectedCreature.value) return []
  const c = selectedCreature.value
  return [
    { key: 'Classification', value: c.classification },
    { key: 'Threat Level', value: `${c.threatLevel}/5` },
    { key: 'Encounters', value: `${c.encounters} reported` },
    { key: 'Habitats', value: c.habitat.join(', ') },
    { key: 'Traits', value: c.traits.join(', ') },
  ]
})

function selectCreature(c: Creature) {
  detailLoading.value = true
  selectedCreature.value = c
  // Simulate async load
  setTimeout(() => {
    detailLoading.value = false
  }, 600)
}

function closeDetail() {
  selectedCreature.value = null
}

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------
const ctxOpen = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const ctxCreature = ref<Creature | null>(null)

const cardActions: Action[] = [
  { id: 'favorite', label: 'Toggle Favorite', icon: 'codicon:heart' },
  { id: 'copy-link', label: 'Copy Link', icon: 'codicon:link' },
  { id: 'report', label: 'Report Error', icon: 'codicon:report' },
]

function onCardContext(creature: Creature, event: MouseEvent) {
  event.preventDefault()
  ctxCreature.value = creature
  ctxX.value = event.clientX
  ctxY.value = event.clientY
  ctxOpen.value = true
}

function onCtxSelect(action: Action) {
  ctxOpen.value = false
  if (!ctxCreature.value) return

  if (action.id === 'favorite') {
    if (favorites.value.has(ctxCreature.value.id)) {
      favorites.value.delete(ctxCreature.value.id)
      toast.add({ message: `${ctxCreature.value.name} removed from favorites`, variant: 'info' })
    } else {
      favorites.value.add(ctxCreature.value.id)
      toast.add({ message: `${ctxCreature.value.name} added to favorites`, variant: 'success' })
    }
  } else if (action.id === 'copy-link') {
    toast.add({ message: `Link copied for ${ctxCreature.value.name}`, variant: 'info' })
  } else if (action.id === 'report') {
    toast.add({ message: `Error reported for ${ctxCreature.value.name}`, variant: 'warning' })
  }
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
const breadcrumbs = computed(() => {
  const items = [{ id: 'home', label: 'Bestiary' }]
  if (selectedCreature.value) {
    items.push({ id: 'creature', label: selectedCreature.value.name })
  }
  return items
})

// ---------------------------------------------------------------------------
// Threat pips
// ---------------------------------------------------------------------------
function threatPips(level: number): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < level)
}

// ---------------------------------------------------------------------------
// Filter dropdown items (for classification)
// ---------------------------------------------------------------------------
const classificationDropdownItems = computed<Action[]>(() =>
  allClassifications.map((c) => ({
    id: c,
    label: c,
    icon: activeClassifications.value.has(c) ? 'codicon:check' : '',
  })),
)

const habitatDropdownItems = computed<Action[]>(() =>
  allHabitats.map((h) => ({
    id: h,
    label: h,
    icon: activeHabitats.value.has(h as Habitat) ? 'codicon:check' : '',
  })),
)
</script>

<template>
  <Story title="Bestiary Compendium" icon="codicon:book" group="showcase">
    <Variant title="Default">
      <div class="bestiary-shell" data-theme="obelisk">
        <!-- Top bar -->
        <header class="bestiary-topbar">
          <div class="bestiary-topbar-left">
            <Icon icon="codicon:book" size="lg" label="Bestiary" />
            <span class="bestiary-brand">Bestiary Compendium</span>
            <Breadcrumbs :items="breadcrumbs" @select="closeDetail" />
          </div>
          <div class="bestiary-topbar-right">
            <Input
              v-model="searchQuery"
              placeholder="Search creatures..."
              clearable
              :debounce="200"
            >
              <template #leading>
                <Icon icon="codicon:search" size="sm" />
              </template>
            </Input>
          </div>
        </header>

        <!-- Toolbar: tabs + filters + sort + view toggle -->
        <div class="bestiary-toolbar">
          <Tabs v-model="activeTab">
            <template #tabs="{ isActive, activate }">
              <button
                role="tab"
                data-tab-id="all"
                :aria-selected="isActive('all')"
                :tabindex="isActive('all') ? 0 : -1"
                :data-active="isActive('all') || undefined"
                class="bestiary-tab"
                @click="activate('all')"
              >
                All ({{ creatures.length }})
              </button>
              <button
                role="tab"
                data-tab-id="favorites"
                :aria-selected="isActive('favorites')"
                :tabindex="isActive('favorites') ? 0 : -1"
                :data-active="isActive('favorites') || undefined"
                class="bestiary-tab"
                @click="activate('favorites')"
              >
                Favorites ({{ favorites.size }})
              </button>
            </template>
          </Tabs>

          <div class="toolbar-spacer" />

          <!-- Classification filter dropdown -->
          <DropdownMenu
            :items="classificationDropdownItems"
            @select="toggleFilter(activeClassifications, $event.id as Classification)"
          >
            <template #trigger="{ toggle, triggerProps }">
              <Button v-bind="triggerProps" variant="ghost" size="sm" @click="toggle">
                <Icon icon="codicon:filter" size="sm" />
                Type
                <Badge v-if="activeClassifications.size > 0" variant="info" size="xs">
                  {{ activeClassifications.size }}
                </Badge>
              </Button>
            </template>
          </DropdownMenu>

          <!-- Habitat filter dropdown -->
          <DropdownMenu
            :items="habitatDropdownItems"
            @select="toggleFilter(activeHabitats, $event.id as Habitat)"
          >
            <template #trigger="{ toggle, triggerProps }">
              <Button v-bind="triggerProps" variant="ghost" size="sm" @click="toggle">
                <Icon icon="codicon:globe" size="sm" />
                Habitat
                <Badge v-if="activeHabitats.size > 0" variant="info" size="xs">
                  {{ activeHabitats.size }}
                </Badge>
              </Button>
            </template>
          </DropdownMenu>

          <!-- Sort dropdown -->
          <Select
            v-model="sortBy"
            :options="sortOptions"
            aria-label="Sort by"
          />

          <!-- View toggle -->
          <div class="view-toggle">
            <IconButton
              :icon="'codicon:list-flat'"
              :ariaLabel="'List view'"
              :data-active="viewMode === 'list' || undefined"
              @click="viewMode = 'list'"
            />
            <IconButton
              :icon="'codicon:symbol-misc'"
              :ariaLabel="'Grid view'"
              :data-active="viewMode === 'grid' || undefined"
              @click="viewMode = 'grid'"
            />
          </div>

          <Button v-if="hasActiveFilters" variant="ghost" size="sm" @click="clearFilters">
            Clear Filters
          </Button>
        </div>

        <!-- Active filter chips -->
        <div v-if="hasActiveFilters" class="filter-chips">
          <Badge
            v-for="c in activeClassifications"
            :key="c"
            variant="info"
          >
            {{ c }}
            <button class="chip-remove" @click="activeClassifications.delete(c)">&times;</button>
          </Badge>
          <Badge
            v-for="h in activeHabitats"
            :key="h"
            variant="info"
          >
            {{ h }}
            <button class="chip-remove" @click="activeHabitats.delete(h)">&times;</button>
          </Badge>
          <Badge
            v-for="t in activeTraits"
            :key="t"
            variant="info"
          >
            {{ t }}
            <button class="chip-remove" @click="activeTraits.delete(t)">&times;</button>
          </Badge>
        </div>

        <!-- Main content: grid/list + detail panel -->
        <div class="bestiary-main">
          <SplitView
            v-if="detailOpen"
            orientation="horizontal"
            :sizes="splitSizes"
            :min-sizes="[40, 25]"
            @update:sizes="splitSizes = $event"
          >
            <template #pane-0>
              <div class="bestiary-catalog" :class="{ 'list-mode': viewMode === 'list' }">
                <template v-if="filteredCreatures.length > 0">
                  <!-- Grid view -->
                  <template v-if="viewMode === 'grid'">
                    <Card
                      v-for="creature in filteredCreatures"
                      :key="creature.id"
                      interactive
                      :class="{ 'creature-selected': selectedCreature?.id === creature.id }"
                      @click="selectCreature(creature)"
                      @contextmenu="onCardContext(creature, $event)"
                    >
                      <div class="creature-card">
                        <div
                          class="creature-image"
                          :style="{ backgroundColor: creature.imageColor }"
                        >
                          <Icon icon="codicon:symbol-misc" size="xl" />
                        </div>
                        <div class="creature-info">
                          <span class="creature-name">{{ creature.name }}</span>
                          <span class="creature-class">{{ creature.classification }}</span>
                          <div class="threat-pips">
                            <span
                              v-for="(filled, i) in threatPips(creature.threatLevel)"
                              :key="i"
                              class="pip"
                              :data-filled="filled || undefined"
                              :style="filled ? { backgroundColor: threatColors[creature.threatLevel] } : {}"
                            />
                          </div>
                        </div>
                        <div class="creature-tags">
                          <Badge
                            v-for="trait in creature.traits.slice(0, 2)"
                            :key="trait"
                            size="xs"
                            variant="muted"
                          >
                            {{ trait }}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </template>

                  <!-- List view -->
                  <template v-else>
                    <div
                      v-for="creature in filteredCreatures"
                      :key="creature.id"
                      class="creature-list-row"
                      :class="{ 'creature-selected': selectedCreature?.id === creature.id }"
                      @click="selectCreature(creature)"
                      @contextmenu="onCardContext(creature, $event)"
                    >
                      <div
                        class="creature-list-swatch"
                        :style="{ backgroundColor: creature.imageColor }"
                      />
                      <span class="creature-list-name">{{ creature.name }}</span>
                      <Badge size="xs" variant="muted">{{ creature.classification }}</Badge>
                      <div class="threat-pips">
                        <span
                          v-for="(filled, i) in threatPips(creature.threatLevel)"
                          :key="i"
                          class="pip pip-sm"
                          :data-filled="filled || undefined"
                          :style="filled ? { backgroundColor: threatColors[creature.threatLevel] } : {}"
                        />
                      </div>
                      <span class="creature-list-encounters">{{ creature.encounters }} sightings</span>
                    </div>
                  </template>
                </template>

                <EmptyState
                  v-else
                  title="No creatures found"
                  description="Try adjusting your search or filters."
                  icon="codicon:search"
                >
                  <template #action>
                    <Button variant="ghost" @click="clearFilters">Clear Filters</Button>
                  </template>
                </EmptyState>
              </div>
            </template>

            <template #pane-1>
              <div v-if="selectedCreature" class="detail-panel">
                <div class="detail-panel-header">
                  <h2 class="detail-name">{{ selectedCreature.name }}</h2>
                  <IconButton icon="codicon:close" ariaLabel="Close detail" @click="closeDetail" />
                </div>

                <!-- Loading skeleton -->
                <template v-if="detailLoading">
                  <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                    <Skeleton :lines="1" width="60%" />
                    <Skeleton :lines="4" :width="['100%', '90%', '80%', '70%']" />
                    <Skeleton :lines="2" :width="['100%', '50%']" />
                  </div>
                </template>

                <template v-else>
                  <div
                    class="detail-image"
                    :style="{ backgroundColor: selectedCreature.imageColor }"
                  >
                    <Icon icon="codicon:symbol-misc" size="xl" />
                  </div>

                  <!-- PropertyGrid replaces manual meta layout -->
                  <div style="padding: 0 16px;">
                    <PropertyGrid :items="creatureProperties" key-width="120px" />
                  </div>

                  <div class="detail-section">
                    <h3 class="detail-section-title">Description</h3>
                    <p class="detail-text">{{ selectedCreature.description }}</p>
                  </div>

                  <div class="detail-section">
                    <h3 class="detail-section-title">Traits</h3>
                    <div class="detail-tags">
                      <Badge v-for="t in selectedCreature.traits" :key="t" size="sm">{{ t }}</Badge>
                    </div>
                  </div>

                  <div class="detail-section">
                    <h3 class="detail-section-title">
                      Lore
                      <Popover placement="top">
                        <template #trigger="{ toggle, triggerProps }">
                          <IconButton v-bind="triggerProps" ariaLabel="Lore info" @click="toggle">
                            <Icon icon="codicon:info" size="sm" />
                          </IconButton>
                        </template>
                        <div style="padding: 12px; max-width: 240px; font-size: 12px;">
                          Lore entries are gathered from field researchers and
                          historical archives. Accuracy may vary.
                        </div>
                      </Popover>
                    </h3>
                    <p class="detail-text">{{ selectedCreature.lore }}</p>
                  </div>
                </template>

                <div class="detail-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="
                      favorites.has(selectedCreature!.id)
                        ? favorites.delete(selectedCreature!.id)
                        : favorites.add(selectedCreature!.id);
                      toast.add({
                        message: favorites.has(selectedCreature!.id)
                          ? `${selectedCreature!.name} added to favorites`
                          : `${selectedCreature!.name} removed from favorites`,
                        variant: 'success',
                      })
                    "
                  >
                    <Icon :icon="favorites.has(selectedCreature.id) ? 'codicon:heart-filled' : 'codicon:heart'" size="sm" />
                    {{ favorites.has(selectedCreature.id) ? 'Unfavorite' : 'Favorite' }}
                  </Button>
                </div>
              </div>
            </template>
          </SplitView>

          <!-- No detail selected — full catalog -->
          <div v-else class="bestiary-catalog" :class="{ 'list-mode': viewMode === 'list' }">
            <template v-if="filteredCreatures.length > 0">
              <template v-if="viewMode === 'grid'">
                <Card
                  v-for="creature in filteredCreatures"
                  :key="creature.id"
                  interactive
                  @click="selectCreature(creature)"
                  @contextmenu="onCardContext(creature, $event)"
                >
                  <div class="creature-card">
                    <div
                      class="creature-image"
                      :style="{ backgroundColor: creature.imageColor }"
                    >
                      <Icon icon="codicon:symbol-misc" size="xl" />
                    </div>
                    <div class="creature-info">
                      <span class="creature-name">{{ creature.name }}</span>
                      <span class="creature-class">{{ creature.classification }}</span>
                      <div class="threat-pips">
                        <span
                          v-for="(filled, i) in threatPips(creature.threatLevel)"
                          :key="i"
                          class="pip"
                          :data-filled="filled || undefined"
                          :style="filled ? { backgroundColor: threatColors[creature.threatLevel] } : {}"
                        />
                      </div>
                    </div>
                    <div class="creature-tags">
                      <Badge
                        v-for="trait in creature.traits.slice(0, 2)"
                        :key="trait"
                        size="xs"
                        variant="muted"
                      >
                        {{ trait }}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </template>

              <template v-else>
                <div
                  v-for="creature in filteredCreatures"
                  :key="creature.id"
                  class="creature-list-row"
                  @click="selectCreature(creature)"
                  @contextmenu="onCardContext(creature, $event)"
                >
                  <div
                    class="creature-list-swatch"
                    :style="{ backgroundColor: creature.imageColor }"
                  />
                  <span class="creature-list-name">{{ creature.name }}</span>
                  <Badge size="xs" variant="muted">{{ creature.classification }}</Badge>
                  <div class="threat-pips">
                    <span
                      v-for="(filled, i) in threatPips(creature.threatLevel)"
                      :key="i"
                      class="pip pip-sm"
                      :data-filled="filled || undefined"
                      :style="filled ? { backgroundColor: threatColors[creature.threatLevel] } : {}"
                    />
                  </div>
                  <span class="creature-list-encounters">{{ creature.encounters }} sightings</span>
                </div>
              </template>
            </template>

            <EmptyState
              v-else
              title="No creatures found"
              description="Try adjusting your search or filters."
              icon="codicon:search"
            >
              <template #action>
                <Button variant="ghost" @click="clearFilters">Clear Filters</Button>
              </template>
            </EmptyState>
          </div>
        </div>

        <!-- Context Menu -->
        <ContextMenu
          :open="ctxOpen"
          :x="ctxX"
          :y="ctxY"
          :items="cardActions"
          @update:open="ctxOpen = $event"
          @select="onCtxSelect"
        />

        <!-- Toast -->
        <Toast />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.bestiary-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #0f0d0a);
  color: var(--color-foreground, #f5f1ed);
  font-family: var(--font-sans, Inter, sans-serif);
}

/* ---- Topbar ---- */
.bestiary-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border, #333);
  background: var(--color-card, #1a1714);
  gap: 16px;
}

.bestiary-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bestiary-topbar-right {
  min-width: 240px;
}

.bestiary-brand {
  font-family: var(--font-mono, monospace);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.02em;
}

/* ---- Toolbar ---- */
.bestiary-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-bottom: 1px solid var(--color-border, #333);
  flex-wrap: wrap;
}

.bestiary-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  background: none;
  color: var(--color-muted-foreground, #8a8078);
  font-family: var(--font-sans, sans-serif);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.bestiary-tab[data-active] {
  color: var(--color-foreground, #f5f1ed);
  border-bottom-color: var(--color-primary, #c9956d);
}

.toolbar-spacer {
  flex: 1;
}

.view-toggle {
  display: flex;
  gap: 2px;
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
  padding: 2px;
}

.view-toggle [data-active] {
  background: var(--color-accent, #1a1714);
}

/* ---- Filter chips ---- */
.filter-chips {
  display: flex;
  gap: 6px;
  padding: 6px 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--color-border, #333);
}

.chip-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0 2px;
  font-size: 14px;
  line-height: 1;
  margin-left: 4px;
  opacity: 0.7;
}

.chip-remove:hover {
  opacity: 1;
}

/* ---- Main content ---- */
.bestiary-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.bestiary-catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
  align-content: start;
}

.bestiary-catalog.list-mode {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ---- Creature card (grid) ---- */
.creature-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.creature-image {
  height: 80px;
  border-radius: var(--radius, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--color-foreground, #fff) 30%, transparent);
}

.creature-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.creature-name {
  font-weight: 600;
  font-size: 14px;
}

.creature-class {
  font-size: 12px;
  color: var(--color-muted-foreground, #8a8078);
}

.creature-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.creature-selected {
  outline: 2px solid var(--color-primary, #c9956d);
  outline-offset: -2px;
}

/* ---- Creature list row ---- */
.creature-list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border, #333);
  transition: background 0.1s;
}

.creature-list-row:hover {
  background: var(--color-accent, #1a1714);
}

.creature-list-swatch {
  width: 24px;
  height: 24px;
  border-radius: var(--radius, 4px);
  flex-shrink: 0;
}

.creature-list-name {
  font-weight: 500;
  font-size: 13px;
  flex: 1;
}

.creature-list-encounters {
  font-size: 12px;
  color: var(--color-muted-foreground, #8a8078);
  min-width: 90px;
  text-align: right;
}

/* ---- Threat pips ---- */
.threat-pips {
  display: flex;
  gap: 3px;
  align-items: center;
}

.pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border, #333);
}

.pip-sm {
  width: 6px;
  height: 6px;
}

.pip[data-filled] {
  /* color set via inline style */
}

/* ---- Detail panel ---- */
.detail-panel {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 1px solid var(--color-border, #333);
}

.detail-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.detail-image {
  height: 120px;
  border-radius: var(--radius, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: color-mix(in srgb, var(--color-foreground, #fff) 30%, transparent);
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: var(--color-muted-foreground, #8a8078);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 14px;
}

.detail-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #8a8078);
  margin: 0;
}

.detail-text {
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  color: var(--color-foreground, #f5f1ed);
}

.detail-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border, #333);
}
</style>
