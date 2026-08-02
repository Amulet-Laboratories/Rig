# Library Pass — Status

> **Rewritten 2026-08-02** against the actual state of the fleet. The original
> plan was drafted 2026-07-14 and its central mechanism has since been
> overtaken by events — see below. Everything it recorded as landed is
> preserved; everything it recorded as blocked has been re-checked rather than
> carried forward on trust. Fleet-wide sibling to Obelisk's
> [RIG-PASS-PLAN.md](../../Obelisk/docs/RIG-PASS-PLAN.md), which covers a
> single consumer.

A pass over `@amulet-laboratories/rig` to close the gap between what the
library ships and what consumers actually need. Every item is an **upstream**
fix — a missing component, prop, variant, or CSS hook — chosen so it deletes
hand-rolled one-offs across many sites at once, rather than patching each site.

## Guiding principle

From `CLAUDE.md`: if a consumer needs `style=`, arbitrary Tailwind
(`text-[10px]`, `grid-cols-[…]`), or a hand-rolled duplicate to use a rig
component correctly, the component is **missing a prop, variant, slot, or
sibling component**. Fix it here, not in the site.

---

## The premise that expired

The original plan was organised around a release gate:

> Consumer cleanup is **blocked on releasing** rig 0.6.0 / hex 0.6.x /
> rig-nuxt 0.5.0 and each site bumping to it. Do not touch those repos until
> then.

**That gate opened on 2026-07-28 and nobody walked through it.** Rig is at
3.2.0, hex is folded into rig and frozen at 0.8.0, rig-nuxt is at 1.1.0.

Verified 2026-08-02 — every consumer is already on the current line:

| Consumer                                                                      | rig      | rig-nuxt |
| ----------------------------------------------------------------------------- | -------- | -------- |
| Beanwoven, FewerSerums, Meepleloft, OneGoodLamp, TheScruffGuide, TheShelfNook | `^3.2.0` | `^1.1.0` |
| QuizSort                                                                      | `^3.2.0` | `^1.1.0` |
| AmuletLabs.org                                                                | `^3.2.0` | —        |
| Obelisk                                                                       | `^3.2.0` | —        |

So the plan's **"version skew — bring AmuletLabs.org up to fleet"** item is
closed: the fleet is uniform. The library work is done and published. What did
not happen is the **consumer-side cleanup the whole pass existed to enable.**

That is the finding worth acting on. Not "what else should Rig grow" — the
library grew everything it promised — but "why did nine consumers never collect
the benefit."

---

## Library side — landed

Kept from the original plan; these shipped and are live on npm.

- **Workstream A** — the content/affiliate layer is componentised. `rig-nuxt`
  ships **24** content components (`QuickAnswer`, `FaqBlock`,
  `ProductCardWrapper`, `CategoryIcon`, `ArticleHeader`, `TableOfContents`,
  the network/related/quiz set, …).
- **Workstream B** — primitive prop gaps closed: `Badge`/`Button`/`Input`/
  `Select` size scales, `Card` `selected`/`layout`/`columns`, `Icon`
  `tone`/`color`, `SectionDivider` `fill`/`bg`, `FlankedHeading` `color`.
- **Workstream D** — Nuxt module drift fixed; auto-imports derive from the
  generated `/manifest` export, pinned by a CI drift guard.
- **Workstream E** — internal loose ends. `useZoom` lifecycle guard, `Transfer`
  tests, and as of 2026-08-02 the last three untested components
  (`SplitEditorArea`, `CrashScreen`, `MapPlaceholder`) have coverage.
  **No component in the library is untested.**
- **Workstream F** — hex `prepare` hook, hex docs rewrite, changelog hygiene.

---

## Consumer side — the actual remaining work

### 1. Shadow components in six sites ⬜ **the one concrete defect**

Each of the six affiliate sites still carries its own
`components/content/QuickAnswer.vue` and `components/content/FaqBlock.vue`.
Nuxt resolves a site's `components/` directory **ahead of** a layer's, so these
shadow the library versions completely.

They are not merely duplicates — they are the **superseded** versions. The
library's `QuickAnswer` carries this comment:

> Visual treatment lives entirely in Hex (`data-rig-callout*`) + Rig's
> structural styles — no per-site CSS. This replaces the hand-rolled
> `components/content/QuickAnswer.vue` that shipped a `<style scoped>` block to
> compensate for Hex not styling the callout.

The site copies are exactly that hand-rolled version: `<style scoped>` blocks,
`class="quick-answer"` / `qa-label` / `qa-body` instead of the
`data-rig-callout` contract, and no `tone` prop. **The 0.6.0 fix has never
reached a single live site.**

Exact scope — 12 files:

```
{Beanwoven,FewerSerums,Meepleloft,OneGoodLamp,TheScruffGuide,TheShelfNook}.com/
  components/content/QuickAnswer.vue   ← delete
  components/content/FaqBlock.vue      ← delete
  components/content/CategoryIcon.vue  ← KEEP
```

**`CategoryIcon` is not a shadow copy** — it diverges 351–447 lines per site
because each site maps its own categories to its own icons. It is legitimately
site-owned; the original instruction to delete it fleet-wide was wrong.

This is a **rendering change**, not a pure deletion: both the DOM contract and
the styling source change. It needs a per-site preview check, so it belongs in
its own focused pass rather than bundled into unrelated work. QuizSort carries
no local content components and is unaffected.

### 2. Residual arbitrary Tailwind ⬜ small

Verified by grep for `text-[Npx]` / `grid-cols-[…]`:

| Site           | Files |
| -------------- | ----- |
| QuizSort       | 4     |
| AmuletLabs.org | 1     |
| all six others | 0     |

The six affiliate sites are clean. Only QuizSort and AmuletLabs have anything
left, and both are SPA/quiz-specific rather than content-layer.

### 3. Open decisions 🔵

- **QuizSort's `citron` theme doesn't import Hex `content.css`**, so the
  content skin doesn't reach it. Confirm whether it needs it.
- **`vrd` divergence** — on the GitHub Packages `2.x` line with separately
  named `hex-origins`. Reconcile with the mainline, or document it as an
  intentional fork and stop counting it as skew.
- **FAQ pattern** — ship a dedicated `Faq`/`FaqList`, or treat `FaqBlock` +
  `Accordion` as the documented answer and close the question. `FaqBlock`
  shipping in rig-nuxt arguably settled this by default already.

---

## What this pass is really waiting on

Nothing in the library. The remaining work is twelve file deletions and three
decisions, and the only reason it hasn't happened is that the release gate
opened quietly and no one re-read the plan afterwards.

If that pattern is worth fixing rather than just this instance of it: each
blocked item should record **what would make it unblocked** — a version, a tag,
a command that answers it — so a gate opening is something you can check for
rather than something you have to remember.
