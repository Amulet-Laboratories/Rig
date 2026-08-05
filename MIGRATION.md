# Migration

## 3.4.2 → 4.0.0 — spatial components move off the root barrel

**Breaking, and small.** The five spatial components — `MapCanvas`, `GlobeView`,
`GraphNetwork`, `PointCloud`, `ScatterPlot3D` — are no longer re-exported from
`@amulet-laboratories/rig`. Import them from the subpath, which has always existed:

```diff
-import { GraphNetwork } from '@amulet-laboratories/rig'
+import { GraphNetwork } from '@amulet-laboratories/rig/spatial'
```

They are also no longer in `src/generated/manifest.ts`, so **`rig-nuxt` no longer
auto-imports them** — a Nuxt app using `<GraphNetwork>` without an explicit import will
now fail to resolve the component. Add the import.

### Why

`@spatial` statically imports `d3`, which is declared an **optional** peer. Re-exporting it
from the root barrel made that claim false: Node resolves the import when the barrel is
evaluated, so any consumer who had not installed `d3` got

```
Cannot find package 'd3' imported from …/useForceGraph-*.js
```

on their first server render, from a page with no graph on it. Tree-shaking does not help —
it runs in the bundler, and SSR evaluates real ESM.

Nobody inside the estate hit it because QuizSort declares `d3` itself. It was found on
2026-08-04 by installing the published package into an empty Nuxt app, which is now
`scripts/consumer-smoke.mjs` and runs in CI.

`dompurify` and `markdown-it` moved the other way, from optional peers to ordinary
dependencies: `renderMarkdown` is a synchronous export of `core`, which every consumer
loads, so they were never optional. **No action needed** — they now install with the package.

---

# Migration Guide

Newest first.

## 0.7.0 → 3.0.0

### Why the version jumps to 3.0.0

There is no rig 1.x or 2.x on npm. The jump is deliberate.

`@amulet-laboratories/rig` also exists on **GitHub Packages**, a separate registry with its
own independent version line, currently at 2.x. Releasing this as 1.0.0 would have produced
two live packages of the same name where the npm one reads as _older_ than the GitHub
Packages one to anyone who does not know the registries are unrelated. Nothing would have
broken — resolution is per-registry — but the numbers would have been permanently
misleading. Starting the npm line at 3.0.0 puts it clear of the 2.x line so no version
number is ever ambiguous between the two.

Consumers on the GitHub Packages 2.x line (currently `vrd`) are **not affected** and should
not migrate.

### `@amulet-laboratories/hex` is now part of `@amulet-laboratories/rig`

**Who is affected:** every consumer that installs `@amulet-laboratories/hex`.

hex was never a separate project — it has always been a workspace package inside this repo.
Only the _published_ artifacts were split, which meant the two could never move
independently: every hex change that mattered needed a matching rig release, and consumers
had to keep two version numbers in step by hand. They are now one package.

**What to do.** Drop the dependency:

```bash
pnpm remove @amulet-laboratories/hex
pnpm add @amulet-laboratories/rig@^3.0.0
```

Then rewrite the import specifiers — every hex subpath keeps its shape under a `hex/`
prefix, so the change is mechanical:

| Before                                   | After                                        |
| ---------------------------------------- | -------------------------------------------- |
| `@amulet-laboratories/hex`               | `@amulet-laboratories/rig/hex`               |
| `@amulet-laboratories/hex/source`        | `@amulet-laboratories/rig/hex/source`        |
| `@amulet-laboratories/hex/slate`         | `@amulet-laboratories/rig/hex/slate`         |
| `@amulet-laboratories/hex/slate/source`  | `@amulet-laboratories/rig/hex/slate/source`  |
| `@amulet-laboratories/hex/scoped/iris`   | `@amulet-laboratories/rig/hex/scoped/iris`   |
| `@amulet-laboratories/hex/shared/tokens` | `@amulet-laboratories/rig/hex/shared/tokens` |

A find-and-replace of `@amulet-laboratories/hex` → `@amulet-laboratories/rig/hex` across
CSS, Vue, and TS sources is sufficient. No theme names, token names, or selectors changed.

### Theme changes in the same release

The fold moved no pixels, but 3.0.0 also carries theme work done alongside it. If you use
any of these, read the notes:

- **`slate`, `roast`, `fern`, `quartz`, `damson`, `brass`** no longer contain the long-form
  content-site skin (hero, cards, prose, newsletter CTA, footer). Those six themes each
  carried a ~730-line `domains.css` that was really the same site skin copied six times —
  96% identical. It now lives in the opt-in `hex/shared/site` layer, and each theme is
  ~13.4 KB smaller. **If you relied on it, add
  `@import '@amulet-laboratories/rig/hex/shared/site'`** plus your own `[data-category]`
  accent map and `--site-*` overrides. See the hex README's "site layer" section.
- **`beacon` and `voltaic` were broken and are now fixed.** Neither imported the shared
  component CSS, and neither declared the typography tokens that CSS depends on, so both
  shipped at ~15 KB against 106–150 KB for a real theme — tokens and base only, every
  component unstyled. Both now build at ~105 KB. If you were using either, expect components
  to become styled.
- **`voltaic` was re-cut** from `#aef66d` on `#060d2b` — a byte-for-byte duplicate of
  `spacewizard` — to arc chartreuse `#cfe84a` on graphite `#0d0f08`. It also dropped the
  `--color-*: initial` namespace resets and the private `--color-blue-*` utility names it
  had carried from the portfolio site it was ported from.
- **`forge` was re-cut** from CRT yellow phosphor `#e6c830` to CRT magenta phosphor
  `#dd55e8`. Its surfaces, typography, and radii are unchanged. It sat 1° from `citron` in
  hue; it now fills the largest gap in the palette.
- **All 27 themes now honour `data-theme='unstyled'`.** That escape hatch was defined in
  11 themes' `domains.css` and silently absent from the other 16; it is now in
  `shared/rig-defaults.css`.

**Note for Tailwind users:** `hex/*/source` still ships as uncompiled source (rig's `files`
carries both `hex/dist` and `hex/src`), so a build that runs the theme through its own
Tailwind pass keeps working unchanged.

**`@amulet-laboratories/rig-nuxt` is unaffected** and remains a separate package.

`@amulet-laboratories/hex` is deprecated on npm at 0.8.0. It will not receive further
releases; the last published version keeps working, so there is no forced timeline.

## 0.1.0 → 0.2.0

### `@floating-ui/vue` is now a required peer dependency

**Who is affected:** Any consumer who did not have `@floating-ui/vue` installed.

**Components that depend on it:** Popover, ContextMenu, DropdownMenu.

**What to do:**

```bash
pnpm add @floating-ui/vue@^1.0.0
```

If none of those three components are used, the package is still required as a peer dep but will not be imported at runtime (tree-shaking removes the imports). Install it to satisfy the peer dep check.

**Why:** In 0.1.0, `@floating-ui/vue` was marked optional and consumers who did not import Popover/ContextMenu/DropdownMenu could omit it. In 0.2.0, the peer dep is unconditional to simplify the install story and because the three dependent components are now widely used.
