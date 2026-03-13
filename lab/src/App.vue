<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { HealthManifest, Grade } from './types'
import { GRADE_COLORS } from './types'
import manifest from '@health/manifest.json'

const data = manifest as unknown as HealthManifest
const route = useRoute()
const router = useRouter()
const pageTitle = computed(() => (route.meta.title as string) ?? 'Lab')

// Tree state -- which sections are expanded
const expandedSections = ref<Set<string>>(new Set(['components']))

function toggleSection(key: string) {
  if (expandedSections.value.has(key)) {
    expandedSections.value.delete(key)
  } else {
    expandedSections.value.add(key)
  }
}

// Group components by package
const packageGroups = computed(() => {
  const groups: Record<string, typeof data.components> = {}
  for (const c of data.components) {
    if (!groups[c.package]) groups[c.package] = []
    groups[c.package].push(c)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

// Track expanded packages inside the component tree
const expandedPackages = ref<Set<string>>(new Set())

function togglePackage(pkg: string) {
  if (expandedPackages.value.has(pkg)) {
    expandedPackages.value.delete(pkg)
  } else {
    expandedPackages.value.add(pkg)
  }
}

function isActiveRoute(path: string): boolean {
  return route.path === path
}

function isComponentActive(name: string): boolean {
  return route.name === 'detail' && route.params.name === name
}

function isShowcaseActive(id: string): boolean {
  return route.name === 'showcase-detail' && route.params.id === id
}

function gradeColor(grade: Grade): string {
  return GRADE_COLORS[grade]
}
</script>

<template>
  <div
    data-rig-lab
    style="
      display: flex;
      min-height: 100vh;
      background: var(--rig-bg, #0f0d0a);
      color: var(--rig-fg, #f5f1ed);
      font-family: system-ui, -apple-system, sans-serif;
    "
  >
    <!-- Sidebar -->
    <aside
      style="
        width: 240px;
        flex-shrink: 0;
        border-right: 1px solid var(--rig-border, #2a2520);
        background: var(--rig-surface, #1a1815);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        height: 100vh;
        position: sticky;
        top: 0;
      "
    >
      <!-- Logo -->
      <div
        style="
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--rig-border, #2a2520);
          font-weight: 700;
          font-size: 0.8125rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--rig-accent, #c9956d);
        "
      >
        Rig Lab
      </div>

      <nav style="flex: 1; padding: 0.5rem 0; font-size: 0.8125rem">
        <!-- Overview link -->
        <button
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            width: '100%',
            padding: '0.375rem 0.75rem',
            border: 'none',
            background: isActiveRoute('/') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
            color: isActiveRoute('/') ? 'var(--rig-accent, #c9956d)' : 'inherit',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            opacity: isActiveRoute('/') ? 1 : 0.5,
            textAlign: 'left',
            borderLeft: isActiveRoute('/') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
          }"
          @click="router.push('/')"
        >
          Overview
        </button>

        <!-- Intelligence link -->
        <button
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            width: '100%',
            padding: '0.375rem 0.75rem',
            border: 'none',
            background: isActiveRoute('/intelligence') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
            color: isActiveRoute('/intelligence') ? 'var(--rig-accent, #c9956d)' : 'inherit',
            cursor: 'pointer',
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            opacity: isActiveRoute('/intelligence') ? 1 : 0.5,
            textAlign: 'left',
            borderLeft: isActiveRoute('/intelligence') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
          }"
          @click="router.push('/intelligence')"
        >
          Intelligence
        </button>

        <div style="height: 1px; background: var(--rig-border, #2a2520); margin: 0.375rem 0.75rem" />

        <!-- Components section -->
        <div>
          <button
            style="
              display: flex;
              align-items: center;
              gap: 0.375rem;
              width: 100%;
              padding: 0.375rem 0.75rem;
              border: none;
              background: transparent;
              color: inherit;
              cursor: pointer;
              font-size: 0.6875rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              opacity: 0.5;
              text-align: left;
            "
            @click="toggleSection('components')"
          >
            <span
              :style="{
                display: 'inline-block',
                transition: 'transform 0.15s ease',
                transform: expandedSections.has('components') ? 'rotate(90deg)' : 'rotate(0deg)',
                fontSize: '0.625rem',
              }"
            >&#9654;</span>
            Components
          </button>

          <!-- Components overview link -->
          <button
            v-if="expandedSections.has('components')"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.25rem 0.75rem 0.25rem 1.375rem',
              border: 'none',
              background: isActiveRoute('/components') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
              color: isActiveRoute('/components') ? 'var(--rig-accent, #c9956d)' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              textAlign: 'left',
              borderLeft: isActiveRoute('/components') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
            }"
            @click="router.push('/components')"
          >
            All Components
          </button>

          <!-- Package groups -->
          <div v-if="expandedSections.has('components')">
            <div v-for="[pkg, comps] in packageGroups" :key="pkg">
              <button
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  width: '100%',
                  padding: '0.25rem 0.75rem 0.25rem 1.375rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  opacity: 0.7,
                }"
                @click="togglePackage(pkg)"
              >
                <span
                  :style="{
                    display: 'inline-block',
                    transition: 'transform 0.15s ease',
                    transform: expandedPackages.has(pkg) ? 'rotate(90deg)' : 'rotate(0deg)',
                    fontSize: '0.5rem',
                  }"
                >&#9654;</span>
                {{ pkg }}
                <span style="margin-left: auto; opacity: 0.4; font-size: 0.625rem; font-variant-numeric: tabular-nums">
                  {{ comps.length }}
                </span>
              </button>

              <!-- Individual components -->
              <div v-if="expandedPackages.has(pkg)">
                <button
                  v-for="comp in comps"
                  :key="comp.name"
                  :style="{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    width: '100%',
                    padding: '0.1875rem 0.75rem 0.1875rem 2.25rem',
                    border: 'none',
                    background: isComponentActive(comp.name) ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
                    color: isComponentActive(comp.name) ? 'var(--rig-accent, #c9956d)' : 'inherit',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    borderLeft: isComponentActive(comp.name) ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
                  }"
                  @click="router.push({ name: 'detail', params: { name: comp.name } })"
                >
                  <span
                    :style="{
                      width: '0.375rem',
                      height: '0.375rem',
                      borderRadius: '0.125rem',
                      background: gradeColor(comp.grade),
                      flexShrink: 0,
                    }"
                  />
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1">
                    {{ comp.name }}
                  </span>
                  <span
                    v-if="comp.type === 'composable'"
                    style="font-size: 0.5rem; opacity: 0.4; flex-shrink: 0"
                  >fn</span>
                  <span style="opacity: 0.3; font-size: 0.625rem; font-variant-numeric: tabular-nums; flex-shrink: 0">
                    {{ comp.score }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Showcases section -->
        <div style="margin-top: 0.25rem">
          <button
            style="
              display: flex;
              align-items: center;
              gap: 0.375rem;
              width: 100%;
              padding: 0.375rem 0.75rem;
              border: none;
              background: transparent;
              color: inherit;
              cursor: pointer;
              font-size: 0.6875rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              opacity: 0.5;
              text-align: left;
            "
            @click="toggleSection('showcases')"
          >
            <span
              :style="{
                display: 'inline-block',
                transition: 'transform 0.15s ease',
                transform: expandedSections.has('showcases') ? 'rotate(90deg)' : 'rotate(0deg)',
                fontSize: '0.625rem',
              }"
            >&#9654;</span>
            Showcases
          </button>

          <div v-if="expandedSections.has('showcases')">
            <!-- Showcases overview -->
            <button
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                width: '100%',
                padding: '0.25rem 0.75rem 0.25rem 1.375rem',
                border: 'none',
                background: isActiveRoute('/showcases') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
                color: isActiveRoute('/showcases') ? 'var(--rig-accent, #c9956d)' : 'inherit',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                textAlign: 'left',
                borderLeft: isActiveRoute('/showcases') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
              }"
              @click="router.push('/showcases')"
            >
              All Showcases
            </button>

            <!-- Individual showcases -->
            <button
              v-for="showcase in data.showcases"
              :key="showcase.id"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                width: '100%',
                padding: '0.1875rem 0.75rem 0.1875rem 1.375rem',
                border: 'none',
                background: isShowcaseActive(showcase.id) ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
                color: isShowcaseActive(showcase.id) ? 'var(--rig-accent, #c9956d)' : 'inherit',
                cursor: 'pointer',
                fontSize: '0.75rem',
                textAlign: 'left',
                borderLeft: isShowcaseActive(showcase.id) ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
                opacity: isShowcaseActive(showcase.id) ? 1 : 0.7,
              }"
              @click="router.push({ name: 'showcase-detail', params: { id: showcase.id } })"
            >
              <span
                :style="{
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '50%',
                  background: showcase.hasE2e ? '#4ade80' : 'rgba(255,255,255,0.15)',
                  flexShrink: 0,
                }"
              />
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1">
                {{ showcase.name }}
              </span>
              <span style="opacity: 0.3; font-size: 0.625rem; font-variant-numeric: tabular-nums; flex-shrink: 0">
                {{ showcase.componentCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Pipeline section -->
        <div style="margin-top: 0.25rem">
          <button
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.375rem 0.75rem',
              border: 'none',
              background: isActiveRoute('/gaps') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
              color: isActiveRoute('/gaps') ? 'var(--rig-accent, #c9956d)' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              opacity: isActiveRoute('/gaps') ? 1 : 0.5,
              textAlign: 'left',
              borderLeft: isActiveRoute('/gaps') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
            }"
            @click="router.push('/gaps')"
          >
            Gap Analysis
          </button>
          <button
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.375rem 0.75rem',
              border: 'none',
              background: isActiveRoute('/history') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
              color: isActiveRoute('/history') ? 'var(--rig-accent, #c9956d)' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              opacity: isActiveRoute('/history') ? 1 : 0.5,
              textAlign: 'left',
              borderLeft: isActiveRoute('/history') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
            }"
            @click="router.push('/history')"
          >
            History
          </button>
          <button
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.375rem 0.75rem',
              border: 'none',
              background: isActiveRoute('/competitors') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
              color: isActiveRoute('/competitors') ? 'var(--rig-accent, #c9956d)' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              opacity: isActiveRoute('/competitors') ? 1 : 0.35,
              textAlign: 'left',
              borderLeft: isActiveRoute('/competitors') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
            }"
            @click="router.push('/competitors')"
          >
            Feature Matrix
          </button>
          <button
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.375rem 0.75rem',
              border: 'none',
              background: isActiveRoute('/comparison') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
              color: isActiveRoute('/comparison') ? 'var(--rig-accent, #c9956d)' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              opacity: isActiveRoute('/comparison') ? 1 : 0.35,
              textAlign: 'left',
              borderLeft: isActiveRoute('/comparison') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
            }"
            @click="router.push('/comparison')"
          >
            Benchmark Data
          </button>
          <button
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              width: '100%',
              padding: '0.375rem 0.75rem',
              border: 'none',
              background: isActiveRoute('/pipeline') ? 'rgba(201, 149, 109, 0.1)' : 'transparent',
              color: isActiveRoute('/pipeline') ? 'var(--rig-accent, #c9956d)' : 'inherit',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              opacity: isActiveRoute('/pipeline') ? 1 : 0.5,
              textAlign: 'left',
              borderLeft: isActiveRoute('/pipeline') ? '2px solid var(--rig-accent, #c9956d)' : '2px solid transparent',
            }"
            @click="router.push('/pipeline')"
          >
            Pipeline
          </button>
        </div>
      </nav>

      <!-- Footer stats -->
      <div
        style="
          padding: 0.5rem 0.75rem;
          border-top: 1px solid var(--rig-border, #2a2520);
          font-size: 0.625rem;
          opacity: 0.4;
          display: flex;
          gap: 0.75rem;
          font-variant-numeric: tabular-nums;
        "
      >
        <span>{{ data.summary.totalComponents }} comps</span>
        <span>{{ data.summary.totalTests }} tests</span>
        <span>avg {{ data.summary.averageScore }}</span>
      </div>
    </aside>

    <!-- Main content -->
    <div style="flex: 1; display: flex; flex-direction: column; min-width: 0">
      <header
        style="
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1.5rem;
          border-bottom: 1px solid var(--rig-border, #2a2520);
          background: var(--rig-surface, #1a1815);
          flex-shrink: 0;
        "
      >
        <span
          style="
            font-size: 0.8125rem;
            font-weight: 600;
            opacity: 0.7;
          "
        >
          {{ pageTitle }}
        </span>
      </header>

      <main style="flex: 1; padding: 1.5rem; overflow-y: auto">
        <router-view v-slot="{ Component }">
          <Suspense>
            <div v-if="Component" style="display: contents">
              <component :is="Component" />
            </div>
          </Suspense>
        </router-view>
      </main>
    </div>
  </div>
</template>
