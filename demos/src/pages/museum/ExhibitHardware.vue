<script setup lang="ts">
/* The machine — one object, rendered identically in every era.
 *
 * This component is the hardware layer's equivalent of ExhibitWindow.vue, and
 * it holds the same contract: no era-specific markup, no conditional on era id,
 * no `style=`. Every difference between a 1984 case and a 2025 panel arrives
 * through [data-hex-era] and the --h-* tokens in hex/src/hardware.css.
 *
 * It is stricter than ExhibitWindow, in fact — that file at least branches on
 * `era.rubberBandDrag`. This one takes an era only to read wall-label words off
 * it. If it ever needs to know *which* era it is in, the vocabulary has failed
 * and the fix belongs in hex/src/hardware.css.
 *
 * Note what is NOT here: no v-if on the indicator, the dials, the vents, the
 * media aperture or the pointing device. Every one of those is present in the
 * markup for all eight rooms and sized or faded to nothing by tokens. That is
 * what "an era is data" has to mean if it is to mean anything.
 */
import { ref } from 'vue'
import type { Era } from './eras'
import { useEraSound } from './useEraSound'

defineProps<{ era: Era }>()

/* The power control is the one thing on the object that does something, and it
 * is what turns the bezel from a picture into UI. Powering down collapses the
 * image to a line and takes the indicator with it — while the wall text beside
 * the room stays lit, because the label belongs to the institution rather than
 * to the machine. */
const powered = ref(true)
const { play } = useEraSound()

function togglePower() {
  powered.value = !powered.value
  play('power')
}
</script>

<template>
  <div data-museum-plinth>
    <div data-museum-scene>
      <div data-museum-monitor :data-off="!powered || undefined">
        <!-- The exhibit sits behind the glass and stays fully operable: the
             raster and reflection layers are pseudo-elements with
             pointer-events: none. Dragging the window past the aperture clips
             it, which is what a window leaving a screen does. -->
        <div data-museum-screen :data-off="!powered || undefined">
          <slot />
          <span data-museum-glass aria-hidden="true"></span>
        </div>

        <!-- Fixed contents, fixed order. Presence is entirely a matter of
             tokens; two items carry an order token because they move across the
             collection rather than appearing and disappearing. -->
        <div data-museum-chin>
          <span data-museum-led aria-hidden="true"></span>
          <span data-museum-dial aria-hidden="true" style="--dial-r: -35deg"></span>
          <span data-museum-dial data-second aria-hidden="true" style="--dial-r: 40deg"></span>
          <span data-museum-plate>{{ era.machine.plate }}</span>
          <span data-spacer></span>
          <span data-museum-slot aria-hidden="true"></span>
          <span data-museum-vents aria-hidden="true"></span>
          <button
            type="button"
            data-museum-power
            :aria-pressed="powered"
            :aria-label="powered ? 'Switch the exhibit off' : 'Switch the exhibit on'"
            @click="togglePower"
          ></button>
        </div>
      </div>

      <div data-museum-neck aria-hidden="true"></div>
      <div data-museum-foot aria-hidden="true"></div>

      <div data-museum-deck>
        <svg data-museum-cord viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0 C50 26, 68 22, 68 40" />
        </svg>

        <div data-museum-pointer aria-hidden="true">
          <span data-split></span>
          <span data-seam></span>
          <span data-wheel></span>
        </div>

        <!-- The modifier row. Two keys until 1995, three after — the count is
             the whole point, so the labels come from the era record and the
             markup just renders however many there are. -->
        <div data-museum-keys aria-hidden="true">
          <kbd v-for="k in era.machine.keys" :key="k">{{ k }}</kbd>
        </div>

        <!-- Terminal '93 is the only object with no pointing device. An
             unlabelled empty deck reads as a bug rather than as an exhibit. -->
        <p data-museum-absent>No pointing device</p>
      </div>
    </div>
  </div>
</template>
