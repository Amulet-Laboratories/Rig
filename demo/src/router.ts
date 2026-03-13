import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export interface ShowcaseEntry {
  id: string
  label: string
  icon: string
}

export const showcases: ShowcaseEntry[] = [
  { id: 'anchor-dashboard', label: 'Anchor Dashboard', icon: 'codicon:dashboard' },
  { id: 'bestiary-compendium', label: 'Bestiary Compendium', icon: 'codicon:book' },
  { id: 'calendar', label: 'Calendar', icon: 'codicon:calendar' },
  { id: 'character-quiz', label: 'Character Quiz', icon: 'codicon:question' },
  { id: 'flight-tracker', label: 'Flight Tracker', icon: 'codicon:globe' },
  { id: 'kanban-board', label: 'Kanban Board', icon: 'codicon:project' },
  { id: 'lighthouse', label: 'Lighthouse', icon: 'codicon:light-bulb' },
  { id: 'messaging-app', label: 'Messaging App', icon: 'codicon:comment-discussion' },
  { id: 'mock-vscode', label: 'Mock VS Code', icon: 'codicon:code' },
  { id: 'preferences', label: 'Preferences', icon: 'codicon:settings-gear' },
  { id: 'recipe-builder', label: 'Recipe Builder', icon: 'codicon:beaker' },
  { id: 'rune-generator', label: 'Rune Generator', icon: 'codicon:symbol-misc' },
  { id: 'signal-feed', label: 'Signal Feed', icon: 'codicon:rss' },
  { id: 'theme-grid', label: 'Theme Grid', icon: 'codicon:symbol-color' },
  { id: 'tide-radio', label: 'Tide Radio', icon: 'codicon:unmute' },
  { id: 'token-reference', label: 'Token Reference', icon: 'codicon:symbol-key' },
  { id: 'waypoint', label: 'Waypoint', icon: 'codicon:map' },
  { id: 'accessibility', label: 'Accessibility', icon: 'codicon:accessibility' },
]

/** Diagnostic views -- measurement/health dashboards, not component showcases. */
export const diagnostics: ShowcaseEntry[] = [
  { id: 'ecosystem-health', label: 'Ecosystem Health', icon: 'codicon:pulse' },
  { id: 'performance', label: 'Performance', icon: 'codicon:dashboard' },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/anchor-dashboard',
  },
  {
    path: '/anchor-dashboard',
    component: () => import('@showcase/AnchorDashboard.story.vue'),
  },
  {
    path: '/bestiary-compendium',
    component: () => import('@showcase/BestiaryCompendium.story.vue'),
  },
  {
    path: '/calendar',
    component: () => import('@showcase/Calendar.story.vue'),
  },
  {
    path: '/character-quiz',
    component: () => import('@showcase/CharacterQuiz.story.vue'),
  },
  {
    path: '/flight-tracker',
    component: () => import('@showcase/FlightTracker.story.vue'),
  },
  {
    path: '/kanban-board',
    component: () => import('@showcase/KanbanBoard.story.vue'),
  },
  {
    path: '/lighthouse',
    component: () => import('@showcase/Lighthouse.story.vue'),
  },
  {
    path: '/messaging-app',
    component: () => import('@showcase/MessagingApp.story.vue'),
  },
  {
    path: '/mock-vscode',
    component: () => import('@showcase/MockVSCode.story.vue'),
  },
  {
    path: '/preferences',
    component: () => import('@showcase/Preferences.story.vue'),
  },
  {
    path: '/recipe-builder',
    component: () => import('@showcase/RecipeBuilder.story.vue'),
  },
  {
    path: '/rune-generator',
    component: () => import('@showcase/RuneGenerator.story.vue'),
  },
  {
    path: '/signal-feed',
    component: () => import('@showcase/SignalFeed.story.vue'),
  },
  {
    path: '/theme-grid',
    component: () => import('@showcase/ThemeGrid.story.vue'),
  },
  {
    path: '/tide-radio',
    component: () => import('@showcase/TideRadio.story.vue'),
  },
  {
    path: '/token-reference',
    component: () => import('@showcase/TokenReference.story.vue'),
  },
  {
    path: '/waypoint',
    component: () => import('@showcase/Waypoint.story.vue'),
  },
  {
    path: '/accessibility',
    component: () => import('@showcase/Accessibility.story.vue'),
  },
  {
    path: '/ecosystem-health',
    component: () => import('@showcase/EcosystemHealth.story.vue'),
  },
  {
    path: '/performance',
    component: () => import('@showcase/Performance.story.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
