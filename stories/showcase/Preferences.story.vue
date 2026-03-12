<script setup lang="ts">
/**
 * Preferences — Settings page
 * Theme: VS Code | Exercises: core, layout, nav, lists, extras
 *
 * Showcase #13 — Settings sections/groups, toggles, selects,
 * number inputs, search, modified indicator.
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Input from '@core/primitives/Input.vue'
import Select from '@core/primitives/Select.vue'
import StatusBar from '@nav/StatusBar.vue'
import Tabs from '@nav/Tabs.vue'
import Collapsible from '@layout/Collapsible.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  sections,
  searchSettings,
  getModifiedSettings,
  getTotalCount,
  getModifiedCount,
  type Setting,
} from './fixtures/preferences-data'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const activeSection = ref(sections[0]!.id)
const searchQuery = ref('')
const showModifiedOnly = ref(false)

// Reactive settings values (clone for interactivity)
const settingsValues = ref<Record<string, unknown>>(
  Object.fromEntries(
    sections.flatMap((s) =>
      s.groups.flatMap((g) => g.settings.map((st) => [st.id, st.value])),
    ),
  ),
)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const currentSection = computed(
  () => sections.find((s) => s.id === activeSection.value) ?? sections[0]!,
)

const sectionTabs = computed(() =>
  sections.map((s) => ({
    id: s.id,
    label: s.label,
    icon: s.icon,
  })),
)

const filteredSettings = computed(() => {
  if (searchQuery.value) {
    return searchSettings(searchQuery.value)
  }
  if (showModifiedOnly.value) {
    return getModifiedSettings()
  }
  return null // show normal section view
})

const statusBarItems = computed(() => [
  { id: 'total', content: `${getTotalCount()} settings`, priority: 1, align: 'left' as const },
  { id: 'modified', content: `${getModifiedCount()} modified`, priority: 2, align: 'left' as const },
  { id: 'section', content: currentSection.value.label, priority: 3, align: 'right' as const },
])

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function updateSetting(setting: Setting, newValue: unknown) {
  settingsValues.value[setting.id] = newValue
  toast.add({ message: `${setting.label} updated`, variant: 'success' })
}

function resetSetting(setting: Setting) {
  settingsValues.value[setting.id] = setting.value
  toast.add({ message: `${setting.label} reset to default`, variant: 'info' })
}
</script>

<template>
  <Story title="Preferences" icon="codicon:settings-gear" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="pref-shell" data-theme="vscode">
        <!-- Header -->
        <header class="pref-header">
          <div class="pref-header-left">
            <Icon icon="codicon:settings-gear" size="lg" />
            <h1 class="pref-title">Settings</h1>
          </div>
          <div class="pref-header-right">
            <div class="pref-search">
              <Input
                v-model="searchQuery"
                placeholder="Search settings..."
                clearable
                :debounce="200"
              >
                <template #leading>
                  <Icon icon="codicon:search" size="sm" />
                </template>
              </Input>
            </div>
            <Button
              :variant="showModifiedOnly ? 'primary' : 'ghost'"
              size="sm"
              @click="showModifiedOnly = !showModifiedOnly; searchQuery = ''"
            >
              <Icon icon="codicon:filter" size="sm" />
              Modified
              <Badge v-if="getModifiedCount() > 0" variant="primary" size="xs">
                {{ getModifiedCount() }}
              </Badge>
            </Button>
          </div>
        </header>

        <!-- Section tabs -->
        <Tabs v-model="activeSection" :tabs="sectionTabs" />

        <!-- Content -->
        <main class="pref-main">
          <!-- Search results -->
          <template v-if="filteredSettings">
            <div v-if="filteredSettings.length === 0" class="pref-empty">
              <EmptyState
                title="No settings found"
                description="Try a different search term or clear the filter."
                icon="codicon:search"
              />
            </div>
            <div v-else class="pref-flat-list">
              <div
                v-for="setting in filteredSettings"
                :key="setting.id"
                class="pref-setting"
              >
                <div class="pref-setting-header">
                  <span class="pref-setting-label">
                    {{ setting.label }}
                    <Badge v-if="setting.modified" variant="primary" size="xs">modified</Badge>
                  </span>
                  <IconButton ariaLabel="Reset to default" @click="resetSetting(setting)">
                    <Icon icon="codicon:discard" size="sm" />
                  </IconButton>
                </div>
                <p class="pref-setting-desc">{{ setting.description }}</p>

                <!-- Toggle -->
                <label v-if="setting.type === 'toggle'" class="pref-toggle">
                  <input
                    type="checkbox"
                    :checked="(settingsValues[setting.id] as boolean)"
                    @change="updateSetting(setting, ($event.target as HTMLInputElement).checked)"
                  />
                  <span class="pref-toggle-track">
                    <span class="pref-toggle-thumb" />
                  </span>
                </label>

                <!-- Select -->
                <Select
                  v-else-if="setting.type === 'select' && setting.options"
                  :modelValue="(settingsValues[setting.id] as string)"
                  :options="setting.options"
                  :ariaLabel="setting.label"
                  @update:modelValue="updateSetting(setting, $event)"
                />

                <!-- Text -->
                <Input
                  v-else-if="setting.type === 'text'"
                  :modelValue="(settingsValues[setting.id] as string)"
                  @update:modelValue="updateSetting(setting, $event)"
                />

                <!-- Number -->
                <input
                  v-else-if="setting.type === 'number'"
                  type="number"
                  class="pref-number-input"
                  :value="(settingsValues[setting.id] as number)"
                  :min="setting.min"
                  :max="setting.max"
                  @change="updateSetting(setting, Number(($event.target as HTMLInputElement).value))"
                />

                <!-- Radio -->
                <div v-else-if="setting.type === 'radio' && setting.options" class="pref-radio-group">
                  <label
                    v-for="opt in setting.options"
                    :key="opt.id"
                    class="pref-radio"
                  >
                    <input
                      type="radio"
                      :name="setting.id"
                      :value="opt.id"
                      :checked="(settingsValues[setting.id] as string) === opt.id"
                      @change="updateSetting(setting, opt.id)"
                    />
                    <span>{{ opt.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </template>

          <!-- Normal section view -->
          <template v-else>
            <div class="pref-section">
              <Collapsible
                v-for="group in currentSection.groups"
                :key="group.id"
                defaultOpen
              >
                <template #trigger>
                  <div class="pref-group-trigger">
                    <Icon :icon="group.icon" size="sm" />
                    <span class="pref-group-label">{{ group.label }}</span>
                    <span class="pref-group-desc">{{ group.description }}</span>
                    <Badge variant="muted" size="xs">{{ group.settings.length }}</Badge>
                  </div>
                </template>
                <div class="pref-group-content">
                  <div
                    v-for="setting in group.settings"
                    :key="setting.id"
                    class="pref-setting"
                  >
                    <div class="pref-setting-header">
                      <span class="pref-setting-label">
                        {{ setting.label }}
                        <Badge v-if="setting.modified" variant="primary" size="xs">modified</Badge>
                      </span>
                      <IconButton ariaLabel="Reset to default" @click="resetSetting(setting)">
                        <Icon icon="codicon:discard" size="sm" />
                      </IconButton>
                    </div>
                    <p class="pref-setting-desc">{{ setting.description }}</p>

                    <!-- Toggle -->
                    <label v-if="setting.type === 'toggle'" class="pref-toggle">
                      <input
                        type="checkbox"
                        :checked="(settingsValues[setting.id] as boolean)"
                        @change="updateSetting(setting, ($event.target as HTMLInputElement).checked)"
                      />
                      <span class="pref-toggle-track">
                        <span class="pref-toggle-thumb" />
                      </span>
                    </label>

                    <!-- Select -->
                    <Select
                      v-else-if="setting.type === 'select' && setting.options"
                      :modelValue="(settingsValues[setting.id] as string)"
                      :options="setting.options"
                      :ariaLabel="setting.label"
                      @update:modelValue="updateSetting(setting, $event)"
                    />

                    <!-- Text -->
                    <Input
                      v-else-if="setting.type === 'text'"
                      :modelValue="(settingsValues[setting.id] as string)"
                      @update:modelValue="updateSetting(setting, $event)"
                    />

                    <!-- Number -->
                    <input
                      v-else-if="setting.type === 'number'"
                      type="number"
                      class="pref-number-input"
                      :value="(settingsValues[setting.id] as number)"
                      :min="setting.min"
                      :max="setting.max"
                      @change="updateSetting(setting, Number(($event.target as HTMLInputElement).value))"
                    />

                    <!-- Radio -->
                    <div v-else-if="setting.type === 'radio' && setting.options" class="pref-radio-group">
                      <label
                        v-for="opt in setting.options"
                        :key="opt.id"
                        class="pref-radio"
                      >
                        <input
                          type="radio"
                          :name="setting.id"
                          :value="opt.id"
                          :checked="(settingsValues[setting.id] as string) === opt.id"
                          @change="updateSetting(setting, opt.id)"
                        />
                        <span>{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Collapsible>
            </div>
          </template>
        </main>

        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: SEARCH RESULTS ================== -->
    <Variant title="Search Results">
      <div class="pref-shell" data-theme="vscode">
        <header class="pref-header">
          <div class="pref-header-left">
            <Icon icon="codicon:settings-gear" size="lg" />
            <h1 class="pref-title">Settings</h1>
          </div>
          <div class="pref-header-right">
            <div class="pref-search">
              <Input modelValue="font" placeholder="Search settings..." clearable>
                <template #leading>
                  <Icon icon="codicon:search" size="sm" />
                </template>
              </Input>
            </div>
          </div>
        </header>
        <main class="pref-main">
          <div class="pref-search-header">
            <Icon icon="codicon:search" size="sm" />
            <span>{{ searchSettings('font').length }} settings matching "font"</span>
          </div>
          <div class="pref-flat-list">
            <div
              v-for="setting in searchSettings('font')"
              :key="setting.id"
              class="pref-setting"
            >
              <div class="pref-setting-header">
                <span class="pref-setting-label">
                  {{ setting.label }}
                  <Badge v-if="setting.modified" variant="primary" size="xs">modified</Badge>
                </span>
              </div>
              <p class="pref-setting-desc">{{ setting.description }}</p>
              <span class="pref-setting-id">{{ setting.id }}</span>
            </div>
          </div>
        </main>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: MODIFIED FILTER ================== -->
    <Variant title="Modified Settings">
      <div class="pref-shell" data-theme="vscode">
        <header class="pref-header">
          <div class="pref-header-left">
            <Icon icon="codicon:settings-gear" size="lg" />
            <h1 class="pref-title">Settings</h1>
          </div>
          <div class="pref-header-right">
            <Button variant="primary" size="sm">
              <Icon icon="codicon:filter" size="sm" />
              Modified
              <Badge variant="primary" size="xs">{{ getModifiedCount() }}</Badge>
            </Button>
          </div>
        </header>
        <main class="pref-main">
          <div class="pref-search-header">
            <Icon icon="codicon:edit" size="sm" />
            <span>{{ getModifiedCount() }} modified settings</span>
          </div>
          <div class="pref-flat-list">
            <div
              v-for="setting in getModifiedSettings()"
              :key="setting.id"
              class="pref-setting"
            >
              <div class="pref-setting-header">
                <span class="pref-setting-label">
                  {{ setting.label }}
                  <Badge variant="primary" size="xs">modified</Badge>
                </span>
                <IconButton ariaLabel="Reset to default">
                  <Icon icon="codicon:discard" size="sm" />
                </IconButton>
              </div>
              <p class="pref-setting-desc">{{ setting.description }}</p>
              <span class="pref-setting-value">Current: <strong>{{ setting.value }}</strong></span>
            </div>
          </div>
        </main>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY SEARCH ================== -->
    <Variant title="Empty Search">
      <div class="pref-shell" data-theme="vscode">
        <header class="pref-header">
          <div class="pref-header-left">
            <Icon icon="codicon:settings-gear" size="lg" />
            <h1 class="pref-title">Settings</h1>
          </div>
          <div class="pref-header-right">
            <div class="pref-search">
              <Input modelValue="xyznonexistent" placeholder="Search settings..." clearable>
                <template #leading>
                  <Icon icon="codicon:search" size="sm" />
                </template>
              </Input>
            </div>
          </div>
        </header>
        <main class="pref-main">
          <div class="pref-empty">
            <EmptyState
              title="No settings found"
              description="No settings match your search query. Try a different term."
              icon="codicon:search"
            />
          </div>
        </main>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.pref-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #1e1e1e);
  color: var(--color-foreground, #d4d4d4);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

/* ---- Header ---- */
.pref-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-border, #333);
  gap: 16px;
  flex-wrap: wrap;
}

