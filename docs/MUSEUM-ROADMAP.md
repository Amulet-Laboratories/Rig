# The Museum of User Interfaces — Roadmap

An exhibit built on Hexrig where visitors **operate** historical interfaces rather than
look at screenshots of them. Every era renders from the same unmodified Rig components;
only the Hex layer changes.

Status: **Roster complete.** Phases 1–4 done and rendering at `/hexrig/demos/museum`.
**All eight eras ship**, each with a period typeface. Started 2026-08-02.

**The Phase 2 gate passed.** Redmond '95 and Cupertino '84 both reach their look with a
`tokens.css` and nothing else — no era owns a single hand-written component rule, and
`ExhibitWindow.vue` contains no conditional on era id. Two structurally opposite traditions
(four-tone sculpted bevel vs. one-bit outline-and-invert) came out of one vocabulary.

All six rooms are still pure token files — **no era owns a single hand-written
component rule.** Terminal '93 was the hardest test and the most informative: a vocabulary
built for bevels and drop shadows also expresses an interface that has neither, by setting
every composed surface to a no-op and letting colour carry all the depth.

Cube '91 and Glass '07 closed the roster and each demanded exactly one addition,
which is the vocabulary behaving as designed rather than being patched:

- **Cube '91** needed both scroll arrows grouped at one end of the bar — NeXTSTEP's
  signature, and structure rather than paint. `ScrollArea` grew a `stepperPlacement`
  prop for it. This is the composition boundary working: an era could not be reached
  by styling, so the fix went into the library, not into the era.
- **Glass '07** needed `backdrop-filter`. Translucency is the one property in the whole
  collection that cannot be faked with borders and gradients, so it became a token pair
  (`--m-backdrop-window`, `--m-backdrop-menu`) applied to exactly two surfaces.

Next: Phase 5 polish. Outstanding items are in §11.

---

## 1. What it is

Two viewing modes, mirroring how real museums actually work:

| Mode              | Museum analogue                        | Implementation                                                      |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------- |
| **Period room**   | A recreated 1890s parlor you walk into | The whole exhibit pane re-skins to one era. Inhabited, operable.    |
| **Specimen case** | A vitrine of forty beetles under glass | One widget rendered across _all_ eras simultaneously, side by side. |

The specimen case is the reason era styling **must be scoped** rather than global — several
eras render on one page at once. See §4.

### The framing rule

The museum's own chrome — era picker, wall text, navigation — stays in a modern theme at
all times. Only the _exhibit pane_ becomes historical. Modern lighting and labels around
old objects.

This is a structural rule, not decoration. It means the exhibit is free to be as
period-accurate as it can be without the surrounding app inheriting the consequences.

### Authenticity over modern convention

The exhibit is a reconstruction. Where period accuracy conflicts with modern UI convention
— contrast ratios, hit-target sizes, motion norms — **accuracy wins inside the exhibit
pane.** A Windows 95 disabled label is supposed to be illegible embossed gray; that is the
artifact, and softening it would be a worse reconstruction.

Rig's keyboard navigation, focus management and ARIA come from the components and are left
intact — not as a compromise, but because there is no authenticity reason to tear them out
and they cost nothing. The paint changes; the machinery underneath doesn't.

### Naming and provenance

Eras are named descriptively — _Redmond '95_, _Cupertino '84_, _Cube '91_ — never by product
name, never with logos or original artwork. These are interpretations of design _ideas_,
presented as such. This is both the more tasteful posture and the safer one on trade dress.

Fonts are the hard constraint: Chicago, MS Sans Serif, Geneva and Lucida Grande are all
licensed and cannot ship. Each era uses a legally clear lookalike, tracked in the font
provenance table (§7). Fidelity is capped by what's available, and the honest word for the
result is **evocation, not replica**.

---

## 2. What Rig already gives us

Verified against the codebase on 2026-08-02. More than expected:

- **Window-manager kit** — `TitleBar` (with `leading`/`caption`/`trailing` slots, enough to
  put a close box on the left for Mac or a control cluster on the right for Windows using
  only CSS `order`), `Modal`, `Panel`, `Drawer`, `ShellGrid`, `SplitView`, `ResizablePanel`
- **`ScrollArea` renders its own track and thumb** rather than a native scrollbar. Scrollbars
  are the most era-defining element in any UI and native ones are barely styleable. This
  single fact is most of why the project is viable.
