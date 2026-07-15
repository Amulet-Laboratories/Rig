# Library Pass — Plan

> **Status:** Drafted 2026-07-14. Fleet-wide sibling to Obelisk's
> [RIG-PASS-PLAN.md](../../Obelisk/docs/RIG-PASS-PLAN.md), which covers a
> single consumer. This plan covers **all** rig/hex consumers and the
> library internals.

A pass over `@amulet-laboratories/rig` + `@amulet-laboratories/hex` to
close the gap between what the library ships and what consumers actually
need. Every item is an **upstream** fix — a missing component, prop,
variant, or CSS hook — chosen so it deletes hand-rolled one-offs across
many sites at once, rather than patching each site.

## Guiding principle

From `CLAUDE.md`: if a consumer needs `style=`, arbitrary Tailwind
(`text-[10px]`, `grid-cols-[…]`), or a hand-rolled duplicate to use a rig
component correctly, the component is **missing a prop, variant, slot, or
sibling component**. Fix it here, not in the site.

## Consumer cleanup — release gating (important)

Consumer-side cleanup (deleting one-offs, deleting shadow copies) can only
happen where the new APIs are actually available:

- **Obelisk** links `file:../Rig` and Vite-aliases Rig **source** (+ imports
  `rig/styles`), so every unreleased change is live immediately. Its cleanup
  can proceed **now**. ✅ **Swept 2026-07-14** — 73 one-offs across 25 files
  replaced with the new props (7 Icon `color`, 3 Card `:selected`, 14 Card
  `layout="row"`/`columns`, 49 Badge `size="sm"`, +1 Button `size="xs"` after
  shipping the Button size scale); `pnpm typecheck` clean; **zero** inline-style /
  arbitrary-Tailwind one-offs remain across all built APIs (74 total). Every
  Obelisk-facing gap in Workstreams B is both shipped upstream **and** cleaned up
  in the consumer.
- **All content sites + AmuletLabs** consume **published** `^` versions
  (rig `^0.5.1`/`^0.4.1`, hex `^0.6.0`/`^0.5.2`, rig-nuxt `^0.4.0`). The
  unreleased work does **not** reach them. Deleting their local copies or
  swapping to new props now would **break their builds**. Their cleanup is
  **blocked on releasing** rig 0.6.0 / hex 0.6.x / rig-nuxt 0.5.0 and each site
  bumping to it. Do not touch those repos until then.

## Status legend

- ⬜ not started
- 🟡 in progress
- ✅ landed
- 🔵 needs a decision before work starts

---

## Diagnosis (2026-07-14 audit)

The libraries are **internally healthy**: 2,633 Rig tests + 15 hex tests
pass, `pnpm check` clean, zero `TODO`/`FIXME` debt, no skipped tests,
`main` committed and current. **All** the debt is at the composition
boundary — consumers reaching past the component API.

### Consumer landscape

| Group                      | Projects                                                                                                    | Pins                                                   | How they consume                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Nuxt content fleet (8)** | Beanwoven, FewerSerums, Meepleloft, OneGoodLamp, The Shelf Nook, TheScruffGuide, QuizSort, site-boilerplate | rig `0.5.1` / hex `0.6.0` / rig-nuxt `0.4.0` (uniform) | Nuxt module auto-import; hex as one theme `…/source` CSS import per site |
| **SPA sites (2)**          | AmuletLabs.org (lagging `0.4.1`/`0.5.2`), vrd (**divergent `2.0.0` on `hex-origins`**)                      | mixed                                                  | Root barrel + `hex/tailwind` preset                                      |
| **Desktop (1)**            | Obelisk                                                                                                     | `file:../Rig` (live dev)                               | Root barrel + hex `cobalt`/`beacon`                                      |

Non-consumers (verified): AndrewPassanisi.com, noosphere, spork, spork-wow,
products-db. `Config` is the shared `@amulet-laboratories/config` package.

---

## Workstream A — Componentize the content/affiliate layer 🟢 highest impact

