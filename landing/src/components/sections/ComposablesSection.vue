<script setup lang="ts">
const composables = [
  { name: 'useKeyboard', desc: 'Declarative keybindings' },
  { name: 'useVirtualList', desc: 'Windowed rendering' },
  { name: 'useFocusTrap', desc: 'Modal focus management' },
  { name: 'useDragDrop', desc: 'Drag-and-drop reorder' },
  { name: 'useCommandRegistry', desc: 'Command palette integration' },
  { name: 'usePersistedState', desc: 'localStorage persistence' },
  { name: 'useGlobalState', desc: 'Provided/injected state' },
  { name: 'useTooltip', desc: 'Tooltip state management' },
  { name: 'useScrollVisibility', desc: 'Scroll-based detection' },
  { name: 'useParallax', desc: 'Pointer/scroll transforms' },
  { name: 'useMediaPlayback', desc: 'Reactive media controls' },
  { name: 'useReducedMotion', desc: 'Motion preference detection' },
  { name: 'usePlatform', desc: 'Platform detection' },
  { name: 'useFormValidation', desc: 'Field-level validation + schema support' },
  { name: 'useConfig', desc: 'Global config + RTL + defaults' },
  { name: 'useShellState', desc: 'IDE shell state management' },
  { name: 'useToast', desc: 'Toast queue management' },
  { name: 'useNotifications', desc: 'Notification center state' },
  { name: 'useConfirm', desc: 'Imperative confirm dialogs' },
  { name: 'useAnnounce', desc: 'Live region announcements' },
  { name: 'useComponentDefaults', desc: 'Per-component prop defaults' },
  { name: 'useHashRouter', desc: 'Hash-based SPA routing' },
]
</script>

<template>
  <div class="mx-auto my-0 h-px max-w-[1200px] bg-border-subtle" />

  <section class="reveal px-6 py-24" aria-labelledby="comp-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Composables
        </div>
        <h2
          id="comp-title"
          class="mb-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          Batteries included.
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          22 composables for the patterns you build again and again. Keyboard shortcuts, focus
          traps, virtual lists, form validation -- handled.
        </p>
      </div>

      <div class="stagger-children grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="comp in composables"
          :key="comp.name"
          class="flex items-center gap-3 rounded-lg border border-transparent bg-bg-elevated px-4 py-3.5 transition hover:border-border hover:bg-bg-surface"
        >
          <span class="font-mono text-[13px] font-medium text-primary">{{ comp.name }}</span>
          <span class="text-xs text-text-dim">{{ comp.desc }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