- **`FileBrowser`** — the canonical era-defining app archetype, already a component
- **`CrashScreen`** — a gift. Every era's failure mode is an exhibit in its own right.
- `Menubar`, `MenuList`, `ContextMenu`, `StatusBar`, `ActionBar`, `SettingsView`, `TreeView`,
  `Table`, `List`, and the full form-control set (`Checkbox`, `RadioGroup`, `Select`,
  `Slider`, `Switch`, `Input`, `Progress`)

**148 components across 12 packages.** The exhibit app is largely pre-built.

---

## 3. The gap — materials, not just palette

Hex's theme token API is _color + type + radius_. Scanning any theme's `tokens.css`: 22
colors, font families, sizes, weights, tracking, leading, one `--radius`.

There is no themeable vocabulary for:

- **Bevels** — multi-edge borders (light top-left, dark bottom-right) are the entire visual
  language of 1985–2000
- **Elevation** — shadows exist in `base.css` but aren't tokens, so a theme can't set them
- **Density** — 90s UIs are tight, flat-era UIs are airy; no spacing scale to swap
- **Motion** — pre-2001 means _zero_ animation, which must be actively asserted
- **Texture** — gradients, pinstripes, gloss, dither
- **Control geometry** — a Win95 checkbox is a 13px square; an Aqua one is a rounded gel capsule

This is why the 27 existing themes, for all their range, are all recognizably the same
modern UI in different colors. They vary the paint, not the material.

**The museum's deliverable to the library is a second token axis.** Strictly additive, every
token consumed with a fallback (`var(--bevel-width, 0px)`), so all 27 existing themes are
byte-for-byte unaffected.

### The composition boundary, under pressure

Shared Rig components + per-era CSS + a thin per-era _layout arrangement_. An era may
rearrange composition — Mac hangs the menu bar off the top of the screen, Windows puts it
inside the window — but **no era may modify a Rig component's internals.**

Where an era can't be reached without editing component markup, that's a missing prop or
slot, and the fix goes back into the library. That's Rig's existing composition boundary,
just tested far harder than 27 palette swaps ever tested it.

---

## 4. Architecture

Eras are structurally different from the 27 palette themes, so they get their own namespace
rather than being mixed into `themes/`:

```
hex/src/
  materials.css              the new material token layer + defaults
  eras/
    _shared/
      chrome.css             cross-era structural scaffolding
    redmond95/
      tokens.css             palette + material tokens, scoped
      chrome.css             era component overrides, scoped
      index.css              entry
    cupertino84/
    ...
```

- Era styling is scoped to **`[data-hex-era="name"]`**, distinct from the existing
  `[data-hex-theme]` used by the demos. Mandatory for the specimen case.
- Built to `dist/eras/{name}.css`, plus a combined `dist/eras.css` for multi-era pages.
- The 27 themes and their `build.mjs` `themes` array are **not touched**.

Most of an era's look should come from **tokens**; `chrome.css` handles only what tokens
can't express. If an era's `chrome.css` is large, that's a signal the material vocabulary is
missing something — fix the vocabulary, not the era.

---

## 5. Library changes required

Tracked as real library work, useful beyond the museum:

### Rig

1. **`ScrollArea`** — currently has a track and thumb but the thumb **isn't draggable**
   (keyboard only), there are no stepper buttons, and clicking the track does nothing.
   Every era from 1984 to 2001 has arrow buttons, and drag-the-thumb is table stakes.
   Add: pointer drag, optional `steppers` prop, track-click paging.
   _This is a straight bug-and-gap fix that every consumer benefits from._
2. **`TitleBar`** — verify `leading`/`trailing` are enough for both button conventions.
   Likely fine; confirm under load.
3. Any component that turns out to bake in era-specific structure — discovered in Phase 2,
   fixed as found.

### Hex

1. `materials.css` — the material token layer (§3)
2. Era build pipeline in `build.mjs` (§4)
3. Shared component CSS taught to consume material tokens with fallbacks

---

## 6. Era roster

Ten was the ceiling; **all eight ship**. Ordered chronologically, as the museum presents them.