.pref-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pref-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pref-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.pref-search {
  width: 280px;
}

/* ---- Main ---- */
.pref-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px 32px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* ---- Section ---- */
.pref-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ---- Group ---- */
.pref-group-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.pref-group-label {
  font-weight: 600;
  font-size: 14px;
}

.pref-group-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  flex: 1;
  text-align: left;
}

.pref-group-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0 12px 28px;
}

/* ---- Setting ---- */
.pref-setting {
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 3px solid transparent;
  transition: background 0.1s;
}

.pref-setting:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 4%, transparent);
}

.pref-setting-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pref-setting-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.pref-setting-desc {
  margin: 4px 0 8px;
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  line-height: 1.4;
}

.pref-setting-id {
  font-size: 11px;
  font-family: monospace;
  color: var(--color-muted-foreground, #666);
}

.pref-setting-value {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Toggle ---- */
.pref-toggle {
  display: inline-flex;
  cursor: pointer;
}

.pref-toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.pref-toggle-track {
  display: flex;
  align-items: center;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 15%, transparent);
  padding: 2px;
  transition: background 0.15s;
}

.pref-toggle input:checked + .pref-toggle-track {
  background: var(--color-primary, #0078d4);
}

.pref-toggle-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-foreground, #fff);
  transition: transform 0.15s;
}

.pref-toggle input:checked + .pref-toggle-track .pref-toggle-thumb {
  transform: translateX(16px);
}

/* ---- Number input ---- */
.pref-number-input {
  width: 100px;
  padding: 4px 8px;
  border: 1px solid var(--color-border, #444);
  border-radius: 4px;
  background: color-mix(in srgb, var(--color-background, #1e1e1e) 90%, var(--color-foreground, #fff));
  color: var(--color-foreground, #d4d4d4);
  font-family: inherit;
  font-size: 13px;
}

.pref-number-input:focus {
  outline: none;
  border-color: var(--color-primary, #0078d4);
}

/* ---- Radio ---- */
.pref-radio-group {
  display: flex;
  gap: 16px;
}

.pref-radio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
}

.pref-radio input {
  accent-color: var(--color-primary, #0078d4);
}

/* ---- Search header ---- */
.pref-search-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-muted-foreground, #888);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border, #333);
}

/* ---- Flat list ---- */
.pref-flat-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* ---- Empty ---- */
.pref-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
