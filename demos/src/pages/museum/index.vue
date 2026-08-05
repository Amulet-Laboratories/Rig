<script setup lang="ts">
/* The Museum of User Interfaces.
 *
 * Two viewing modes, mirroring how museums actually work: a period room you
 * walk into, and a vitrine of specimens you compare. Both render the same
 * unmodified Rig components — only [data-hex-era] changes.
 *
 * The museum's own chrome stays modern throughout. Modern lighting and labels
 * around old objects; only the exhibit travels.
 */
import { ref, computed, onMounted } from 'vue'
import { Button, Checkbox, ScrollArea, List, Slider } from '@amulet-laboratories/rig'
import '@amulet-laboratories/rig/hex/eras'
import '@/assets/fonts/museum.css'
import './museum.css'
import './hardware.css'
import './gallery.css'
import ExhibitWindow from './ExhibitWindow.vue'
import ExhibitHardware from './ExhibitHardware.vue'
import { eras, defaultEra } from './eras'
import { useEraSound } from './useEraSound'

const { enabled: soundOn } = useEraSound()

const current = ref(defaultEra)
const era = computed(() => eras.find((e) => e.id === current.value) ?? eras[0])

/* The gallery light. Starts at 315° — top-left — which is exactly where every
 * era's painted bevel claims its own light comes from, so the exhibit opens in
 * agreement with the artifact and only disagrees once you move it. */
const lightAngle = ref(315)
const lightBearing = computed(() => {
  const points = [
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
    'top-left',
  ]
  return points[Math.round(lightAngle.value / 45) % 8]
})

/* ── The scale room ────────────────────────────────────────────────────────
 * Not a period room and not a wing: an instrument. Every screen in the
 * collection drawn at true size *relative to each other*, which needs no
 * calibration and is exact — unlike absolute physical size, which a browser
 * cannot report at all. That limit is stated on the wall rather than glossed.
 */
const PX_PER_INCH = 26 // drawing scale, chosen so 27" fits the column

/** Aspect from the pixel grid, or from the character cell where there is none. */
function aspectOf(e: (typeof eras)[number]) {
  const p = e.scale.pixels
  if (p) return p.w / p.h
  const c = e.scale.cells
  // A character cell is taller than it is wide; 10 × 20 is the VT320's.
  return c ? (c.cols * 10) / (c.rows * 20) : 4 / 3
}

const drawn = computed(() =>
  eras.map((e) => {
    const a = aspectOf(e)
    const d = e.scale.diagonalIn
    const h = d / Math.sqrt(1 + a * a)
    const w = h * a
    const px = e.scale.pixels
    return {
      id: e.id,
      year: e.year,
      name: e.name,
      w: Math.round(w * PX_PER_INCH),
      h: Math.round(h * PX_PER_INCH),
      diagonalIn: d,
      pixels: px ? `${px.w} × ${px.h}` : `${e.scale.cells?.cols} × ${e.scale.cells?.rows} cells`,
      // Density needs a pixel grid to divide by. The terminal has none.
      ppi: px ? Math.round(Math.hypot(px.w, px.h) / d) : null,
    }
  }),
)

/* Distinct rectangles, not distinct eras. Redmond '95 and Bondi '01 are both
 * fifteen inches at 4:3, so they occupy exactly the same box — drawing two
 * outlines on the same four edges would look like a rendering bug when it is
 * actually a finding. They share one rectangle and one label instead. */
const boxes = computed(() => {
  const byBox = new Map<string, { w: number; h: number; years: number[]; ids: string[] }>()
  for (const d of drawn.value) {
    const key = `${d.w}×${d.h}`
    const hit = byBox.get(key) ?? { w: d.w, h: d.h, years: [], ids: [] }
    hit.years.push(d.year)
    hit.ids.push(d.id)
    byBox.set(key, hit)
  }
  return [...byBox.values()].sort((a, b) => b.w - a.w)
})

/* Every screen is absolutely positioned so they can share one corner, which
 * leaves the stage with no intrinsic size at all — it needs the bounding box of
 * the largest rectangle or the column collapses to nothing. */
const stageBox = computed(() => ({
  width: `${Math.max(...drawn.value.map((d) => d.w))}px`,
  height: `${Math.max(...drawn.value.map((d) => d.h))}px`,
}))

