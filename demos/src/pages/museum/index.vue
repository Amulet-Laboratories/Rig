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
import ExhibitWindow from './ExhibitWindow.vue'
import { eras, defaultEra } from './eras'
import { useEraSound } from './useEraSound'

const { enabled: soundOn } = useEraSound()

const current = ref(defaultEra)
const era = computed(() => eras.find((e) => e.id === current.value) ?? eras[0])

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

      <!-- Period room -->
      <div data-museum-room :data-hex-era="era.id">
        <ExhibitWindow :era="era" />
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
      </div>

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
