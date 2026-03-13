<script setup lang="ts">
import type { HealthManifest } from '../types'
import manifest from '@health/manifest.json'

const data = manifest as unknown as HealthManifest

const generated = new Date(data.generated)
const timeAgo = (() => {
  const diff = Date.now() - generated.getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
})()

const commands = [
  {
    label: 'Full health pipeline',
    cmd: 'pnpm health',
    desc: 'Run tests with coverage, then generate manifest',
  },
  {
    label: 'Collect data only',
    cmd: 'pnpm health:collect',
    desc: 'Run vitest with JSON reporter + coverage output',
  },
  {
    label: 'Generate manifest only',
    cmd: 'pnpm health:generate',
    desc: 'Regenerate manifest from existing test/coverage data',
  },
  {
    label: 'Run benchmarks',
    cmd: 'pnpm bench',
    desc: 'Run vitest benchmarks (optional -- feeds bench data)',
  },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 56rem">
    <div>
      <h1 style="margin: 0 0 0.25rem; font-size: 1.25rem; font-weight: 700">Pipeline Status</h1>
      <p style="margin: 0; font-size: 0.8125rem; opacity: 0.5">
        Health manifest generated {{ timeAgo }} ({{ generated.toLocaleString() }})
      </p>
    </div>

    <!-- Data sources -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Data Sources
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <div
          v-for="source in [
            { file: '.health/tests.json', desc: 'Vitest JSON output', present: data.summary.totalTests > 0 },
            { file: 'coverage/coverage-summary.json', desc: 'v8 coverage per file', present: !!data.summary.overallCoverage },
            { file: '.health/bench.json', desc: 'Benchmark results', present: data.components.some(c => c.benchmark.results.length > 0) },
          ]"
          :key="source.file"
          style="
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
            font-size: 0.8125rem;
          "
        >
          <span
            :style="{
              width: '0.625rem',
              height: '0.625rem',
              borderRadius: '50%',
              background: source.present ? '#4ade80' : '#f87171',
              flexShrink: 0,
            }"
          />
          <code style="font-size: 0.75rem; opacity: 0.7">{{ source.file }}</code>
          <span style="opacity: 0.4">{{ source.desc }}</span>
          <span
            :style="{
              marginLeft: 'auto',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: source.present ? '#4ade80' : '#f87171',
            }"
          >
            {{ source.present ? 'Available' : 'Missing' }}
          </span>
        </div>
      </div>
    </section>

    <!-- Commands -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Commands
      </h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <div
          v-for="cmd in commands"
          :key="cmd.cmd"
          style="
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
          "
        >
          <code
            style="
              padding: 0.25rem 0.5rem;
              border-radius: 0.25rem;
              background: rgba(201, 149, 109, 0.1);
              color: var(--rig-accent, #c9956d);
              font-size: 0.75rem;
              white-space: nowrap;
            "
          >
            {{ cmd.cmd }}
          </code>
          <div>
            <div style="font-size: 0.8125rem; font-weight: 600">{{ cmd.label }}</div>
            <div style="font-size: 0.6875rem; opacity: 0.4">{{ cmd.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Package scores -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Scoring Profiles
      </h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
        <div
          style="
            padding: 1rem;
            border-radius: 0.375rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
          "
        >
          <div style="font-size: 0.8125rem; font-weight: 700; margin-bottom: 0.5rem">Component</div>
          <div
            v-for="w in [
              { label: 'Tests', pts: 25 },
              { label: 'Coverage', pts: 25 },
              { label: 'Accessibility', pts: 20 },
              { label: 'Story', pts: 10 },
              { label: 'Hex CSS', pts: 10 },
              { label: 'Benchmark', pts: 10 },
            ]"
            :key="w.label"
            style="display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.6; padding: 0.125rem 0"
          >
            <span>{{ w.label }}</span>
            <span style="font-variant-numeric: tabular-nums">{{ w.pts }} pts</span>
          </div>
        </div>
        <div
          style="
            padding: 1rem;
            border-radius: 0.375rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
          "
        >
          <div style="font-size: 0.8125rem; font-weight: 700; margin-bottom: 0.5rem">Composable</div>
          <div
            v-for="w in [
              { label: 'Tests', pts: 40 },
              { label: 'Coverage', pts: 40 },
              { label: 'Benchmark', pts: 20 },
            ]"
            :key="w.label"
            style="display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.6; padding: 0.125rem 0"
          >
            <span>{{ w.label }}</span>
            <span style="font-variant-numeric: tabular-nums">{{ w.pts }} pts</span>
          </div>
          <div style="font-size: 0.6875rem; opacity: 0.35; margin-top: 0.5rem">
            A11y, Story, Hex not applicable -- weights redistributed
          </div>
        </div>
      </div>
    </section>

    <!-- Package scores -->
    <section>
      <h2 style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em">
        Package Scores
      </h2>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        "
      >
        <div
          v-for="pkg in data.summary.packages"
          :key="pkg.name"
          style="
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            border: 1px solid var(--rig-border, #2a2520);
            background: var(--rig-surface, #1a1815);
          "
        >
          <div style="font-size: 0.75rem; font-weight: 600">{{ pkg.name }}</div>
          <div style="display: flex; align-items: baseline; gap: 0.375rem; margin-top: 0.25rem">
            <span
              :style="{
                fontSize: '1.25rem',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: pkg.avgScore >= 75 ? '#4ade80' : pkg.avgScore >= 60 ? '#facc15' : '#f87171',
              }"
            >
              {{ pkg.avgScore }}
            </span>
            <span style="opacity: 0.4; font-size: 0.6875rem">avg</span>
          </div>
          <div style="font-size: 0.6875rem; opacity: 0.4; margin-top: 0.125rem">
            {{ pkg.count }} items
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