**Reconciled 2026-07-14 — the picture was better than the audit implied.**
The content components are **Nuxt-specific** (they use `NuxtLink`, `useRoute`,
`@nuxt/content`, server routes) and already live in
`@amulet-laboratories/rig-nuxt`'s content runtime
(`nuxt/src/runtime/components/content/*.vue`), gated behind `content: true` —
**not** in core Rig's `packages/`. Hex already ships the matching skin in
`content.css`. So this is **not** "build 13 components from scratch" — most
exist (`ProductCardWrapper`, `ArticleHeader`, `AffiliateDisclosure`,
`NetworkFooter`, `CookieConsent`, `TableOfContents`, `RelatedArticles`,
`CompareCard`/compare pages, persona pages, `CategoryIcon`, …).

The real problem: sites carry **local `components/content/*.vue` copies that
shadow the upstream ones** (and have drifted from them), plus a few genuine
gaps Hex/rig-nuxt never covered.

### Landed

- ✅ **`QuickAnswer` (callout) + `FaqBlock` — the two genuine gaps** (2026-07-14).
  Hex had **no** `data-rig-callout` or `data-rig-faq` rules, which is exactly
  why every site's local copy shipped a `<style scoped>` block. Now upstreamed
  headless in rig-nuxt (`QuickAnswer` → `data-rig-callout*`, `FaqBlock` →
  `data-rig-faq*` + FAQPage schema.org), with structural CSS in
  `src/styles/content.css` and skin in Hex `content.css`. `@nuxtjs/seo` added as
  an optional peer for `FaqBlock`. Registered in `module.ts`.

### Remaining

- ⬜ **Consumer cleanup sweep** (per-site, enabled now): delete each site's local
  `components/content/{QuickAnswer,FaqBlock,ProductCardWrapper,CategoryIcon}.vue`
  so the upstream auto-imports win. These are shadow duplicates that have drifted
  — reconcile any intentional per-site tweaks into props first.
- 🔵 **Decision:** `site-boilerplate` (cobalt) and QuizSort (citron) themes don't
  import Hex `content.css`, so the content skin doesn't reach them. Confirm
  whether those sites need it (site-boilerplate is the content-site template — it
  probably should).
- ⬜ Audit the remaining local `components/content/*` across the fleet for any
  other drifted-from-upstream copies or uncovered patterns.

---

## Workstream B — Primitive prop gaps 🟢 highest frequency

