/* The collection.
 *
 * Each entry is one period room. `id` is the [data-hex-era] value the Hex era
 * bundle is scoped to — keep it in sync with hex/src/eras/<id>/tokens.css and
 * the `eras` array in hex/build.mjs, or the room renders unstyled.
 *
 * Wall text is deliberately about design *ideas* rather than products. These
 * are interpretations, named descriptively; see docs/MUSEUM-ROADMAP.md.
 */

export interface Era {
  id: string
  name: string
  year: number
  /** One line for the picker */
  tagline: string
  /** Wall text — what this era was arguing for */
  thesis: string
  /** The single detail most worth pointing at */
  detail: string
  /** What it got wrong, in hindsight */
  critique: string
  /** Typeface the room evokes, and what actually ships */
  typeface: string
  /**
   * Where this era grouped its scroll arrows. NeXTSTEP put both at one end;
   * everything else in the collection splits them. Undefined means split.
   */
  steppers?: 'split' | 'start' | 'end'
  /**
   * True for eras that could not afford to redraw a window while it moved, so
   * dragging tracked a wireframe outline and the window jumped on release.
   * Compositing made this unnecessary around the turn of the century.
   */
  rubberBandDrag?: boolean
}

/* Typed as non-empty so callers can fall back to eras[0] without a null check —
 * a museum with no exhibits is not a state worth modelling. */
