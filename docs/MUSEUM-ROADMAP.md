# The Museum of User Interfaces — Roadmap

An exhibit built on Hexrig where visitors **operate** historical interfaces rather than
look at screenshots of them. Every era renders from the same unmodified Rig components;
only the Hex layer changes.

Status: **Roster complete, Phases 1–5 done** and rendering at `/hexrig/demos/museum`.
**All eight eras ship**, each with a period typeface. Started 2026-08-02.

**Scope decision 2026-08-03: the museum expands.** A hardware layer around the existing
rooms (§12), then three wings and a cross-cutting instrument (§13). Sequencing and the
explicit do-not-build list are in §14.

**Phases 6 and 6b are built** — all eight machines, the bezel case, the movable gallery light
and a working power switch render at `/hexrig/demos/museum` on `feat/museum-hardware`. What
shipped and what it cost are at the end of §12 and §15. Phase 7 (The Scale) onward is not
started.

**A provenance layer landed 2026-08-03.** Every room now states what it interprets, with
researched and cited dates for the system, the object and the accessories. The naming rule is
clarified in §1: descriptive on the artifact, specific in the scholarship. The same record
shape carries into Wings II and III.

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

Phase 5 polish landed too — era cursors, outline-only window drag, optional sound. Remaining
items from that phase are in §11; everything new is in §12–§14.

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

### The rule applies to the artifact, not to the scholarship

**Clarified 2026-08-03, and it is a clarification rather than a reversal.** §7 has named
Chicago, Helvetica, Segoe UI and Lucida Grande since the day it was written, and `eras.ts`
has carried `typeface: 'MS Sans Serif — shipping as Jersey 10'` for just as long. Naming a
real thing in provenance was always part of this project; only the generalisation is new.

So the rule now reads on two levels:

- **The artifact stays descriptive.** Display names, the silkscreened plate, the keycaps —
  anything a visitor reads _inside_ the exhibit. A product name there asserts that the
  reconstruction _is_ the product, which is not a legal worry so much as a **false claim**:
  the room ships Jersey 10, not MS Sans Serif, and reproduces no icon. Calling it "Windows 95"
  would state something the room cannot deliver. Enforced by test.
- **Provenance names the source, with dates and citations.** An interpretation with no stated
  source is just a vibe. Every room now carries a `provenance` record: what it interprets and
  when that shipped, the object it is drawn from, the accessories worth dating and why, what
  was substituted, and the URLs the dates came from.

Still forbidden everywhere, unchanged: logos, wordmark artwork, original icon bitmaps, system
sounds, licensed fonts, and any silhouette distinctive enough to name a specific product.

**Dates are researched, never recalled.** A wall label renders them as fact, and a
misremembered date is the failure mode that looks completely fine and is completely wrong.
Tests assert that every room cites at least one `https://` source and that no date field is
blank — they cannot check that a date is _correct_, which is exactly why the citation has to
be there for a reader to check instead.

Two facts the research turned up that the museum could not have asserted before, and both
now explain an object a visitor can see:

- **The scroll wheel postdates Windows 95.** The Microsoft IntelliMouse was announced 22 July
  1996 and shipped that November — eleven months after the operating system in Redmond '95.
  That room's mouse has no wheel because in 1995 there wasn't one.
- **The third modifier predates it.** The Microsoft Natural Keyboard went on sale in October
  1994 carrying two new keys between Ctrl and Alt — a year before the system they were made
  for. That is the room where the modifier strip goes from two caps to three.

The same record shape serves Wings II and III unchanged: a phone and a console each interpret
something, run on an object, and ship an accessory worth dating.

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
- **Phase 5 — Polish.** ✅ Era cursors, outline-only window drag, optional sound.

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

- ✅ Linked from the demos gallery and the Hexrig landing nav.
- `pnpm check` fails at the repo root with ~1346 pre-existing lint errors, unrelated to this
  work and present on a clean tree. Museum files lint clean.
- ✅ Phase 5 landed. Era cursors are 1-bit SVG pointers with explicit hotspots (an
  arrow whose point isn't at `0 0` feels wrong in a way people notice without
  naming it). Windows built before compositing drag a wireframe outline and jump
  on release — `rubberBandDrag` on the era record, because whether a period could
  afford live redraw is a fact about the era, not about the component. Sound is
  synthesised from oscillators and noise at runtime: no recording of any real
  system ships, and a square wave at 1000 Hz is closer to what a 1984 machine
  produced than a sample of one would be. Muted by default.
- Slider tracks read faintly in the two eras that draw them at 1–4px on a light ground
  (Cupertino '84, Flat '13). Accurate, but close to invisible in the specimen case.
- The exhibit is one window. `CrashScreen` is still unused, and every era's failure mode
  would make a strong second exhibit.

---

## 12. The hardware layer

