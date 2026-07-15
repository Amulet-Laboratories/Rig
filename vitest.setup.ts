import { beforeEach } from 'vitest'

/**
 * Every test starts with empty storage.
 *
 * jsdom hands the whole file one `localStorage`, and `usePersistedState`
 * hydrates from it on creation. Shell state persists under a fixed namespace —
 * `rig-shell:sidebar-visible` and friends — which every test shares, because
 * none of them pass a namespace. So a test that hides the sidebar wrote `false`,
 * and the next test to mount a shell read it back and saw a "clean initial
 * state" that was not clean.
 *
 * That is what made `workbench-flows.test.ts` fail on CI while passing locally:
 * it depends on which tests ran first in the same worker, so it moves with
 * sharding and file order rather than with any code change. It failed the
 * rig-nuxt 0.5.2 release and passed six local runs immediately after.
 *
 * The companion fix is in `usePersistedState`, which now flushes its debounced
 * write on scope dispose instead of letting a 100ms timer fire into whatever
 * test happens to be running by then.
 */
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})
