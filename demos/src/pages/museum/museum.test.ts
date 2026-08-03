/* The museum's structural contracts, as tests.
 *
 * These do not check that anything looks right — nothing can. They check the
 * two claims the museum makes about itself, both of which are the kind that
 * rot silently:
 *
 *   1. An era is data. No file that *draws* an exhibit may name an era.
 *   2. The wall labels agree with the tokens they describe.
 *
 * Claim 2 exists because `machine.bezel` in eras.ts and `--h-pad` in the era's
 * hardware.css are the same fact written twice — the bezel case prints one and
 * the object renders the other. Nothing would surface a drift between them,
 * and the bezel ladder is the hardware layer's entire argument.
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { eras } from './eras'

const HERE = dirname(fileURLToPath(import.meta.url))
const HEX_ERAS = resolve(HERE, '../../../../hex/src/eras')

const read = (p: string) => readFileSync(p, 'utf8')

describe('museum — an era is data', () => {
  /* The Phase 2 gate, automated. Every one of these files draws part of an
   * exhibit; none may know which era it is drawing. The moment one does, the
   * vocabulary has failed and the fix belongs in hex, not here. */
  const drawingLayer = [
    'ExhibitWindow.vue',
    'ExhibitHardware.vue',
    'hardware.css',
    'gallery.css',
    'museum.css',
  ]

  it.each(drawingLayer)('%s names no era', (file) => {
    const src = read(resolve(HERE, file))
    const named = eras.map((e) => e.id).filter((id) => src.includes(id))
    expect(named, `${file} must not reference an era id`).toEqual([])
  })

  it('the era engine names no era either', () => {
    const src = read(resolve(HEX_ERAS, '_shared/chrome.css'))
    expect(eras.map((e) => e.id).filter((id) => src.includes(id))).toEqual([])
  })
})

describe('museum — labels agree with tokens', () => {
  it.each(eras)('$name: machine.bezel matches its --h-pad', (era) => {
    const css = read(resolve(HEX_ERAS, era.id, 'hardware.css'))
    const match = /--h-pad:\s*(\d+)px/.exec(css)
    expect(match, `${era.id}/hardware.css declares no --h-pad`).not.toBeNull()
    expect(Number(match![1])).toBe(era.machine.bezel)
  })

  /* §1's naming rule applies to the ARTIFACT, not to the scholarship.
   *
   * The plate is silkscreened onto the object and the keycaps are moulded into
   * it — a visitor reads both *inside* the exhibit, where a product name would
   * assert that the reconstruction is the product. Those stay descriptive.
   *
   * Provenance is the opposite case and is deliberately exempt: naming Windows
   * 95 and dating it is what makes the room legible as an interpretation rather
   * than a vibe, and the colophon has named real typefaces since §7. The test
   * below therefore checks the plate and the keycaps and nothing else. */
  it('no plate or keycap carries a product name', () => {
    const banned = /apple|macintosh|microsoft|windows|next|ibm|dell|sony|compaq|hp\b|win\b/i
    for (const era of eras) {
      expect(banned.test(era.machine.plate), `${era.id} plate: "${era.machine.plate}"`).toBe(false)
      for (const key of era.machine.keys) {
        expect(banned.test(key), `${era.id} keycap: "${key}"`).toBe(false)
      }
    }
  })

  /* The modifier count is the keyboard strip's entire reason to exist: two keys
   * left of the space bar until 1995, three from then on, and it never comes
   * back down. If someone "tidies" the key arrays this is the thing that breaks
   * silently, because three caps still look fine. */
  it('the modifier row goes two, then three, and never back', () => {
    const counts = eras.map((e) => e.machine.keys.length)
    expect(counts).toEqual([2, 2, 2, 3, 3, 3, 3, 3])
    expect(counts.every((n, i) => i === 0 || n >= (counts[i - 1] ?? 0))).toBe(true)
  })
})

describe('museum — provenance is cited, not asserted', () => {
  /* A wall label renders these as fact. An uncited date is the one failure mode
   * that looks completely fine and is completely wrong, so every room has to
   * carry its sources and nothing may be left blank. */
  it.each(eras)('$name states what it interprets, with a date', (era) => {
    const p = era.provenance
    expect(p.interprets.length).toBeGreaterThan(0)
    for (const src of p.interprets) {
      expect(src.name.trim()).not.toBe('')
      expect(src.vendor.trim()).not.toBe('')
      expect(src.released.trim()).not.toBe('')
    }
  })

  it.each(eras)('$name cites at least one source', (era) => {
    expect(era.provenance.sources.length).toBeGreaterThan(0)
    for (const url of era.provenance.sources) {
      expect(url).toMatch(/^https:\/\//)
    }
  })

  it.each(eras)('$name dates its object and its accessories', (era) => {
    const p = era.provenance
    expect(p.display.description.trim()).not.toBe('')
    expect(p.display.dated.trim()).not.toBe('')
    expect(p.accessories.length).toBeGreaterThan(0)
    for (const a of p.accessories) {
      expect(a.dated.trim(), `${era.id}: ${a.name} has no date`).not.toBe('')
      expect(a.note.trim(), `${era.id}: ${a.name} has no reason to be here`).not.toBe('')
    }
  })

  /* The room is an interpretation and the label has to say so. Every room
   * declares what it swapped out — without this the descriptive naming looks
   * like coyness rather than accuracy. */
  it.each(eras)('$name declares what it substituted', (era) => {
    expect(era.provenance.substituted.trim()).not.toBe('')
  })
})

describe('museum — the collection is complete', () => {
  it('every era ships both a materials and a hardware token file', () => {
    for (const era of eras) {
      expect(() => read(resolve(HEX_ERAS, era.id, 'tokens.css'))).not.toThrow()
      expect(() => read(resolve(HEX_ERAS, era.id, 'hardware.css'))).not.toThrow()
    }
  })

  it('both token files are imported by the combined bundle', () => {
    const index = read(resolve(HEX_ERAS, 'index.css'))
    for (const era of eras) {
      expect(index, `${era.id} tokens`).toContain(`./${era.id}/tokens.css`)
      expect(index, `${era.id} hardware`).toContain(`./${era.id}/hardware.css`)
    }
  })
})