The museum exhibits the software with the machine cropped out. The hardware layer puts the
object back, and it earns its place by carrying a **second thesis, not more decoration**:

> **Across forty years the machine receded.** The bezel goes from 40px of beige around a
> nine-inch tube to 4px of nothing. The pointing device goes from one button to two to three
> to none. The cable disappears. By 2025 the object _is_ the image.

That is the same shape as the argument the collection already makes about typefaces
converging (§7) — a fact about the whole roster that no single room can state.

A spike of all eight objects exists and renders:
<https://claude.ai/code/artifact/7feda279-ee46-4794-b855-cc02ba631e29>

### The framing rule, split rather than broken

§1 says the museum's own chrome stays modern. A period bezel looks like it breaks that. It
doesn't — it splits the rule in two:

- **The institution is modern.** Signage-grotesque labels, accession numbers, tombstone
  captions, a plinth under even light.
- **The artifact is period.** The machine, and the software inside it.

Diegetic UI, but diegetic to _the museum_ — not to 1995. Which is why there is no wood-grain
desk, no CRT filter over the page, and no period chrome in the navigation. A gallery that
cosplays its own collection has stopped being a gallery. It also means **the objects do not
retheme** when the surrounding page changes theme: an artifact is not a colour scheme.

### The token axis

A `hex/src/hardware.css` alongside `materials.css`: strictly additive, consumed only by
`eras/`, every token read through a fallback so the 27 palette themes stay byte-for-byte
unaffected. **The correctness rule from §11 applies unchanged** — never declare a default for
a token the engine reads with a fallback.

| Token                                           | Range across the collection            | What it encodes                                                          |
| ----------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `--h-pad`                                       | 40px → 4px                             | Bezel thickness. The spine of the whole argument.                        |
| `--h-chin`                                      | 66px → 12px                            | Where badges, indicators and dials live. Empties out over time.          |
| `--h-aspect`                                    | 1.5 → 4:3 → 16:10 → 16:9               | Screen shape. Constrains how wide the exhibit window can be.             |
| `--h-aperture`                                  | 26px → 1px                             | Corner radius of the glass. A deep-set tube is round; a panel is square. |
| `--h-scan` / `--h-vignette`                     | 0.16 → 0                               | Raster and tube falloff. Both hit zero the year the CRT does.            |
| `--h-glare`                                     | 0.07 → 0.30                            | Reflection. Peaks in 2001–2007, not at either end — gloss is a period.   |
| `--h-led` / `--h-led-op`                        | absent → green → amber → blue → absent | Indicator. Its disappearance is as era-defining as its colour.           |
| `--h-split-op` / `--h-seam-op` / `--h-wheel-op` | 1/0/0 → 0/0/0                          | Button topography as data, so no era branches on button count.           |
| `--h-cable-op`                                  | 1 → 0                                  | One token, one line of the thesis.                                       |

**The gate is the same as Phase 2's.** One `ExhibitHardware.vue`, zero conditionals on era id,
every object reached from a token block. If an object can't be reached that way, the
vocabulary is missing something — grow `hardware.css`, not the era.

### The cheapest exhibit in the building

**The bezel case.** Eight frames, no content, no fonts, no sound, no live components — the
`--h-*` blocks and nothing else. It makes the entire thesis in one glance and costs almost
nothing. If only one piece of §12 gets built, build this.

### Interactions worth having

- **The power control actually powers the exhibit.** The single highest-value item here: it
  turns the bezel from a picture into UI. Screen collapses to a white line, thump, dark — and
  the wall text stays lit, because the label belongs to the institution, not the machine. It
  also gives the synthesised-sound work (§11) somewhere to land that isn't a click.
- **The brightness and contrast dials on 1984 and 1993 work**, as a real filter over the
  exhibit pane. **Clamp the range.** §1 says accuracy wins inside the exhibit, but a dial that
  lets a visitor make the room permanently illegible is a bug, not a reconstruction.
- **A keyboard is the cheaper second peripheral** — not a full board, a modifier strip. The
  keys left of the space bar are genuinely era-defining, and the arrival of a third modifier
  in 1995 is a one-line exhibit. Six keycaps, not 104.

### Risks

- **Trade dress, and it is sharper here than for software.** A famous bezel is far more
  recognisable, and far more protected, than a bevel style. The §1 naming rule has to extend
  to objects explicitly: descriptive plates only, no nameable silhouette, no badge resembling
  a mark. Every object is a _typical_ machine of its period.
- **This becomes retrowave.** Scanlines and curvature are one bad decision from a cheap
  filter. The discipline: effects live on the glass, never on the page; no barrel distortion;
  no chromatic aberration; a plinth, not a bedroom desk. The effect layer needs an off switch
  next to the sound toggle, because it sits over live text.
