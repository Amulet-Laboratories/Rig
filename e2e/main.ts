/**
 * E2E test harness — renders a single component fixture per page load.
 *
 * Each fixture is a Vue SFC in e2e/fixtures/ that composes one or more Rig
 * components into a testable scenario. The URL hash selects the fixture:
 *
 *   http://localhost:5200/#ModalBasic  →  loads e2e/fixtures/ModalBasic.vue
 *
 * Fixtures are registered in the `fixtures` map below.
 */
import { createApp, defineAsyncComponent } from 'vue'

const fixtures: Record<string, () => Promise<{ default: unknown }>> = {
  ModalBasic: () => import('./fixtures/ModalBasic.vue'),
  ModalPersistent: () => import('./fixtures/ModalPersistent.vue'),
  ModalFocusTrap: () => import('./fixtures/ModalFocusTrap.vue'),
}

const name = location.hash.slice(1)
const loader = fixtures[name]

if (loader) {
  const Fixture = defineAsyncComponent(loader as Parameters<typeof defineAsyncComponent>[0])
  createApp(Fixture).mount('#app')
} else {
  document.getElementById('app')!.innerHTML = `
    <h1>Rig E2E fixtures</h1>
    <ul>${Object.keys(fixtures)
      .map((k) => `<li><a href="#${k}">${k}</a></li>`)
      .join('')}</ul>
  `
}
