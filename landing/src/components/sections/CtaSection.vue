<template>
  <section id="get-started" class="reveal px-6 py-24 text-center" aria-labelledby="cta-title">
    <div class="mx-auto max-w-[1200px]">
      <h2 id="cta-title" class="mb-3 text-[clamp(28px,3.5vw,40px)] font-bold tracking-tight">
        Start building.
      </h2>
      <p class="mx-auto mb-8 max-w-[480px] text-[17px] text-text-muted">
        MIT licensed. Two packages. Get a full design system in three lines.
      </p>

      <div
        class="mx-auto mb-8 max-w-[640px] overflow-hidden rounded-xl border border-border bg-bg text-left"
      >
        <div
          class="flex items-center gap-2 border-b border-border-subtle px-4 py-3 font-mono text-xs text-text-dim"
        >
          <span class="h-2.5 w-2.5 rounded-full bg-accent-red/50" />
          <span class="h-2.5 w-2.5 rounded-full bg-accent-amber/50" />
          <span class="h-2.5 w-2.5 rounded-full bg-accent-green/50" />
          <span class="ml-2">terminal</span>
        </div>
        <pre
          class="p-5 font-mono text-sm leading-[1.7] text-text-muted"
        ><span class="text-primary">$</span> pnpm add @amulet-laboratories/rig @amulet-laboratories/hex
<span class="text-primary">$</span> pnpm add vue@^3.5 @floating-ui/vue@^1</pre>
      </div>

      <div class="flex flex-wrap justify-center gap-3">
        <a
          href="https://github.com/Amulet-Laboratories/Rig"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-[15px] font-medium text-bg no-underline transition hover:-translate-y-px hover:bg-primary-hover hover:shadow-[0_4px_20px_var(--color-primary-dim)]"
        >
          View on GitHub
        </a>
        <a
          href="https://github.com/Amulet-Laboratories/Rig#readme"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-6 py-3 text-[15px] font-medium text-text no-underline transition hover:-translate-y-px hover:border-text-dim hover:bg-bg-surface-hover"
        >
          Read the Docs
        </a>
      </div>
    </div>
  </section>
</template>
