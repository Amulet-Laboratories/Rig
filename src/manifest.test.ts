import { expect, it } from 'vitest'
import * as Rig from './index'

// Rig owns the inventory of its own components + composables. rig-nuxt (and any
// other tooling) consume `@amulet-laboratories/rig/manifest` rather than
// re-listing names by hand — a hardcoded list drifts the moment a component is
// added. This test regenerates that manifest from the live barrel and pins it:
// run `pnpm manifest:gen` to update `src/generated/manifest.ts`, and CI fails
// here if a component/composable is added without regenerating.

const isComponent = (v: unknown): boolean => {
  if (!v || (typeof v !== 'object' && typeof v !== 'function')) return false
  const c = v as Record<string, unknown>
  // Vue SFCs / defineComponent objects carry at least one of these markers;
  // injection keys (Symbols) and plain helpers (EventBus, toast) do not.
  return (
    '__name' in c ||
    'render' in c ||
    'setup' in c ||
    'ssrRender' in c ||
    '__file' in c ||
    '__vccOpts' in c
  )
}

const barrel = Rig as Record<string, unknown>
const names = Object.keys(barrel).sort()

const components = names.filter((n) => /^[A-Z]/.test(n) && isComponent(barrel[n]))
const composables = names.filter((n) => /^use[A-Z]/.test(n) && typeof barrel[n] === 'function')

function renderManifest(): string {
  const list = (arr: string[]) => arr.map((n) => `  '${n}',`).join('\n')
  return `// AUTO-GENERATED — do not edit by hand.
// Regenerate with \`pnpm manifest:gen\`. The drift guard in src/manifest.test.ts
// fails CI if this file is stale relative to the Rig barrel.
//
// The canonical inventory of Rig's auto-importable surface. Consumed by
// @amulet-laboratories/rig-nuxt for component auto-import, and available to any
// other tooling that needs the name list without hardcoding it.

export const components = [
${list(components)}
] as const

export const composables = [
${list(composables)}
] as const

export type RigComponentName = (typeof components)[number]
export type RigComposableName = (typeof composables)[number]
`
}

it('exports a substantial component surface (sanity check on classification)', () => {
  expect(components.length).toBeGreaterThan(140)
  expect(composables.length).toBeGreaterThan(20)
})

it('generated manifest is current (run `pnpm manifest:gen` if this fails)', async () => {
  await expect(renderManifest()).toMatchFileSnapshot('./generated/manifest.ts')
})
