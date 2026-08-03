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
import { ref, computed } from 'vue'
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