const scaleSpan = computed(() => {
  const withPpi = drawn.value.filter((d) => d.ppi !== null) as (Omit<
    (typeof drawn.value)[number],
    'ppi'
  > & { ppi: number })[]
  const first = withPpi[0]!
  const last = withPpi[withPpi.length - 1]!
  const diag = drawn.value.map((d) => d.diagonalIn)
  // The sparsest screen is NOT the earliest one, which is the good part: a
  // 15-inch at 800 × 600 is less dense than a 9-inch at 512 × 342.
  const sparsest = withPpi.reduce((a, b) => (b.ppi < a.ppi ? b : a))
  return {
    diagonal: (Math.max(...diag) / Math.min(...diag)).toFixed(1),
    density: (last.ppi / first.ppi).toFixed(1),
    firstPpi: first.ppi,
    firstYear: first.year,
    lastPpi: last.ppi,
    lastYear: last.year,
    sparsestPpi: sparsest.ppi,
    sparsestYear: sparsest.year,
  }
})

/* "You are here." Client-only by nature, so it stays null until mounted rather
 * than guessing — and it reports what the browser actually exposes, which is
 * CSS pixels and a ratio, never inches. */
const yours = ref<{ css: string; device: string; ratio: number } | null>(null)
onMounted(() => {
  const r = window.devicePixelRatio || 1
  yours.value = {
    css: `${window.screen.width} × ${window.screen.height}`,
    device: `${Math.round(window.screen.width * r)} × ${Math.round(window.screen.height * r)}`,
    ratio: r,
  }
})

/* Specimens get their own tiny state so the comparative view is operable, not
 * a screenshot. */
const specimenChecked = ref(true)
const specimenZoom = ref(40)
const specimenItems = [
  { id: 'a', label: 'Aldus' },
  { id: 'b', label: 'Bitmap' },
  { id: 'c', label: 'Cursor' },
  { id: 'd', label: 'Dither' },
  { id: 'e', label: 'Emboss' },
]
const specimenSelected = ref('a')
</script>