| Fix                                                                     | Eliminates                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **Badge: `size` scale now renders** (2026-07-14)                     | ~40 `text-[10px]` across 20 Obelisk files, the `!important` trio, QuizSort's 3 local badge comps + ~24 pill divs — _most repeated smell in the fleet_. The `size` prop + `data-size` already existed but no CSS backed it; added the xs/sm/md/lg/xl scale to `src/styles/core.css` (+ scaffold + story). Tone was already covered by the existing `variant` styling in hex. **Consumer cleanup pending:** sites can now drop `text-[10px]`/`!important` for `<Badge size="sm">` and swap QuizSort's local badges for `<Badge :variant>`. |
| ✅ **Card: `selected` state + `layout="row"`/`columns`** (2026-07-14)   | 3 inline `borderColor` + 15 `grid-cols-[…]` in Obelisk business views. `selected` → `data-selected` (Hex `--rig-card-selected-border` border); `layout="row"` + `columns` → structural grid in `rig/styles`. **Consumer cleanup pending:** business views can drop `class="grid grid-cols-[…] items-center"` for `<Card layout="row" columns="…">`, and featured cards drop the inline `borderColor` for `:selected`.                                                                                                                    |
| ✅ **Icon: `tone` + `color` props** (2026-07-14)                        | 7 hardcoded-hex `style="color:#…"` in Obelisk MTG views. `tone` → `data-tone` (Hex token map); `color` → inline escape hatch for the MTG domain hexes. **Consumer cleanup pending:** swap `style="color:#c9956d"` → `<Icon color="#c9956d">` (or a `tone` where it maps to a theme token).                                                                                                                                                                                                                                               |
| ✅ **Input/Select: `size` prop now renders** (2026-07-14)               | Consumers already passed `size="sm"` but it was a silent no-op (no prop, no CSS). Added `size` to both + sm/lg CSS in `rig/styles`. **Note:** the `min-w-[Npx]` values in filter strips are legitimate layout composition (a site sizing its own filters), not a component defect — left as-is.                                                                                                                                                                                                                                          |
| ✅ **Button: `size` prop now renders** (2026-07-14)                     | Same latent no-op as Input/Select — `Button` emitted `data-size` with no CSS, so consumers forced small buttons with `!important` (`!h-6 !px-2 !text-[10px]`). Added xs/sm/lg/xl scale (padding + font + icon-only dims) in `rig/styles`. Obelisk's one `!important` button swapped to `size="xs"`.                                                                                                                                                                                                                                      |
| ✅ **SectionDivider `fill`/`bg` + FlankedHeading `color`** (2026-07-14) | 8 inline `--var` styles on AmuletLabs. Added props that drive the custom properties; also **wired two dead vars** (`--section-divider-bg` was never applied; ornament color was hardcoded). **Consumer cleanup pending:** AmuletLabs can drop `style="--section-divider-fill:…; --section-divider-bg:…"` for `<SectionDivider fill=… bg=…>` and the `--flanked-heading-color` inline for `<FlankedHeading color=…>`.                                                                                                                     |
| ⬜ **Hero `minHeight`/`size` + Divider `length`**                       | remaining AmuletLabs demo arbitraries — 2 `min-h-[Nvh]` + 1 `max-w-[120px]`, isolated to AmuletLabs demo pages. Lowest priority; fold into a later web pass.                                                                                                                                                                                                                                                                                                                                                                             |

**Workstream B is effectively complete** — every Obelisk- and AmuletLabs-facing
primitive gap is closed. Only the 3 low-frequency AmuletLabs _demo-page_
arbitraries (Hero min-height, Divider length) remain, deferred as cosmetic.

---

## Workstream C — FAQ pattern ⬜

12 files hand-roll `<details>/<summary>`; only 1 site uses Rig's
`Accordion`. **Decision 🔵:** ship a dedicated `Faq`/`FaqList`, or document
Accordion-as-FAQ and migrate. Either way removes `FaqBlock.vue` ×7.

---

## Workstream D — Nuxt module drift ✅ landed 2026-07-14

`nuxt/src/module.ts` hardcoded a `COMPONENTS` array that had fallen **17
components behind** the barrel (`ChatPanel`, `ConfirmDialog`,
`ContentViewer`, `ErrorBoundary`, `FileBrowser`, `FormView`,
`SidebarSection`, `SplitEditorArea`, `StatLine`, `WelcomeView`, +7).
Anything added in A/B/C would not have reached the 8 Nuxt sites until this
was fixed. **Resolution — the fix lives in the library, not per-site:**

- ✅ **New `@amulet-laboratories/rig/manifest` export** — pure-data
  `{ components, composables }` (+ `RigComponentName`/`RigComposableName`
  types), generated from the barrel (`src/generated/manifest.ts`) by
  `pnpm manifest:gen`, pinned by a CI **drift guard** (`src/manifest.test.ts`)
  that fails if a component is added without regenerating. Built as its own
  vite entry (`dist/manifest.*`); data-only so consuming it never pulls
  `d3`/`markdown-it` into a bundle.
- ✅ **rig-nuxt derives its auto-import list from the manifest** — components
  wholesale; composables from the manifest's `use*` list minus content-gated
  `useFathom`; the non-`use*` helpers (`provideDragDrop`, `provideConfig`,
  `toast`, `notification`) stay explicit. New Rig components now auto-import
  the moment a consumer bumps Rig — no edit here required.
- ✅ **Docs:** fixed stale `nuxt/README.md` ("all 98 components" → derived;
  dead `hex/vscode` example → `hex/cobalt`); added `nuxt/CHANGELOG.md`;
  Unreleased entry in Rig's changelog.
