<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { showcases } from './router'
import { useTheme } from './useTheme'

const route = useRoute()
const currentId = computed(() => route.path.slice(1) || showcases[0]?.id || '')

const { theme, mode, themes, setMode, setTheme } = useTheme()
</script>

<template>
  <div class="demo-shell">
    <nav class="demo-sidebar" role="navigation" aria-label="Showcase navigation">
      <div class="demo-sidebar-header">
        <span class="demo-logo">Rig</span>
        <span class="demo-subtitle">Showcase</span>
      </div>
      <ul class="demo-nav-list">
        <li v-for="item in showcases" :key="item.id">
          <router-link
            :to="`/${item.id}`"
            class="demo-nav-link"
            :class="{ 'demo-nav-active': currentId === item.id }"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
      <div class="demo-controls">
        <!-- Mode toggle -->
        <div class="demo-mode-switcher">
          <span class="demo-control-label">Mode</span>
          <div class="demo-mode-options">
            <button
              class="demo-mode-btn"
              :class="{ 'demo-mode-btn-active': mode === 'light' }"
              :aria-pressed="mode === 'light'"
              @click="setMode('light')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light
            </button>
            <button
              class="demo-mode-btn"
              :class="{ 'demo-mode-btn-active': mode === 'dark' }"
              :aria-pressed="mode === 'dark'"
              @click="setMode('dark')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Dark
            </button>
          </div>
        </div>
        <!-- Theme picker -->
        <div class="demo-theme-switcher">
          <span class="demo-control-label">Theme</span>
          <div class="demo-theme-options">
            <button
              v-for="t in themes"
              :key="t.id"
              class="demo-theme-btn"
              :class="{ 'demo-theme-btn-active': theme === t.id }"
              :aria-pressed="theme === t.id"
              :title="t.description"
              @click="setTheme(t.id)"
            >
              {{ t.label }}
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="demo-main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<style>
/* ---- Demo Shell ---- */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--background, #0f0d0a);
  color: var(--foreground, #d4d4d4);
}

.demo-shell {
  display: flex;
  height: 100%;
}

/* ---- Sidebar ---- */

.demo-sidebar {
  display: flex;
  flex-direction: column;
  width: 240px;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--background, #0f0d0a) 92%, white);
  border-right: 1px solid color-mix(in srgb, var(--foreground, #d4d4d4) 12%, transparent);
  overflow-y: auto;
}

.demo-sidebar-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--foreground, #d4d4d4) 8%, transparent);
}

.demo-logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--primary, #c9956d);
}

.demo-subtitle {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--foreground, #d4d4d4) 50%, transparent);
}

.demo-nav-list {
  list-style: none;
  padding: 8px 0;
}

.demo-nav-link {
  display: block;
  padding: 6px 16px;
  font-size: 13px;
  line-height: 1.4;
  color: color-mix(in srgb, var(--foreground, #d4d4d4) 70%, transparent);
  text-decoration: none;
  transition: background 0.12s ease, color 0.12s ease;
}

.demo-nav-link:hover {
  background: color-mix(in srgb, var(--foreground, #d4d4d4) 6%, transparent);
  color: var(--foreground, #d4d4d4);
}

.demo-nav-active {
  background: color-mix(in srgb, var(--primary, #c9956d) 12%, transparent);
  color: var(--primary, #c9956d);
  font-weight: 500;
}

.demo-nav-active:hover {
  background: color-mix(in srgb, var(--primary, #c9956d) 18%, transparent);
}

/* ---- Main content ---- */

.demo-main {
  flex: 1;
  overflow: auto;
  min-width: 0;
}

/* Story/Variant shim layout */

[data-demo-story] {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

[data-demo-variant] {
  flex: 1;
  min-height: 0;
}

/* Only show the first variant by default (the "Default" demo) */
[data-demo-story] > [data-demo-variant] ~ [data-demo-variant] {
  display: none;
}

/* ---- Theme Switcher ---- */

.demo-controls {
  margin-top: auto;
  border-top: 1px solid color-mix(in srgb, var(--foreground, #d4d4d4) 8%, transparent);
}

.demo-mode-switcher {
  padding: 12px 16px 0;
}

.demo-control-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--foreground, #d4d4d4) 40%, transparent);
  margin-bottom: 6px;
}

.demo-mode-options {
  display: flex;
  gap: 2px;
  background: color-mix(in srgb, var(--foreground, #d4d4d4) 5%, transparent);
  border-radius: 6px;
  padding: 2px;
}

.demo-mode-btn {
  flex: 1;
  appearance: none;
  border: none;
  background: transparent;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: inherit;
  text-align: center;
  color: color-mix(in srgb, var(--foreground, #d4d4d4) 50%, transparent);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.demo-mode-btn:hover {
  color: var(--foreground, #d4d4d4);
}

.demo-mode-btn-active {
  background: color-mix(in srgb, var(--foreground, #d4d4d4) 12%, transparent);
  color: var(--foreground, #d4d4d4);
  font-weight: 500;
}

.demo-theme-switcher {
  padding: 10px 16px 16px;
}

.demo-theme-options {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.demo-theme-btn {
  appearance: none;
  border: none;
  background: transparent;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: inherit;
  text-align: left;
  color: color-mix(in srgb, var(--foreground, #d4d4d4) 60%, transparent);
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}

.demo-theme-btn:hover {
  background: color-mix(in srgb, var(--foreground, #d4d4d4) 8%, transparent);
  color: var(--foreground, #d4d4d4);
}

.demo-theme-btn-active {
  background: color-mix(in srgb, var(--primary, #c9956d) 14%, transparent);
  color: var(--primary, #c9956d);
  font-weight: 500;
}

.demo-theme-btn-active:hover {
  background: color-mix(in srgb, var(--primary, #c9956d) 20%, transparent);
}
</style>