export const eras: [Era, ...Era[]] = [
  {
    id: 'cupertino84',
    rubberBandDrag: true,
    name: "Cupertino '84",
    year: 1984,
    tagline: 'One bit. No grey.',
    thesis:
      'A screen with two colours and no room to be subtle. Depth is a single hard outline and a one-pixel drop shadow; a pressed control has nothing to deepen, so it simply inverts. Every shade you think you see here is a checkerboard of black and white pixels — including the desktop, whose famous grey contains no grey at all.',
    detail:
      'The title bar is six horizontal lines with a white gap knocked out behind the text. Drag handles, close boxes and window edges all had to be legible at one bit, which is why they are still legible at any size.',
    critique:
      'Nothing could be de-emphasised. With no grey available, a disabled control had to be dithered into a pattern, and the difference between "unavailable" and "just noisy" was often a coin flip.',
    typeface: 'Chicago — shipping as Silkscreen',
  },
  {
    id: 'cube91',
    rubberBandDrag: true,
    name: "Cube '91",
    year: 1991,
    tagline: 'Machined, not painted.',
    thesis:
      'NeXTSTEP — the most influential interface almost nobody used. Its argument was that software should look milled rather than drawn: greyscale only, no colour anywhere in the chrome, light falling consistently from the top-left onto surfaces with real thickness. Redmond shipped a coarser version of the same idea four years later to a hundred times the audience.',
    detail:
      'Both scroll arrows sit together at the bottom of the bar instead of one at each end. It is the fastest way to identify a NeXT screenshot, and it is the one thing in this museum that could not be reached by styling alone — Rig grew a stepperPlacement prop to make it possible.',
    critique:
      'Beautiful and unaffordable. The hardware cost as much as a car, and an interface language this restrained gave users almost no colour cues to navigate by — every control looked exactly as important as every other.',
    typeface: 'Helvetica — shipping as Inter',
    steppers: 'end',
  },
  {
    id: 'terminal93',
    rubberBandDrag: true,
    name: "Terminal '93",
    year: 1993,
    tagline: 'Eighty columns, sixteen colours.',
    thesis:
      'Not a graphical interface at all. Every control is characters on a fixed grid, every border is a box-drawing glyph, and the only depth cue available is the colour behind the text. Its conventions — a menu bar across the top, a status line along the bottom, a highlighted selection bar — were inherited wholesale by the window managers that replaced it.',
    detail:
      'The drop shadow under a dialog is two columns of dimmed characters. There is no compositing here; the shadow is literally text drawn darker, and the effect is convincing anyway.',
    critique:
      'Nothing could be pointed at. Every action lived behind a key combination you had to already know, and discoverability as a design concern barely existed — which is precisely the gap the mouse was sold to close.',
    typeface: 'DEC VT320 — shipping as VT323',
  },
  {
    id: 'redmond95',
    rubberBandDrag: true,
    name: "Redmond '95",
    year: 1995,
    tagline: 'The canonical bevel.',
    thesis:
      'Light falls from the top-left. Four tones of grey — highlight, light, face, shadow — arranged into a two-pixel band, applied without exception to every raised surface: buttons, title bars, scroll thumbs, status panes, menu bars. It is the most teachable interface language ever built, because the whole grammar fits in one sentence and never breaks it.',
    detail:
      'The scrollbar trough is a one-pixel checkerboard of white and grey — a trick invented to fake a lighter shade on a sixteen-colour display. Nothing dates a screenshot to the nineties faster.',
    critique:
      'Disabled text was embossed grey-on-grey, which is close to unreadable and was shipped to hundreds of millions of screens anyway. The era treated legibility as a styling problem rather than a floor.',
    typeface: 'MS Sans Serif — shipping as Jersey 10',
  },
  {
    id: 'bondi01',
    name: "Bondi '01",
    year: 2001,
    tagline: 'The first blurred shadow.',
    thesis:
      'The skeuomorphic peak, and the moment depth stopped being drawn and started being simulated. Every era before this used hard one-pixel offsets because the hardware could afford nothing else; here shadows blur, fills turn glossy, and the interface begins pretending to be made of physical material — wet plastic, brushed metal, ruled paper.',
    detail:
      'The pinstripe: fine white rules ruled across every window and title bar. It is doing the same job as the 1995 checkerboard dither — faking a texture the palette cannot hold — but now as decoration rather than necessity.',
    critique:
      'Ornament outgrew its usefulness. Once every surface glistened, gloss stopped signalling "this is a button" and became merely what surfaces looked like, which is most of why the next era threw all of it out.',
    typeface: 'Lucida Grande — shipping as Inter',
  },
  {
    id: 'glass07',
    name: "Glass '07",
    year: 2007,
    tagline: 'A live blur of what is behind.',
    thesis:
      'Aero, and the high-water mark of interface materialism. Bondi pretended surfaces were plastic; Glass claims they are frosted sheet glass, lit from behind, with a bright rim where the light catches an edge. It is the only era here whose defining property is not a colour or a shadow but a real-time blur of whatever sits underneath.',
    detail:
      'This is the one room that could not have been built in CSS until recently. Everything else is achievable with borders and gradients; the glass needs backdrop-filter, and nothing else is honest about it.',
    critique:
      'It cost a GPU. Aero was the first interface that could not be drawn on a machine that could not afford to redraw it every frame — and on hardware that could not, the whole language silently degraded to flat grey.',
    typeface: 'Segoe UI — shipping as Inter',
  },
  {
    id: 'flat13',
    name: "Flat '13",
    year: 2013,
    tagline: 'The great flattening.',
    thesis:
      'In roughly eighteen months the industry discarded the entire vocabulary of the previous four eras — gradients, bevels, textures, shadows — and replaced it with hairlines, flat fills and white space. This room is defined almost entirely by absence. What grew instead was type: bigger, lighter, and given room to breathe.',
    detail:
      'A single hairline border now does the work that four tones of bevel did in 1995. The scrollbar has thinned to a grey capsule floating on nothing, and often is not drawn at all until you reach for it.',
    critique:
      'Affordance collapsed. With shadows and bevels gone, nothing distinguished a button from a label except convention, and a decade of research went into rediscovering that people could no longer tell what was clickable.',
    typeface: 'Helvetica Neue — shipping as Inter',
  },
  {
    id: 'soft25',
    name: "Soft '25",
    year: 2025,
    tagline: 'The present, on the wall.',
    thesis:
      'The room you did not expect to find in a museum. Large radii, dark by default, wide diffuse shadows, generous spacing, springy overshoot on every transition, and secondary text set deliberately below full contrast. You are reading this sentence in it right now.',
    detail:
      'Notice the shadow under the window: twenty-four pixels of blur at fifty-five per cent black. Cupertino ’84 achieved the same effect with a single hard pixel, and did it in one bit.',
    critique:
      'Too early to say — which is exactly what every previous room would have answered in its own decade. The low-contrast secondary text is the most likely candidate, and it is already being walked back.',
    typeface: 'System stacks — shipping as Inter',
  },
]

export const defaultEra = 'redmond95'