- **Small screens are real work, not a media query.** 40px of bezel around a 200px window at
  375px is a joke at the visitor's expense. Below the breakpoint the object steps back to the
  bezel-strip treatment and hands the exhibit its full width. **Still outstanding** — see
  below.

### What shipped — Phase 6, 2026-08-03

On `feat/museum-hardware`, branched from `develop`:

| File                                         | What it is                                                   |
| -------------------------------------------- | ------------------------------------------------------------ |
| `hex/src/hardware.css`                       | The `--h-*` axis: defaults, plus the deliberately-unset list |
| `hex/src/eras/<id>/hardware.css` × 8         | Each era's machine, as data                                  |
| `demos/src/pages/museum/hardware.css`        | The drawing layer — no era named anywhere in it              |
| `demos/src/pages/museum/ExhibitHardware.vue` | The object; takes an era only to read plate text off it      |
| `demos/src/pages/museum/museum.test.ts`      | The contracts, as 16 tests                                   |

**The gate holds and is now enforced rather than asserted.** `museum.test.ts` fails if any
file in the drawing layer — `ExhibitWindow.vue`, `ExhibitHardware.vue`, `hardware.css`,
`museum.css`, or the era engine — so much as contains an era id. Verified by injecting a
`[data-hex-era='redmond95']` rule and watching it go red. It also pins `machine.bezel` in
`eras.ts` to `--h-pad` in each era's token file, because those are the same fact written
twice and the bezel ladder is the whole argument.

`vitest.config.ts` grew a `demos/src/**/*.test.ts` glob so the museum is testable at all.

**Verified by measurement, not by eye:** `--h-pad` reads 30 → 24 → 40 → 30 → 26 → 15 → 8 → 4
in the browser, aspect goes 1.5 → 4:3 → 16:10 → 16:9, the pointing device is absent in exactly
one era and the indicator in exactly three. Zero `--h-*` tokens leak into any of the 27
palette bundles, so the additive claim holds.

### Three defects that only appeared once it ran

All three are the same species as §11's collection — CSS doing something reasonable and
silent rather than erroring:

1. **The glass became a query container.** Giving `[data-museum-screen]` a
   `container-type: inline-size` put a 517px tube inside museum.css's
   `@container (max-width: 560px)` rule — written for a narrow _viewport_ — and folded the
   exhibit into a single column in every era. Nothing errored; the room just quietly looked
   wrong. The room stays the container: a tube is not a phone.
2. **The gallery inherited the era's desktop.** `[data-hex-era]` sets
   `background: var(--m-texture-desktop, …)`, which was right when the window sat directly on
   the desktop and became wrong the moment the desktop moved inside the tube — a teal 1995
   desktop behind a 1995 monitor. Fixed with a 0,2,0 selector, no `!important`.
3. **The later eras need 60% more room than the earlier ones.** Soft '25 wants 570px of
   exhibit height where Cupertino '84 wants 358, because generous spacing is that era's actual
   argument. Guessing scene widths clipped the OK button in three rooms; they are now measured.
   A `min-height: 0; overflow-y: auto` safety valve on the inspector keeps narrow viewports
   from silently eating a control.

### Interactions — built 2026-08-03

- ✅ **The power control works.** A real `<button>` on the chin: focusable, named, keyboard
  operable. Powering down collapses the image to a horizontal line, shrinks the line to a
  point and leaves an unlit tube — and takes the indicator out with it, which is the whole
  reason an indicator existed. The exhibit is `visibility: hidden` while off, so it leaves the
  tab order and the accessibility tree rather than lurking under an opaque overlay. Verified:
  exhibit `visible → hidden`, LED `1 → 0`, glass `0 → 1`.
  - The unlit tube is an **opaque overlay, not a `filter`**. A filter on the screen would
    create a containing block around the exhibit, which §15 forbids for exactly the reason it
    matters here: what is behind the glass has to stay real rather than become an image.
  - `useEraSound` grew a `power` tone — a degaussing thump, a low sine sliding 120 Hz → 38 Hz
    with a noise transient. Still synthesised, still muted by default, still no recording of
    any real machine.
- ✅ **The keyboard shipped** as a modifier strip, six caps at most. The count is the exhibit:
  **two keys left of the space bar until 1995, three from then on, and never back down.**
  Pinned by a test, because three caps still look fine when they are wrong. The legends are
  generic glyphs — a modifier legend is a trade mark in at least two of these eras.
  It is also the only peripheral Terminal '93 has, which is where it earns its place most.
- ✅ **The small-screen step-back is built.** Below 640px of _container_ width — not viewport,
  so the rule holds wherever the room is embedded — the machine drops its chin, stand, deck and
  parting line, collapses to a 7px frame, and hands the exhibit full width and natural height.
  The aspect ratio goes too: honouring 4:3 on a phone wastes the only dimension it has. The
  object is still present and still the right colour; it has stopped pretending to be furniture
  on a plinth. Verified at 390px: no clipping, no horizontal page overflow.

