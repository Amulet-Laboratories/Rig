<template>
  <div class="mx-auto my-0 h-px max-w-[1200px] bg-border-subtle" />

  <section class="reveal px-6 py-24" aria-labelledby="quickstart-title">
    <div class="mx-auto max-w-[1200px]">
      <div class="mb-14 text-center">
        <div class="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Quick Start
        </div>
        <h2
          id="quickstart-title"
          class="mb-4 text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight"
        >
          Three steps. Full design system.
        </h2>
        <p class="mx-auto max-w-[520px] text-[17px] leading-relaxed text-text-muted">
          From zero to styled components in under a minute.
        </p>
      </div>

      <div class="stagger-children mx-auto grid max-w-[900px] grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Step 1 -->
        <div class="rounded-xl border border-border-subtle bg-bg-elevated p-6">
          <div class="mb-4 flex items-center gap-3">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-bg"
            >
              1
            </span>
            <h4 class="text-[15px] font-semibold">Install</h4>
          </div>
          <div class="overflow-hidden rounded-lg border border-border-subtle bg-bg">
            <pre
              class="p-4 font-mono text-[12px] leading-relaxed text-text-muted"
            ><span class="text-primary">$</span> pnpm add @amulet-laboratories/rig
<span class="text-primary">$</span> pnpm add @amulet-laboratories/hex</pre>
          </div>
          <p class="mt-3 text-[13px] leading-relaxed text-text-dim">
            Rig for components, Hex for themes. Vue 3.5+ and Floating UI are peer deps.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="rounded-xl border border-border-subtle bg-bg-elevated p-6">
          <div class="mb-4 flex items-center gap-3">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-bg"
            >
              2
            </span>
            <h4 class="text-[15px] font-semibold">Import a theme</h4>
          </div>
          <div class="overflow-hidden rounded-lg border border-border-subtle bg-bg">
            <pre
              class="p-4 font-mono text-[12px] leading-relaxed text-text-muted"
            ><span class="code-cmt">/* main.css */</span>
<span class="code-kw">@import</span> <span class="code-str">'@amulet-laboratories/hex/vscode'</span>;</pre>
          </div>
          <p class="mt-3 text-[13px] leading-relaxed text-text-dim">
            Pick any of 18 themes. Swap by changing one import. Zero config.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="rounded-xl border border-border-subtle bg-bg-elevated p-6">
          <div class="mb-4 flex items-center gap-3">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-bg"
            >
              3
            </span>
            <h4 class="text-[15px] font-semibold">Use components</h4>
          </div>
          <div class="overflow-hidden rounded-lg border border-border-subtle bg-bg">
            <pre
              class="p-4 font-mono text-[12px] leading-relaxed text-text-muted"
            ><span class="code-kw">import</span> { <span class="code-comp">Button</span> } <span class="code-kw">from</span> <span class="code-str">'@amulet-laboratories/rig'</span>

<span class="code-punct">&lt;</span><span class="code-comp">Button</span> <span class="code-attr">variant</span>=<span class="code-str">"primary"</span><span class="code-punct">&gt;</span>Ship it<span class="code-punct">&lt;/</span><span class="code-comp">Button</span><span class="code-punct">&gt;</span></pre>
          </div>
          <p class="mt-3 text-[13px] leading-relaxed text-text-dim">
            144 components. Tree-shakeable. Typed slots and emits. Full ARIA built in.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