| Era               | Year | Status | Why it's in the collection                                                                |
| ----------------- | ---- | ------ | ----------------------------------------------------------------------------------------- |
| **Cupertino '84** | 1984 | ✅     | 1-bit, close box left, dithered desktop. Maximum contrast with Redmond.                   |
| **Cube '91**      | 1991 | ✅     | NeXTSTEP. Greyscale, sculptural, scroll knobs. Hugely influential, almost never imitated. |
| **Terminal '93**  | 1993 | ✅     | 80 columns, cyan on blue. Proves the token layer survives a non-GUI.                      |
| **Redmond '95**   | 1995 | ✅     | The canonical bevel. The most legible UI language ever made.                              |
| **Bondi '01**     | 2001 | ✅     | Aqua. Pinstripes, gel, the first blurred shadow in the collection.                        |
| **Glass '07**     | 2007 | ✅     | Aero. Translucency and blur — `backdrop-filter` finally justified.                        |
| **Flat '13**      | 2013 | ✅     | The great flattening. Hairlines, big type, no shadows.                                    |
| **Soft '25**      | 2025 | ✅     | Big radii, soft shadows, dark by default, spring motion.                                  |

`Soft '25` is the intellectual payoff: presenting the _current_ style as just another period
style. A visitor arrives assuming today's UI is neutral and correct; the museum quietly makes
the case that it's a fashion like all the others.

### On "era and style"

Two axes is the right instinct, but a full matrix is a combinatorial trap — 10 eras × 3
styles is 30 hand-tuned themes. Treated as a **curated grid**: eras are the spine, and a
style axis appears only where history offers one. 1995 genuinely had three competing looks
(Redmond bevel, Motif/Unix, Mac 7.5); 2013 had essentially one. Symmetry is not forced.

---

## 7. Font provenance

Every era needs a legally clear face. Tracked here because fidelity is capped by it.

All shipped faces are SIL Open Font License 1.1, sourced from Google Fonts and vendored
under `demos/public/fonts/` (68 KB total). Designer names verified against each family's
`METADATA.pb` rather than taken from memory.

| Era           | Original       | Shipping   | Designer            | License |
| ------------- | -------------- | ---------- | ------------------- | ------- |
| Cupertino '84 | Chicago        | Silkscreen | Jason Kottke        | OFL 1.1 |
| Cube '91      | Helvetica      | Inter      | Rasmus Andersson    | OFL 1.1 |
| Terminal '93  | DEC VT320      | VT323      | Peter Hull          | OFL 1.1 |
| Redmond '95   | MS Sans Serif  | Jersey 10  | Sarah Cadigan-Fried | OFL 1.1 |
| Bondi '01     | Lucida Grande  | Inter      | "                   | OFL 1.1 |
| Glass '07     | Segoe UI       | Inter      | "                   | OFL 1.1 |
| Flat '13      | Helvetica Neue | Inter      | "                   | OFL 1.1 |
| Soft '25      | System stacks  | Inter      | "                   | OFL 1.1 |

**Pixelify Sans was tried for Redmond '95 and rejected**: its numerals are unreadable — 5
and 2 both render as S — at every size from 11 to 20px, verified by rendering a size ladder.
A face whose digits can't be read is _less_ faithful than a plainer one, because MS Sans
Serif was crisp. Jersey 10 replaced it: condensed, proportional, true lowercase, legible
figures.

Silkscreen has no true lowercase, which is wrong for Chicago and is the one knowing
compromise in the set — it reads convincingly as a 1-bit system face, and nothing freely
licensed is closer.

That the five most recent rooms share one typeface is itself an exhibit: type stopped
being era-distinguishing once every platform shipped a neutral grotesque.

Attribution surface lives in the museum's colophon.

---

## 8. Exhibit content

Every era renders the **same canonical app**, or comparison is meaningless.

**Primary exhibit: a file browser.** The most era-defining archetype there is, and it
exercises window chrome, lists, trees, icons, toolbar, status bar, scrollbars, selection and
dialogs at once. Rig's `FileBrowser` is the starting point.

**Secondary: a control panel dialog**, reachable from within the browser — covers the form
widgets that are the most era-legible parts of any UI.

**What you browse is the museum's own collection notes.** Self-referential, and it means real
content exists without inventing filler.

---

## 9. Phases

- **Phase 0 — Spikes.** Bevel-in-pure-CSS on an unmodified Rig `Button`; pixel-font rendering
  fidelity. _Folded into Phase 1 — the bevel question resolved on inspection (composable
  `box-shadow: inset` layering), and font fidelity is better tested against a real era than
  in isolation._
- **Phase 1 — Foundations.** ✅ Material token layer, era build pipeline, `ScrollArea` upgrade.
- **Phase 2 — Two eras end to end.** ✅ Redmond '95 + Cupertino '84. **Gate passed.**
- **Phase 3 — The museum shell.** ✅ Era picker, period room, specimen case, wall text.
- **Phase 4 — Roster to eight.** ✅ All eight.
- **Phase 5 — Polish.** Era cursors (cheap, enormous payoff), motion rules including
  outline-only window drag for the 90s, optional sound muted by default.