### Still outstanding

- **The dials are still decorative, deliberately.** Making them work needs each dial to be a
  real control, and a dial sized to `0` by its era's tokens would be an invisible focusable
  button — removing it from the accessibility tree needs the component to know which era it is
  in, which is precisely the conditional the gate forbids. The honest options are a presence
  token the drawing layer can key `display` off, or moving brightness to the gallery bar
  alongside the light, where it arguably belongs anyway since it is a property of viewing
  conditions rather than of the object. Not resolved; not faked.
- **Rig's `Slider` cannot be associated with a visible `<label>`.** It puts the `id` on its
  wrapper element and the `<input type="range">` inside is anonymous, so `for` points at a
  non-labelable `div`. The museum works around it with `aria-label` and presentational text.
  A small, real library gap of the same family as the `ScrollArea` fix in §11 — worth an
  `inputId` prop or forwarding `id` to the input.

---

## 13. Three wings and an instrument

The expansion's failure mode is obvious and fatal: **a museum of everything has no thesis.**
So each wing gets exactly one sentence it exists to prove, and anything that doesn't serve
that sentence doesn't get built.

| Wing                         | Span      | The one sentence                                                                                |
| ---------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| **I — The Desk** _(built)_   | 1984–2025 | One component set, eight sets of materials — and across forty years the machine receded.        |
| **II — The Hand**            | 1999–2025 | The same forty-year argument run again in fifteen — and the phone is why the desktop flattened. |
| **III — The Room**           | 1985–2013 | Interfaces built with no pointer at all — and the one peripheral that never receded.            |
| **The Scale** _(instrument)_ | —         | Not a wing. A measuring room: every screen in the collection at true size and true density.     |

### Wing II — The Hand

Phones are not a sequel to the desk wing; they are a **parallel track**, and the wing should
be presented that way — two timelines aligned by year, so the compression is visible rather
than asserted.

Four things it proves that the desk wing cannot:

1. **Density is the hidden variable, and it explains Flat '13.** The desktop sat near 96dpi
   for twenty-five years. The phone went from roughly 120 to 460 in a decade. Hairlines,
   light weights and generous white space only became legible once pixels stopped being
   visible — so **Flat '13 is downstream of Retina '10**, and the flattening was not purely
   a fashion. This is a claim the museum can _demonstrate_ rather than assert (see The Scale),
   and it is the single most valuable thing in the expansion.
2. **The input method changed three times.** Keypad → stylus → finger → gesture. The
   desktop's never changed. Which makes **hit target** the phone wing's era-defining token
   the way the bevel is the desk wing's: a 1mm stylus tip, a 7mm finger, then a gesture area
   with no target at all.
3. **The scrollbar dies here.** Stylus '03 is the last touch device in the collection with
   one; momentum scrolling replaces it in 2007. A direct callback to the desk wing, where the
   scrollbar is the most era-defining element on screen (§2).
4. **Chrome moved into the app.** Menubar → nav bar → tab bar → nothing.

**Roster — five, not seven.**

| Era                | Year | Why it's in                                                                                                                                                                                       |
| ------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keypad '99**     | 1999 | 96×65 monochrome STN, five lines, T9. The **softkey** is the first widely-shipped adaptive control: two physical buttons whose labels live on screen.                                             |
| **Stylus '03**     | 2003 | 240×320 resistive. 1mm targets. The last touch device here with a scrollbar.                                                                                                                      |
| **Multitouch '07** | 2007 | 320×480 at 163ppi. Hit target jumps sevenfold, scrollbar dies, momentum arrives. Pairs with **Glass '07 — same year, opposite direction**: the desktop went translucent, the phone went physical. |
| **Retina '10**     | 2010 | 640×960 at 326ppi. The pivot the whole wing turns on.                                                                                                                                             |
| **Edge '19**       | 2019 | Bezel-less, notch, gesture bar. The last physical affordance leaves; safe area becomes mandatory.                                                                                                 |

