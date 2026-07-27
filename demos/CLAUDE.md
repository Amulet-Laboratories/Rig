# @amulet-laboratories/demos

The **Hexrig example sites** — 13 fictional businesses, each a different Hex theme, all built from
Rig + Hex. A standalone Vite + Vue 3 app in the Rig monorepo, deployed to `/hexrig/demos`
(assembled into `deploy/hexrig/demos` by `../scripts/build-deploy.mjs`, then proxied onto
amuletlabs.org via that repo's `netlify.toml`). **Moved here from AmuletLabs.org** so the demos sit
next to the design system they showcase; AmuletLabs.org `/demos/*` 301-redirects here.

## Branding

These are **example sites built with Hexrig** — a design-system showcase, **not** a studio
portfolio. Framing is honest: every business is fictional (shared invented town, Briar Cove),
disclaimed on the gallery. Never present them as real client work. "Hexrig" is the brand; Rig/Hex
are its named layers (see the root `CLAUDE.md`).

## Structure

- `src/pages/demos/DemoIndex.vue` — the gallery (filter pills + cards)
- `src/pages/demos/<name>/index.vue` — one self-contained mini-site per demo; internal pages via
  Rig's `useHashRouter`, theme via `data-hex-theme` on `<SiteShell>` + a scoped token import
  (`@amulet-laboratories/hex/scoped/<theme>`), code-split into that demo's chunk
- `src/router/index.ts` — `/` gallery + one route per demo; base `/hexrig/demos/`
- `src/components/DemoAttribution.vue` + `src/lib/demoManifest.ts` — the "Built with" panel.
  Manifests are keyed by demo id but looked up by `data-hex-theme` value via
  `findManifestByTheme` (matches on each entry's `theme` field — keep them in sync or the panel
  silently stops rendering)
- `src/assets/fonts/*.css` — self-hosted `@font-face`; `url()` paths are **hard-coded to
  `/hexrig/demos/fonts/`** because Vite does not rewrite `public/` asset URLs for a non-root base
- `src/lib/icons-bundle.ts` — offline Iconify bundle (no runtime fetches)

## Conventions

Same composition boundary as Rig: compose from Rig + Hex components, no `style=`, no arbitrary
Tailwind values, no per-demo component CSS. Consumes rig/hex as `workspace:*`. Build:
`pnpm build` (runs `vue-tsc --noEmit && vite build`).

## Adding a demo

Create the theme in `../hex/`, add `src/pages/demos/<name>/index.vue` (font CSS import + scoped
token import + `data-hex-theme`), wire the route in `src/router/index.ts`, add the manifest entry
(with a matching `theme` field), and add the gallery card in `DemoIndex.vue`.
