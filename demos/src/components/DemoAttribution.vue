<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { findManifestByTheme, STACK, type DemoBuildManifest } from '@/lib/demoManifest'

const manifest = ref<DemoBuildManifest | null>(null)

onMounted(() => {
  // SiteShell renders [data-rig-site-shell][data-hex-theme="<theme>"] — read it
  // once mounted so we know which manifest to surface in the "Built with" panel.
  const shell = document.querySelector<HTMLElement>('[data-rig-site-shell][data-hex-theme]')
  const theme = shell?.dataset.hexTheme ?? null
  manifest.value = findManifestByTheme(theme)
})
</script>

<template>
  <div class="demo-attribution">
    <span class="demo-attribution-credit">
      Built with Hexrig by
      <a href="https://amuletlabs.org/" class="demo-attribution-link">Amulet Laboratories</a>
    </span>

    <details v-if="manifest" class="demo-attribution-details">
      <summary class="demo-attribution-summary">
        Built with — <span aria-hidden="true">↓</span>
      </summary>
      <div class="demo-attribution-built">
        <dl class="demo-attribution-grid">
          <div>
            <dt>Pages</dt>
            <dd>{{ manifest.pages }}</dd>
          </div>
          <div>
            <dt>Demo source</dt>
            <dd>~{{ manifest.loc.toLocaleString() }} LOC</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{{ STACK.join(' · ') }}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{{ manifest.fonts.join(' · ') }}</dd>
          </div>
        </dl>
        <p class="demo-attribution-rig">
          <span class="demo-attribution-rig-label">Rig components used:</span>
          <span v-for="(c, i) in manifest.rigComponents" :key="c" class="demo-attribution-chip">
            {{ c }}<template v-if="i < manifest.rigComponents.length - 1"></template>
          </span>
        </p>
      </div>
    </details>

    <a href="https://amuletlabs.org/#contact" class="demo-attribution-cta"
      >Want a site like this?</a
    >
  </div>
</template>
