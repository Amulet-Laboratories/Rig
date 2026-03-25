<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('component')

const features = [
  'Tree-shakeable imports from a single entry point',
  'Typed named slots with defineSlots',
  'v-model bindings on stateful components',
  'Style via data attributes or Hex themes',
  'Composables for keyboard, drag-drop, focus traps',
]
</script>

<template>
  <section
    class="reveal border-t border-b border-border-subtle bg-bg-elevated px-6 py-24"
    aria-labelledby="code-title"
  >
    <div class="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Usage</div>
        <h3 id="code-title" class="mb-3 text-2xl font-bold tracking-tight">
          Import. Compose. Ship.
        </h3>
        <p class="mb-6 text-[15px] leading-[1.7] text-text-muted">
          Every component is a building block. Named slots give you full control over what renders.
          Data attributes give you full control over how it looks.
        </p>
        <ul class="flex flex-col gap-2.5">
          <li
            v-for="feat in features"
            :key="feat"
            class="flex items-center gap-2.5 text-sm text-text-muted"
          >
            <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {{ feat }}
          </li>
        </ul>
      </div>

      <div class="overflow-hidden rounded-xl border border-border bg-bg">
        <div class="flex items-center gap-0 border-b border-border-subtle">
          <button
            v-for="tab in [
              { id: 'component', label: 'Component' },
              { id: 'theme', label: 'Theme' },
              { id: 'composable', label: 'Composable' },
            ]"
            :key="tab.id"
            class="px-4 py-3 font-mono text-xs transition"
            :class="
              activeTab === tab.id
                ? 'border-b-2 border-primary text-text'
                : 'text-text-dim hover:text-text-muted'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <pre
          v-show="activeTab === 'component'"
          class="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-text-muted"
        ><span class="code-cmt">&lt;!-- One import for the theme --&gt;</span>
<span class="code-tag">&lt;script</span> <span class="code-attr">setup</span> <span class="code-attr">lang</span>=<span class="code-str">"ts"</span><span class="code-tag">&gt;</span>
<span class="code-kw">import</span> <span class="code-str">'@amulet-laboratories/hex'</span>
<span class="code-kw">import</span> {
  <span class="code-comp">Button</span>,
  <span class="code-comp">Modal</span>,
  <span class="code-comp">CommandPalette</span>,
  <span class="code-comp">TreeView</span>,
} <span class="code-kw">from</span> <span class="code-str">'@amulet-laboratories/rig'</span>
<span class="code-kw">import</span> { <span class="code-fn">useKeyboard</span> } <span class="code-kw">from</span> <span class="code-str">'@amulet-laboratories/rig'</span>

<span class="code-kw">const</span> <span class="code-attr">open</span> = <span class="code-fn">ref</span>(<span class="code-str">false</span>)
<span class="code-fn">useKeyboard</span>({ <span class="code-str">'mod+k'</span>: () =&gt; (<span class="code-attr">open</span>.<span class="code-attr">value</span> = <span class="code-str">true</span>) })
<span class="code-tag">&lt;/script&gt;</span>

<span class="code-tag">&lt;template&gt;</span>
  <span class="code-punct">&lt;</span><span class="code-comp">Button</span> <span class="code-attr">variant</span>=<span class="code-str">"primary"</span><span class="code-punct">&gt;</span>Open<span class="code-punct">&lt;/</span><span class="code-comp">Button</span><span class="code-punct">&gt;</span>

  <span class="code-punct">&lt;</span><span class="code-comp">CommandPalette</span>
    <span class="code-attr">v-model:open</span>=<span class="code-str">"open"</span>
    <span class="code-attr">:items</span>=<span class="code-str">"commands"</span>
    <span class="code-attr">placeholder</span>=<span class="code-str">"Search commands..."</span>
  <span class="code-punct">/&gt;</span>
<span class="code-tag">&lt;/template&gt;</span></pre>
        <pre
          v-show="activeTab === 'theme'"
          class="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-text-muted"
        ><span class="code-kw">@import</span> <span class="code-str">'@amulet-laboratories/hex/vscode'</span>

<span class="code-cmt">/* or use source for Tailwind v4 */</span>
<span class="code-kw">@import</span> <span class="code-str">'@amulet-laboratories/hex/vscode/source'</span>

<span class="code-cmt">/* Every component re-skins instantly */</span>
<span class="code-cmt">/* Switch themes by changing one import */</span></pre>
        <pre
          v-show="activeTab === 'composable'"
          class="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-text-muted"
        ><span class="code-tag">&lt;script</span> <span class="code-attr">setup</span> <span class="code-attr">lang</span>=<span class="code-str">"ts"</span><span class="code-tag">&gt;</span>
<span class="code-kw">import</span> { <span class="code-fn">useKeyboard</span>, <span class="code-fn">useFocusTrap</span> } <span class="code-kw">from</span> <span class="code-str">'@amulet-laboratories/rig'</span>

<span class="code-kw">const</span> <span class="code-attr">containerRef</span> = <span class="code-fn">ref</span><span class="code-punct">&lt;</span><span class="code-comp">HTMLElement</span> | <span class="code-attr">null</span><span class="code-punct">&gt;</span>(<span class="code-attr">null</span>)

<span class="code-fn">useKeyboard</span>({
  <span class="code-str">'mod+k'</span>: () =&gt; (<span class="code-attr">paletteOpen</span>.<span class="code-attr">value</span> = <span class="code-str">true</span>),
  <span class="code-str">'mod+b'</span>: () =&gt; <span class="code-fn">toggleSidebar</span>(),
})

<span class="code-fn">useFocusTrap</span>({
  <span class="code-attr">containerRef</span>,
  <span class="code-attr">active</span>: <span class="code-attr">paletteOpen</span>,
  <span class="code-attr">onEscape</span>: () =&gt; (<span class="code-attr">paletteOpen</span>.<span class="code-attr">value</span> = <span class="code-str">false</span>),
})
<span class="code-tag">&lt;/script&gt;</span></pre>
      </div>
    </div>
  </section>
</template>