Everything before the Phase 2 gate is cheap. Everything after it is volume.

---

## 10. Where it lives

Inside `Rig/`, using the `demos/` app's infrastructure — scoped themes, self-hosted font
pipeline, offline Iconify bundle, assembly through `scripts/build-deploy.mjs` — but as its
own section at `demos/src/pages/museum/`, not a 14th fictional business.

The 13 demos are a specific genre: example sites for fictional companies. The museum isn't
one of them. It's the _argument for_ the library rather than an example of it.

Note the demos app hard-codes font URLs to `/hexrig/demos/fonts/`, so era fonts follow that
convention.

---

## 11. What building it taught — and what's outstanding

Recorded so Phase 4 starts from fact rather than from §3's original guesses.

### The vocabulary the eras forced

Two additions the plan didn't anticipate, both discovered by an era failing to reach its
look. In each case the fix went into the engine, not the era — which is the loop working:

1. **`--m-pressed-bg` / `--m-pressed-fg`.** A four-tone bevel deepens under a press. A 1-bit
   interface has no shadow to deepen, so it _inverts_. Two structurally different behaviours,
   now one pair of tokens.
2. **`--m-titlebar-caption-bg` / `--m-titlebar-caption-pad`.** The 1-bit Mac title bar is
   horizontal stripes with a white gap knocked out behind the text. The caption needed its own
   background to knock out with — and it takes no extra markup, because `TitleBar` already
   renders the caption as its own element.

### A correctness rule for the token layer

**Never declare a default for a token that the engine reads with a fallback.** A CSS fallback
only fires when the property is entirely undefined, so declaring `--m-texture-face: none`
resolves to `none` and destroys the face colour instead of falling through to it. Half of
`materials.css` is therefore documentation of deliberately-unset tokens. This bit once and
would bite again.

### Rig changes made

- **`ScrollArea`** — the thumb was not draggable at all (keyboard only), there were no
  steppers, and clicking the trough did nothing. Now: pointer drag with capture, optional
  `steppers` with auto-repeat, trough paging, `step` prop, and per-direction glyph slots.
  A `[data-rig-scroll-track]` wrapper was added between bar and thumb; the existing thumb
  rules are descendant selectors so all 27 themes are unaffected, and with steppers off the
  track fills the bar exactly as before. 39 tests, up from 32.
- **`src/styles/layout.css`** — scaffold for the track and stepper parts.
- Nothing else. `TitleBar`'s three-zone split was sufficient for both button conventions, as
  predicted.

### Bugs the extra eras exposed

Each was invisible until an era needed the behaviour, and each was fixed in the engine:

- **`box-shadow: none` inside a composed list.** `var(--m-raised), var(--m-elevation-window)`
  is invalid the moment either resolves to `none`, and the _whole_ declaration is dropped —
  silently taking the bevel with it. The empty value is `0 0 transparent`.
- **`background` then `background-image`.** Setting the progress fill via the shorthand and
  the segment pattern via `background-image` meant any era _without_ segments wiped its own
  gradient back to `none`. Now one declaration: segments if defined, else fill.
- **`background-color` cannot take a gradient.** Bondi's checked checkbox silently stayed
  white. Recorded in `materials.css` next to the token.
- **`margin-left: auto` beats `order`.** The Macintosh convention — window controls on the
  left — did not actually work at first: `TitleBar`'s scaffold pins the trailing cluster
  right with an auto margin, which no amount of `order` can override. The era layer now
  zeroes those margins and lets `justify-content: space-between` place the clusters, which
  works because the caption is absolutely positioned and out of the flex line.

The pattern is consistent: every one is a place where CSS _silently drops_ an invalid
declaration rather than erroring. A token layer that composes values into shorthand
properties will keep meeting this, so **check the rendered result, never just the build.**

### Outstanding

- The demos gallery has no link to the museum; it is reachable only by URL.
- `pnpm check` fails at the repo root with ~1346 pre-existing lint errors, unrelated to this
  work and present on a clean tree. Museum files lint clean.
- Phase 5 polish untouched: era cursors, outline-only window drag, sound.
- Slider tracks read faintly in the two eras that draw them at 1–4px on a light ground
  (Cupertino '84, Flat '13). Accurate, but close to invisible in the specimen case.
- The exhibit is one window. `CrashScreen` is still unused, and every era's failure mode
  would make a strong second exhibit.