<template>
  <div data-museum>
    <div data-museum-inner>
      <header data-museum-lede>
        <h1>The Museum of User Interfaces</h1>
        <p>
          Every exhibit here is the same set of components wearing a different set of materials. The
          window below is one Vue file with no knowledge of which era it is in — the bevels, the
          dither, the inverted press, the striped title bar all arrive as CSS custom properties.
          Operate it; it is a working interface, not a screenshot — drag the title bar, and notice
          that the rooms built before compositing drag a wireframe outline and only jump on release,
          because redrawing a window at pointer speed was once unaffordable.
        </p>
      </header>

      <!-- Era picker — museum chrome, deliberately modern -->
      <div data-museum-picker role="group" aria-label="Choose an era">
        <button
          v-for="e in eras"
          :key="e.id"
          type="button"
          data-museum-era-tab
          :aria-pressed="current === e.id"
          @click="current = e.id"
        >
          <strong>{{ e.name }}</strong>
          <span>{{ e.tagline }}</span>
        </button>

        <!-- Off by default: an exhibit that makes noise at someone who did not
             ask for it is a worse exhibit. Every tone is synthesised — no
             recording of any real system ships. -->
        <button type="button" data-museum-sound :aria-pressed="soundOn" @click="soundOn = !soundOn">
          <span aria-hidden="true">{{ soundOn ? '🔊' : '🔇' }}</span>
          Sound {{ soundOn ? 'on' : 'off' }}
        </button>
      </div>

      <!-- Gallery light — museum chrome, so it sits outside [data-hex-era] and
           stays modern. It operates the room rather than the object, which is
           why it is here and not on the machine. -->
      <div data-museum-lightbar>
        <!-- A <label for> cannot reach this control: Rig's Slider puts the id
             on its wrapper element and the range input inside it is anonymous,
             so `for` would point at a non-labelable div. The accessible name
             comes from aria-label instead, and the visible text is presentational.
             Worth a prop on Slider eventually — noted in the roadmap. -->
        <span data-lightbar-label>Gallery light</span>
        <div data-slider>
          <Slider
            v-model="lightAngle"
            :min="0"
            :max="359"
            :step="1"
            aria-label="Gallery light direction, in degrees"
          />
        </div>
        <output>{{ lightAngle }}°</output>
        <p>
          The light is coming from the <strong>{{ lightBearing }}</strong
          >. Move it and watch the case: the shadow it throws swings across the plinth, because the
          object is really there. <strong>The interface inside it does not move at all.</strong>
          Its bevel has been claiming a light source since 1995 and there was never one — those are
          four tones of grey painted into a two-pixel band, and they point top-left whatever the
          room does.
        </p>
      </div>

      <!-- Period room. The exhibit now stands inside the machine it ran on —
           both are the same era's token file, one describing the interface and
           one describing the object. -->
      <div
        data-museum-room
        :data-hex-era="era.id"
        :style="{ '--g-light-angle': `${lightAngle}deg` }"
      >
        <ExhibitHardware :era="era">
          <ExhibitWindow :era="era" />
        </ExhibitHardware>
      </div>

      <!-- Wall text -->
      <div data-museum-wall>
        <section>
          <h3>What it argued</h3>
          <p>{{ era.thesis }}</p>
        </section>
        <section>
          <h3>Look closer</h3>
          <p>{{ era.detail }}</p>
        </section>
        <section>
          <h3>What it got wrong</h3>
          <p>{{ era.critique }}</p>
        </section>
        <section>
          <h3>The machine</h3>
          <p>{{ era.machine.tell }}</p>
        </section>
      </div>

      <!-- Provenance. The room keeps its descriptive name because it is a
           reconstruction with substitute typefaces and no original artwork —
           calling it "Windows 95" would claim something it cannot deliver. But
           an interpretation with no stated source is just a vibe, so the source
           is stated here with dates, exactly as the colophon has always done
           for typefaces. Every date is cited; none is from memory. -->
      <section data-museum-tombstone>
        <h3>Provenance</h3>
        <dl>
          <dt>Interprets</dt>
          <dd>
            <span v-for="src in era.provenance.interprets" :key="src.name">
              <strong>{{ src.name }}</strong> · {{ src.vendor }} · {{ src.released }}
            </span>
          </dd>

          <dt>Object</dt>
          <dd>
            {{ era.provenance.display.description }} · {{ era.provenance.display.resolution }} ·
            {{ era.provenance.display.dated }}
          </dd>

          <dt>Accessories</dt>
          <dd>
            <span v-for="a in era.provenance.accessories" :key="a.name">
              <strong>{{ a.name }}</strong> · {{ a.dated }}<br />
              <em>{{ a.note }}</em>
            </span>
          </dd>

          <dt>Substituted</dt>
          <dd>{{ era.provenance.substituted }}</dd>

          <dt>Sources</dt>
          <dd data-sources>
            <a
              v-for="(url, i) in era.provenance.sources"
              :key="url"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              >[{{ i + 1 }}]</a
            >
          </dd>
        </dl>
      </section>

      <!-- Specimen case: one widget set, every era at once. Only possible
           because era styling is scoped rather than applied globally. -->
      <section data-museum-case>
        <header data-museum-lede>
          <h2>The specimen case</h2>
          <p>
            The same five controls, every era side by side. A period room shows you what an
            interface felt like; only a vitrine lets you see what actually changed.
          </p>
        </header>

        <div data-museum-case-grid>
          <article v-for="e in eras" :key="e.id" data-museum-specimen>
            <div data-museum-specimen-label>{{ e.name }}</div>
            <div data-museum-specimen-stage :data-hex-era="e.id">
              <Button>Button</Button>
              <Checkbox v-model="specimenChecked">Checkbox</Checkbox>
              <Slider v-model="specimenZoom" :min="0" :max="100" aria-label="Slider specimen" />
              <ScrollArea
                steppers
                :stepper-placement="e.steppers ?? 'split'"
                :step="24"
                :aria-label="`Scrollbar specimen, ${e.name}`"
              >
                <List
                  :items="specimenItems"
                  :selected="specimenSelected"
                  aria-label="List specimen"
                  @select="specimenSelected = $event as string"
                />
              </ScrollArea>
            </div>
          </article>
        </div>
      </section>

      <!-- The scale room. An instrument rather than a wing: it makes no
           argument of its own, it measures. Nested from a shared corner
           because that is the only arrangement where growth is readable at a
           glance rather than requiring the eye to compare two distant edges. -->
      <section data-museum-case>
        <header data-museum-lede>
          <h2>The scale room</h2>
          <p>
            Every screen in the collection at true size relative to each other, nested from one
            corner. Two numbers move here, and they move at very different rates — which is the
            point, because only one of them is the one anybody talks about.
          </p>
        </header>

        <div data-museum-scale>
          <div data-museum-scale-stage :style="stageBox">
            <div
              v-for="box in boxes"
              :key="`${box.w}x${box.h}`"
              data-museum-scale-screen
              :data-current="box.ids.includes(era.id) || undefined"
              :style="{ width: `${box.w}px`, height: `${box.h}px` }"
            >
              <span>{{ box.years.join(' · ') }}</span>
            </div>
          </div>

          <div data-museum-scale-table>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Diagonal</th>
                  <th>Native</th>
                  <th>Density</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in drawn" :key="d.id" :data-current="d.id === era.id || undefined">
                  <td>{{ d.year }}</td>
                  <td>{{ d.diagonalIn }}″</td>
                  <td>{{ d.pixels }}</td>
                  <td>{{ d.ppi === null ? '—' : `${d.ppi} ppi` }}</td>
                </tr>
              </tbody>
            </table>

            <p>
              Across forty-one years the diagonal grew about
              <strong>{{ scaleSpan.diagonal }}×</strong>, while pixel density went from
              <strong>{{ scaleSpan.firstPpi }} ppi</strong> in {{ scaleSpan.firstYear }} to
              <strong>{{ scaleSpan.lastPpi }}</strong> in {{ scaleSpan.lastYear }} — about
              <strong>{{ scaleSpan.density }}×</strong>. Screens got bigger far faster than they got
              sharper, which is why a hairline border and a light typeface were unusable on the
              desktop for twenty-five years.
            </p>

            <p>
              And it did not even move steadily. The sparsest screen in the collection is
              <strong>{{ scaleSpan.sparsestYear }}</strong> at
              <strong>{{ scaleSpan.sparsestPpi }} ppi</strong> — a fifteen-inch display is
              <em>less</em> dense than the nine-inch one from eleven years earlier, because the
              glass grew faster than the pixels behind it. The room where that finally reverses is
              not on this wall. It is in the visitor's pocket.
            </p>

            <p>
              Terminal ’93 carries no density figure because it had no pixel grid to divide by — it
              addressed characters, not points. That absence is the exhibit, not a gap.
            </p>

            <p data-museum-scale-you>
              <template v-if="yours">
                <strong>You are here.</strong> Your display reports {{ yours.css }} CSS pixels at a
                device ratio of {{ yours.ratio }}, so about {{ yours.device }} real ones. On
                physical size it reports nothing at all: a browser exposes pixels and a ratio, never
                inches. The proportions above are exact <em>relative to each other</em> and are not
                claimed to be life-size on your screen — measuring that needs you to hold something
                of known width against the glass, which the museum does not yet ask.
              </template>
              <template v-else>Reading your display…</template>
            </p>
          </div>
        </div>
      </section>

      <!-- The bezel case. The specimen case above compares controls; this
           compares the machines they ran on — eight frames, no content, no
           fonts, no live components. It is the cheapest exhibit here and it
           makes the hardware layer's whole argument at a glance. -->
      <section data-museum-case>
        <header data-museum-lede>
          <h2>The bezel case</h2>
          <p>
            Every frame in the collection, empty, at one scale. The interface inside them changed
            eight times over forty years; the machine around them did something simpler. It receded
            — from forty pixels of moulding around a nine-inch tube to four pixels of almost
            nothing.
          </p>
        </header>

        <div data-museum-bezel-grid>
          <!-- [data-hex-era] scopes to the frame only, never to the figure. On
               the figure it would hand the caption the era's desktop colour and
               period typeface, and eight labels would become unreadable — the
               framing rule again, at the scale of a single grid cell. -->
          <figure v-for="e in eras" :key="e.id">
            <div data-museum-bezel :data-hex-era="e.id"><div></div></div>
            <figcaption data-museum-bezel-label>
              <strong>{{ e.year }}</strong>
              {{ e.machine.bezel }} px · {{ e.machine.buttons }}
              {{ e.machine.buttons === 1 ? 'button' : 'buttons' }}
            </figcaption>
          </figure>
        </div>
      </section>

      <footer data-museum-colophon>
        <p>
          These are interpretations, not reproductions. Each era is named descriptively and evokes
          the design ideas of its period rather than any product's trade dress. The original
          typefaces are licensed and cannot ship, so each room wears a freely licensed stand-in, all
          under the SIL Open Font License 1.1: <strong>Silkscreen</strong> by Jason Kottke for
          Cupertino '84, <strong>VT323</strong> by Peter Hull for Terminal '93,
          <strong>Jersey 10</strong> by Sarah Cadigan-Fried for Redmond '95, and
          <strong>Inter</strong> by Rasmus Andersson for the four rooms from 1991 onward whose
          originals were Helvetica or a system stack.
        </p>
        <p>
          That the five most recent rooms share a single typeface is itself an exhibit: type stopped
          being era-defining once every platform shipped a neutral grotesque.
        </p>
        <p>
          Built with Hexrig. The era layer adds material tokens — bevel, elevation, density,
          texture, motion — on top of Hex's palette tokens, and applies them to unmodified Rig
          components through <code>[data-hex-era]</code>.
        </p>
      </footer>
    </div>
  </div>
</template>
