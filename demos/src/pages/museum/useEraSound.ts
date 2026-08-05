import { ref } from 'vue'

/* Era sound.
 *
 * Every tone here is synthesised at runtime from oscillators and noise. No
 * recording ships, which is deliberate twice over: the original system sounds
 * are copyrighted and could not be included, and a square wave at 1000 Hz is
 * closer to what a 1984 machine actually produced than any sample of one would
 * be — that hardware had a single-channel beeper, not a sound file.
 *
 * Muted by default. An exhibit that makes noise at a visitor who did not ask
 * is a worse exhibit, and autoplay policy would block it anyway.
 */

export type EraSound = 'beep' | 'click' | 'chime' | 'error' | 'power' | 'none'

const enabled = ref(false)

let ctx: AudioContext | null = null

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  // Created lazily on the first sound so it is always inside a user gesture,
  // which is what keeps the context from starting suspended.
  ctx ??= new Ctor()
  return ctx
}

/** A single-channel square beep — the 1984 Macintosh's entire sound palette. */
function beep(ac: AudioContext, freq: number, ms: number, type: OscillatorType = 'square') {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  // Ramped rather than switched: an instant cut produces an audible click of
  // its own, which is the wrong artefact.
  gain.gain.setValueAtTime(0.0001, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.08, ac.currentTime + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + ms / 1000)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + ms / 1000 + 0.02)
}

/** A mechanical tick: filtered noise, far too short to have a pitch. */
function click(ac: AudioContext) {
  const len = Math.floor(ac.sampleRate * 0.012)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3
  const src = ac.createBufferSource()
  const gain = ac.createGain()
  gain.gain.value = 0.12
  src.buffer = buf
  src.connect(gain).connect(ac.destination)
  src.start()
}

/** A degaussing coil: a low sine sliding down, plus a short noise transient. */
function thump(ac: AudioContext) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(120, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(38, ac.currentTime + 0.32)
  gain.gain.setValueAtTime(0.0001, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.16, ac.currentTime + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.36)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + 0.4)
  click(ac)
}

export function useEraSound() {
  function play(sound: EraSound) {
    if (!enabled.value || sound === 'none') return
    const ac = context()
    if (!ac) return
    if (ac.state === 'suspended') void ac.resume()

    switch (sound) {
      case 'beep':
        beep(ac, 1000, 90)
        break
      case 'click':
        click(ac)
        break
      case 'chime':
        // A rising third — the shape a startup chime takes without being one.
        beep(ac, 523.25, 140, 'triangle')
        window.setTimeout(() => beep(ac, 659.25, 220, 'triangle'), 120)
        break
      case 'error':
        // Falling, which is how every era signalled refusal.
        beep(ac, 330, 120)
        window.setTimeout(() => beep(ac, 220, 200), 110)
        break
      case 'power':
        // The degauss thump. Not a beep at all — a CRT's power-on noise came
        // from the degaussing coil physically moving, so it is a low sine that
        // drops rather than a tone that plays, with a noise transient on top.
        thump(ac)
        break
    }
  }

  return { enabled, play }
}