Cut deliberately: **Material '14** (Flat '13 already carries the flattening) and a present-day
room (Soft '25 already carries it). The parallel-timeline framing is what lets the two wings
_share_ rooms instead of duplicating them.

### Wing III — The Room

This is the wing that could most easily be "more stuff." What earns it a place is that
**it is the rebuttal.**

Wing I's entire argument is that the machine receded — bezel 40→4, mouse buttons 1→0, cable
gone. **The controller did the opposite:** two inputs became seventeen, and it grew a second
analog stick, rumble, a touchpad, gyro and six-axis motion along the way. Put the mouse and
the controller in one vitrine and the thesis stops being a slogan and becomes an argument
with a counter-example. That alone is worth a wing.

Three more things only this wing can show:

- **No cursor.** Console UI is the only major tradition built entirely on a **focus model** —
  D-pad, focus ring, wrap-or-stop at the edges. This is the wing that stresses Rig's _focus
  machinery_ rather than its paint, which is a completely different axis of load than
  twenty-seven palette swaps or eight material swaps.
- **Ten feet.** Distance is the same variable as density: type size, hit target and contrast
  are all functions of _angular_ size, not pixels. The museum states this once and spends it
  in both Wing II and Wing III.
- **Overscan.** CRT televisions cropped roughly ten per cent of the image, so every console UI
  kept a title-safe margin — and the padding outlived the CRT by fifteen years. A toggle that
  draws the safe-area border on the '85 and '98 rooms is a strong, cheap exhibit.

**Roster — four.**

| Era               | Year | Why it's in                                                                                                                                                             |
| ----------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cartridge '85** | 1985 | 256×224, NTSC overscan. **No system UI at all** — the console had no interface outside the game. The exhibit is the absence, the same way Terminal '93's empty deck is. |
| **Disc '98**      | 1998 | The memory-card manager: the first console system UI most people ever operated. 640×480 interlaced, title-safe.                                                         |
| **Blade '05**     | 2005 | The horizontal rail. First HD console UI at 720p, and spatial navigation as the entire interaction model.                                                               |
| **Tile '13**      | 2013 | The grid dashboard at 1080p, set for ten feet. **Pairs with Flat '13 and Retina '10** — same flattening, four times the viewing distance.                               |

A present-day console room folds into Soft '25. In-game HUDs are out (§14).

### The Scale — the instrument

Not a wing and not a period room. A single measuring space, and the place where the wings'
shared claims get _shown_:

- **Every screen in the collection at true relative physical size and true pixel count**, on
  one drawing. Two numbers moving in opposite directions: diagonal grew roughly ninefold, the
  phone reversed it, and density is the variable nobody sees.
- **The density demonstration.** One Rig window rendered at 1× / 72dpi and at 3× / 460dpi, at
  true physical scale, side by side. This is the exhibit that proves Wing II's central claim,
  and no museum of interfaces has a good version of it.
- **"You are here."** Read `devicePixelRatio` and `screen.width`, and place the visitor's own
  display in the collection. Cheap, diegetic, and the moment the museum stops being about the
  past.

**Fidelity limit, stated rather than glossed:** browsers report CSS pixels, not physical
size, so true-scale rendering cannot be derived from the DOM. The honest options are to ask
the visitor for their diagonal, or to offer a physical calibrator (drag until the outline
matches a credit card). Either is fine; silently guessing is not, and this is the same class
of mistake as §11's "check the rendered result, never just the build."

### The scale room — built 2026-08-03

Every screen nested from one shared corner, plus a density table and a "you are here". The
`ScaleRecord` on each era carries a diagonal and a native pixel count; density is computed,
never stored, so it cannot drift from the two numbers it comes from.

**What the numbers turned out to say**, which is more than the plan guessed:

| Year | Diagonal | Native        | Density |
| ---- | -------- | ------------- | ------- |
| 1984 | 9″       | 512 × 342     | 68 ppi  |
| 1991 | 17″      | 1120 × 832    | 82 ppi  |
| 1993 | 14″      | 80 × 24 cells | —       |
| 1995 | 15″      | 800 × 600     | 67 ppi  |
| 2001 | 15″      | 1024 × 768    | 85 ppi  |
| 2007 | 22″      | 1680 × 1050   | 90 ppi  |
| 2013 | 24″      | 1920 × 1080   | 92 ppi  |
| 2025 | 27″      | 2560 × 1440   | 109 ppi |

- **The diagonal grew ~3.0×; density grew ~1.6×.** Screens got bigger far faster than they got
  sharper, which is the mechanical reason a hairline border and a light typeface were unusable
  on the desktop for twenty-five years. §13's Wing II claim now has its baseline measured
  rather than asserted — and measured _before_ the wing that depends on it exists.
- **Density did not even move monotonically.** The sparsest screen in the collection is
  **1995 at 67 ppi** — a fifteen-inch display is _less_ dense than the nine-inch one from
  eleven years earlier, because the glass grew faster than the pixels behind it. Nobody would
  have written that down from memory; it fell out of dividing two verified numbers.
- **Terminal '93 carries no density figure at all.** A character-cell display has no pixel
  grid to divide by. `pixels` is `null` and the column reads `—`; the absence is the exhibit.
- **Two eras share a rectangle.** Redmond '95 and Bondi '01 are both fifteen inches at 4:3, so
  they occupy exactly the same box. The drawing groups them into one outline labelled
  `1995 · 2001` rather than stacking two identical outlines, which would read as a rendering
  bug when it is actually a finding.

"You are here" reports `screen.width/height` and `devicePixelRatio` and is explicit that a
browser exposes pixels and a ratio and never inches — so the drawing's proportions are exact
_relative to each other_ and are not claimed to be life-size.

**Outstanding:** the two-density demonstration — one Rig window at 68 ppi beside the same
window at ~460 ppi, both at true physical scale. It is the exhibit that proves Wing II's
central claim, and it wants Wing II's verified phone figures, so it lands with Phase 8 rather
than being guessed now. The physical calibrator is also unbuilt; the limit is stated on the
wall in the meantime.

### Library gaps the expansion forces

Verified against the codebase 2026-08-03, not assumed:

1. **No directional focus navigation exists.** Arrow-key handling is present in eight
   components — `ScrollArea`, `TreeView`, `DropdownMenu`, `NavigationMenu`, `Accordion`,
   `Menubar`, `TimelineScrubber`, `ResizablePanel` — but every one is **linear and scoped to
   its own widget**. Nothing moves focus _between_ components on a D-pad. (The `@spatial`
   package is 3D/geo visualisation — `MapCanvas`, `GlobeView`, `PointCloud` — not navigation.)
   This blocks Wing III entirely, and it is the largest library item in the plan. It is also
   the most valuable one beyond the museum: TV apps, kiosks, and keyboard-only operation all
   want it.
2. **No `safe-area-inset` anywhere** in `packages/` or `hex/` — zero hits. Notch, home
   indicator and TV overscan all need it. Blocks Edge '19 and the overscan exhibit.
3. **No gamepad input anywhere.** Whether the console rooms are drivable from a real
   controller is a scope decision, not a requirement — but the focus model has to exist first
   either way.
4. **Mobile chrome is missing**, partly. `Drawer` already takes `side="left" | "right" |
"top" | "bottom"`, so a bottom sheet is reachable today with no new component. An **app
   bar** and a **tab bar** are not, and both are era-defining for Wing II.
5. **Hit target and density have to become tokens**, not fixed values, or Wing II cannot be
   data and the whole "era is a token file" contract fails on its first new wing.

Items 1, 2 and 4 are straight library gaps that any consumer benefits from — the same
character as the `ScrollArea` fix in §11, which is the pattern to aim for.

---

## 14. Sequencing, and what not to build

### Honest scope

Unpruned, the expansion is 8 + 7 + 6 = 21 rooms with hardware for each. **Pruned as above it
is 8 existing + 5 + 4 = 17 rooms and 17 objects**, plus peripherals: eight mice, one keyboard
strip, four controllers. That is roughly **three to four times the existing museum**, and the
existing museum took Phases 1–5.

Nothing here is urgent, and none of it should be started while it competes with revenue work.
It is written down so the shape is settled when it does get picked up.

### Order

Front-loaded so the cheapest, highest-argument items land first and nothing waits on the
biggest library change:

- **Phase 6 — Hardware layer, desk wing only.** ✅ **Built 2026-08-03.** Eight objects plus
  the bezel case, the `--h-*` axis, and the era-is-data gate enforced by tests. Needed no
  library changes, exactly as predicted. Detail and the outstanding items are at the end of
  §12.
- **Phase 7 — The Scale.** 🔶 **Mostly built 2026-08-03.** The drawing, the density table and
  "you are here" ship; the two-density demonstration is the remaining piece and it wants Wing
  II's data. Detail below.
- **Phase 8 — Wing II, The Hand.** Five eras. Needs app bar, tab bar, `safe-area-inset`, and
  hit-target/density tokens.
- **Phase 9 — Wing III, The Room.** Four eras. **Blocked on directional focus navigation**,
  which should be scoped and shipped as ordinary library work first, on its own merits.
- **Phase 10 — The peripherals vitrine.** Mouse against controller, 1984 to 2025, one case.
  The payoff, and cheap once both wings exist.

**Every wing carries the Phase 2 gate**: it renders from token files, and no exhibit
component branches on era id. A wing that can't pass it means the vocabulary is wrong, not
that the wing needs an exception.

### Do not build

The list matters more than the roster, because each of these is individually defensible and
collectively they are what turns this into a museum of everything:

- **The full matrix.** §6 already called this a combinatorial trap for era × style; it is a
  worse trap for wing × era × hardware. Wings share rooms where history lets them — Flat '13
  and Soft '25 serve two wings each — and symmetry stays unforced.
- **A fourth wing.** Watches, cars, VR, kiosks, ATMs. Each is a good idea. Collectively they
  are the failure mode. If one of them is genuinely better than a wing above, swap it in;
  don't add it.
- **In-game HUDs.** Wing III is console _system_ UI — dashboards, memory-card managers,
  stores. Game HUDs are a different discipline and an unbounded one.
- **More licensed-lookalike typefaces.** §7's evocation-not-replica posture is doing real
  work and is already at its limit. Two new wings would each want three or four more faces;
  reuse the existing set and let the colophon keep saying so.
- **Real gamepad input**, until the focus model exists, has shipped, and has tests.
- **Any of it, before the desk wing's hardware layer proves the `--h-*` vocabulary.** The
  material layer earned its second axis by surviving two structurally opposite eras (§9,
  Phase 2). The hardware layer has not earned anything yet.

---

## 15. The environment, and what the stack actually supports

### The stack, verified 2026-08-03

**The museum is not a Nuxt app and should not become one.** `demos/` is a Vite 7 + Vue 3.5
SPA with `vue-router`, Tailwind 4 and no `nuxt.config` anywhere. `@amulet-laboratories/rig-nuxt`
is a separate package in `nuxt/` — the Nuxt layer the affiliate sites consume. The two have
never met and there is no reason to introduce them here.

Everything in §12–§14, and everything in this section, is reachable on the current stack with
**no framework change and no new runtime dependency.**

Moving the museum to Nuxt would buy server-rendered wall text — which has real citation value
— and would cost the things that make the museum good. Every one of these is client-only and
each is a hydration hazard: `devicePixelRatio` and `screen.width` (The Scale), physical-size
calibration, `AudioContext` (era sound), pointer capture (window drag), and any measured
layout. It would also fork the museum away from the demos app's font pipeline, offline
Iconify bundle and `build-deploy.mjs` assembly, which §10 says it deliberately shares.

**If the wall text is wanted as citable content, prerender or republish it — don't port the
app.** The cheapest honest option is an article on AmuletLabs.org carrying the era essays and
linking to the exhibit. The exhibit is the thing that has to be live; the prose is not.

### The blocker this question uncovered

Asking "can the room contain the exhibit" surfaced a bug that is **already latent in §8's
plan**, independent of any environment work.

Eight components teleport to `body` with the target **hardcoded** — verified: `Modal`,
`Drawer`, `Tooltip`, `Popover`, `DropdownMenu`, `ContextMenu`, `CommandPalette`, `Toast` all
contain a literal `<Teleport to="body">`.

Era styling is scoped by **ancestor** selector, `[data-hex-era="name"] …`. A teleported node
lands on `body` and has no such ancestor. So:

> **§8's planned control-panel dialog would render outside the monitor, at gallery scale, in
> the museum's modern theme rather than its era's.** So would any context menu, tooltip or
> popover an exhibit opens.

This is the same failure family as §11's collection — CSS silently doing something reasonable
rather than erroring. The fix is a library change and a small one: **a configurable teleport
target**, defaulting to `body` so all 27 themes and every existing consumer are unaffected.
Rig already has `ConfigProvider` and `useConfig`, so a global default plus a per-instance
prop is the natural shape. The museum then points it at the window element and everything
lands inside the era scope, inside the bezel.

That is straight library value beyond the museum — anyone rendering Rig inside a scoped
theme, a shadow-DOM-ish container or a transformed ancestor hits it. **It should be scoped as
ordinary library work and it blocks the second exhibit**, so it comes before Phase 7.

### The rule: the room is 3D, the exhibit never is

The museum's opening line is _"Operate it; it is a working interface, not a screenshot."_ The
environment must not weaken that, which rules out more than it sounds like:

- A **WebGL room is refused.** It either wraps live DOM — in which case the geometry is CSS
  anyway — or it replaces it, and the thesis dies with it.
- **No `filter`/`backdrop-filter`/`transform` on any ancestor of the exhibit.** Beyond the
  cost of blurring live text, each creates a containing block and changes how descendants
  position. The exhibit stays in the flat, untransformed plane.
- Depth-of-field, motion blur and parallax on the exhibit itself: refused, same reason.

So the environment renders **behind and beneath** the object, never around it:

| Tier  | What it is                                                                                                                      | Verdict                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **0** | Scenographic flat — wall and floor as gradient planes, a cast shadow, a light-direction token. What the spike does, plus light. | Build. Zero risk.                                         |
| **1** | Shallow CSS 3D — a floor plane rotated in `perspective`, sitting behind and below. Object and exhibit stay untransformed.       | **Build. The recommended target.**                        |
| **2** | Full CSS 3D with the exhibit on a transformed plane.                                                                            | No. Breaks positioning and hit-testing for marginal gain. |
| **3** | WebGL environment.                                                                                                              | No. See above.                                            |

Tier 1 is a clean boundary and the same shape as the two-diegeses rule in §12: the room may
be a space, the artifact is always a flat live thing standing in it.

### The exhibit worth building the environment for

One idea justifies the whole section.

**Make the gallery light directional and let the visitor move it.** A `--g-light-angle` token
drives the room: the object's cast shadow, the plinth shading, the falloff on the back wall.
Then drag it.

> The beige plastic bezel obeys the light — its cast shadow swings across the plinth. **The
> interface inside it does not move at all.** Redmond '95's bevel stays nailed to the
> top-left, because that light was never real. It is four tones of grey painted into a
> two-pixel band, and it has been lying about a light source since 1995.

Every era's wall text already asserts this — Cube '91's thesis says _"light falling
consistently from the top-left"_, Redmond '95's says _"Light falls from the top-left."_
Currently the museum **tells** the visitor that depth is drawn rather than simulated. A
movable gallery light lets them **discover** it, by noticing that seven of eight rooms ignore
a light they can see moving. Soft '25 is the only room whose shadows would plausibly track a
light, and it doesn't either.

Cost: one custom property, one slider, and `@property` for a smoothly interpolatable angle
(supported everywhere current; verified as the codebase's first use — there is no `@property`
in `demos/`, `hex/` or `packages/` today). This is the cheapest genuinely original exhibit in
the entire plan.

### The gallery light — built 2026-08-03

`demos/src/pages/museum/gallery.css` plus a control above the room. The design decision that
made it work is a split:

> **Direction belongs to the room. Character belongs to the object.**

An era's `--h-cast` was a whole composed shadow, which meant the object's shadow direction was
a property of the object — wrong, and it made the exhibit impossible. It is now three tokens
the era owns (`--h-cast-dist`, `--h-cast-blur`, `--h-cast-color`: a heavy beige CRT throws a
different shadow than a thin aluminium panel) composed against one the gallery owns,
`--g-light-angle`. Screen y runs downward, so a light arriving from angle A throws along
`(-sin A, +cos A)`; the drawing layer does that with `sin()`/`cos()` in `calc()`.

The default is **315°, top-left** — exactly where every era's painted bevel claims its light
comes from. The exhibit opens in agreement with the artifact and only disagrees once moved.

**Verified as a claim, not as a screenshot.** Driving the real slider through three angles:

| Light | Object's cast shadow | Rig button's bevel |
| ----- | -------------------- | ------------------ |
| 315°  | `+15.6px +15.6px`    | unchanged          |
| 135°  | `−15.6px −15.6px`    | unchanged          |
| 45°   | `−15.6px +15.6px`    | unchanged          |

Three distinct shadow positions, one byte-identical bevel. **That table is the exhibit** — the
case obeys the light because the object is really there, and the interface ignores it because
that light was never real. The plinth's own lighting follows too (three distinct gradients),
so the visitor can see the room change and not just the shadow.

The contact shadow under the foot deliberately does _not_ swing: ambient occlusion is about
proximity, not direction, and a contact shadow that slides looks wrong in a way people notice
without naming it.

### Wayfinding is the environment work that's actually mandatory

The rest of this section is optional; this part is not. The current picker is a flat row of
era tabs on a single scrolling route. **At 17 rooms across three wings that stops working**,
and the fix is environmental: a **floor plan** as the primary navigation, gallery numbering,
and a route per room instead of one route for the building.

A floor plan is diegetic to the institution rather than to any era, so it sits correctly on
the right side of the §12 framing rule. It is also the natural home for the wing theses — a
visitor should be able to see that the building has three arguments before entering any of
them.

Room-to-room transitions are a **progressive enhancement, not a dependency**: the View
Transitions API and `animation-timeline: view()` are both uneven across browsers and neither
is load-bearing. The museum works as routes; transitions are a bonus where supported.

### What the environment must not become

The same taste failure as §12's retrowave risk, one room over:

- No ambient audio or room tone. The sound work is muted by default for a reason (§11).
- No dust motes in light beams. `ParticleField` exists in Rig and this is exactly the wrong
  place to reach for it.
- No wood floors, no skylights, no visitor silhouettes, no rope barriers, no potted plants.
- Even, neutral light and a plinth. The spike's restraint is the point — it is what makes the
  objects read as artifacts rather than as nostalgia.

### Where it slots

- **Configurable teleport target** — library work, ahead of Phase 7. Blocks §8's second
  exhibit whether or not any environment work happens.
- **Phase 6b — Tier 0/1 environment plus the movable gallery light.** ✅ **Built 2026-08-03.**
  Tier 0 (lit plinth, directional cast shadow, light-direction token) shipped with the light
  exhibit; Tier 1's rotated floor plane is not built and is optional — the light carries the
  argument on its own and the plane adds no claim.
- **Phase 7b — floor plan, gallery numbering, route-per-room.** Must land before the roster
  passes roughly ten rooms, which means before Wing II ships.

**Nothing here needs a Rig component.** A gallery room is app-level scenography, not a
reusable primitive — §3's "gaps go back into the library" rule is about component internals
and does not apply. The environment lives in `demos/src/pages/museum/` and stays there.