- ⚠️ **Release coupling:** rig-nuxt peer raised to `@amulet-laboratories/rig
  > =0.6.0`(the manifest-bearing version). The 8 Nuxt sites pin rig`^0.5.1`
  > (excludes 0.6.0) — they must bump **rig + rig-nuxt together** when 0.6.0
  > ships. Not yet E2E-verified in a built Nuxt site (sites consume published
  > rig, not the workspace); verify against one site after the 0.6.0 release.

---

## Workstream E — Internal loose ends 🟡

- ✅ **SplitView — assessed, not a real gap** (2026-07-14). Re-checked: the generic resizer/gutter **is** hex-styled (`layout.css` — hover/active/dragging via `--rig-sash-hover`, invisible at rest per the VSCode sash convention), and panes are transparent-by-design containers. **No consumer uses `<SplitView>` directly or styles it inline** (Obelisk/AmuletLabs go through `IdeShell`/`SplitEditorArea`, which has its own full resizer skin in `editor.css`). The audit overstated this — no action. (`Icon` since gained `tone`/`color` in B; `Form`/`InfiniteScroll` remain intentionally scaffold-only — layout/utility components with no themed surface.)
- ✅ **`useZoom` lifecycle warnings fixed** (2026-07-14) — guarded the `onMounted`/`onUnmounted` registration behind `getCurrentInstance()`, so the composable is safe to construct outside a component `setup()` (tests, non-setup contexts) without Vue warnings. Zero behavior change (the hooks no-op outside setup anyway).
- ✅ **`Transfer` test added** (2026-07-14) — 9 cases covering render, selection (click + keyboard), move-right/left emits, disabled, and custom slots. The flagged priority (stateful dual-list widget).
- ⬜ **`SplitEditorArea` test** — still missing (interactive resizer); optionally `CrashScreen`, `MapPlaceholder` (presentational).

---

## Workstream F — Distribution & docs hygiene 🟡

- ✅ **hex `prepare` hook** (2026-07-14) — added `"prepare": "node build.mjs"`, so the gitignored `dist/` is built on install and before publish. Fixes the root cause of Obelisk's `ensure-hex.mjs` **and** a latent risk of publishing hex without a fresh `dist/`. (Obelisk's `ensure-hex.mjs` is now a redundant idempotent safety-net — deletable once the hook is proven across a clean install; left in place for now.)
- ✅ **hex `CLAUDE.md` rewritten** (2026-07-14) — corrected the theme roster (4 removed themes → the real 27, default `cobalt`), the shared component-file list (added `prose`/`web`/`content`), theme tree, import examples, and build outputs. (Obelisk `app.css:113`'s dead-`vscode` comment is a consumer-side note; fix during the release-gated Obelisk cleanup.)
- ✅ **`[Unreleased]` sections** now capture all this pass's work across rig / hex / rig-nuxt changelogs.
- ⬜ **Version skew:** bring AmuletLabs.org up to fleet — release-gated (published consumer).
- 🔵 **vrd divergence:** on `2.0.0` line using separately-named `hex-origins` — reconcile with the mainline or explicitly document as an intentional fork.

---

## Execution order

1. **D** — Nuxt auto-import + CI diff check. Otherwise A/B/C don't reach the Nuxt fleet.
2. **B** — Badge first, then Card/Icon/Input. Smallest, highest-frequency, mechanical once the prop API is set.
3. **A** — content-layer components. Biggest total payoff; CSS contract already exists.
4. **C / E / F** — cleanup in parallel. F's doc/dist fixes are quick and improve onboarding.

## Impact summary

One library pass deletes: 3 duplicated components ×7 sites, ~142
hand-rolled attributes ×6-7 sites, ~40 `text-[10px]`, 15 `grid-cols-[…]`,
19 inline styles, the `!important` trio, QuizSort's 3 badge components +
~24 pills, and Obelisk's `ensure-hex.mjs` — none of it touched site-side.
