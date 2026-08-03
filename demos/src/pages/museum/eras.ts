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
  /**
   * The object the era's software ran on. Wall-label content for the hardware
   * layer — the paint and geometry of the machine live in Hex as `--h-*`
   * tokens; only the words and the two comparable figures live here.
   */
  machine: Machine
  /** What this room is after, with dates and sources. See Provenance. */
  provenance: Provenance
}

/**
 * What a room interprets, named plainly.
 *
 * The museum's display names stay descriptive — Redmond '95, not Windows 95 —
 * because the room is a reconstruction with substitute typefaces and no
 * original artwork, and naming it after the product would claim something it
 * cannot deliver. But an interpretation with no stated source is just a vibe,
 * so the source is stated here, with dates, exactly as §7 has always done for
 * typefaces. Naming a real thing in provenance is scholarship; reproducing its
 * marks and artwork is what §1 forbids, and this does not do that.
 *
 * Every date below was verified against a source at the time of writing rather
 * than recalled — a wrong date renders as fact on a wall label. `sources` is
 * not decoration; it is the reason to believe the rest of the record.
 */
export interface Provenance {
  /** The systems this room is after. Plural where the look was not one product's. */
  interprets: SourceSystem[]
  /** The display the object is drawn from — a typical machine of the period, never one model. */
  display: { description: string; resolution: string; dated: string }
  /** Peripherals worth dating, and why each one is in the record. */
  accessories: Accessory[]
  /** What this room deliberately does not reproduce. */
  substituted: string
  sources: string[]
}

export interface SourceSystem {
  name: string
  vendor: string
  released: string
}

export interface Accessory {
  name: string
  dated: string
  /** What this object tells you that the room otherwise only asserts. */
  note: string
}

export interface Machine {
  /** Silkscreened on the chin. Descriptive, never a product name. */
  plate: string
  /** The single detail on the object most worth pointing at. */
  tell: string
  /** Bezel thickness in px — must match this era's `--h-pad`. */
  bezel: number
  /** Visible buttons on the pointing device. Zero is a real answer twice. */
  buttons: number
  /**
   * The modifier keys left of the space bar, in order. The most era-legible
   * part of any keyboard: the count goes 2 → 3 in 1995 and never comes back
   * down. Glyphs are generic on purpose — no key here carries a trade mark.
   */
  keys: string[]
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
    machine: {
      plate: 'Compact monochrome · 9-inch',
      bezel: 30,
      buttons: 1,
      keys: ['⌥', '⌘'],
      tell: 'No power indicator anywhere on the front. You knew it was on because the tube glowed — for one era, the first thing a machine told you about itself was told by physics rather than by a light.',
    },
    provenance: {
      interprets: [{ name: 'System 1', vendor: 'Apple', released: '24 January 1984' }],
      display: {
        description: 'Built-in 9-inch monochrome CRT, Macintosh 128K',
        resolution: '512 × 342',
        dated: '24 January 1984',
      },
      accessories: [
        {
          name: 'Single-button mouse, shipped with the Macintosh 128K',
          dated: '24 January 1984',
          note: "One button, and the whole interface was designed around never needing a second. This room's menus and its modifier keys are both downstream of that decision.",
        },
      ],
      substituted: 'Silkscreen for Chicago. No icon artwork, marks or system sounds reproduced.',
      sources: [
        'https://en.wikipedia.org/wiki/Macintosh_128K',
        'https://en.wikipedia.org/wiki/System_1',
      ],
    },
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
    machine: {
      plate: 'Greyscale workstation display',
      bezel: 24,
      buttons: 2,
      keys: ['Alt', 'Cmd'],
      tell: 'Milled, not painted: the object makes exactly the argument its software does. It is the only machine here with no colour on it anywhere except a five-pixel indicator.',
    },
    provenance: {
      interprets: [{ name: 'NeXTSTEP', vendor: 'NeXT', released: 'September 1989' }],
      display: {
        description: 'NeXT MegaPixel Display, 17-inch, four levels of grey',
        resolution: '1120 × 832',
        dated: '1990',
      },
      accessories: [
        {
          name: 'Two-button mouse, shipped with the NeXTcube',
          dated: '18 September 1990',
          note: "Two buttons on a machine that cost as much as a car, and almost nobody used it — which is this era's critique in one object.",
        },
      ],
      substituted: 'Inter for Helvetica. No icon artwork or marks reproduced.',
      sources: [
        'https://en.wikipedia.org/wiki/NeXTcube',
        'https://en.wikipedia.org/wiki/NeXT_MegaPixel_Display',
        'https://en.wikipedia.org/wiki/NeXTSTEP',
      ],
    },
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
    machine: {
      plate: 'Serial text terminal · 80 × 25',
      bezel: 40,
      buttons: 0,
      keys: ['Ctrl', 'Alt'],
      tell: "The thickest bezel and the two dials are the same fact — the display's own settings were physical, outside any software's reach. The empty deck is the exhibit: the wall text says nothing could be pointed at, and here is why.",
    },
    provenance: {
      interprets: [
        {
          name: 'VT320 character-cell terminal',
          vendor: 'Digital Equipment Corporation',
          released: 'August 1987',
        },
        { name: 'VT220', vendor: 'Digital Equipment Corporation', released: 'November 1983' },
      ],
      display: {
        description: 'DEC VT320 serial terminal, deep-set tube',
        resolution: '25 lines × 80 or 132 columns',
        dated: 'August 1987',
      },
      accessories: [
        {
          name: 'Keyboard only — no pointing device existed for it',
          dated: 'August 1987',
          note: "The empty deck is the exhibit. This room's wall text says nothing could be pointed at; the object is why.",
        },
      ],
      substituted: "VT323 for the VT320's character ROM. No marks reproduced.",
      sources: ['https://en.wikipedia.org/wiki/VT320', 'https://en.wikipedia.org/wiki/VT220'],
    },
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
    machine: {
      plate: 'Desktop CRT · 15-inch',
      bezel: 30,
      buttons: 2,
      keys: ['Ctrl', '❖', 'Alt'],
      tell: 'The busiest chin in the collection: indicator, media aperture, vent bank, silkscreened plate. Every later object removes one of these and never adds anything back.',
    },
    provenance: {
      interprets: [{ name: 'Windows 95', vendor: 'Microsoft', released: '24 August 1995' }],
      display: {
        description: '15-inch desktop CRT, typical of the period',
        resolution: '800 × 600',
        dated: 'typical of 1995',
      },
      accessories: [
        {
          name: 'Two-button mouse, no wheel',
          dated: '1995',
          note: 'Correct for the year, and not an omission — see the next two entries.',
        },
        {
          name: 'Microsoft IntelliMouse — the first mouse with a scroll wheel',
          dated: 'announced 22 July 1996, shipped November 1996',
          note: "Eleven months AFTER this room's operating system. The wheel is missing here because in 1995 it did not exist yet.",
        },
        {
          name: 'Microsoft Natural Keyboard — introduced the third modifier',
          dated: 'announced September 1994, on sale October 1994',
          note: 'Two new modifier keys between Ctrl and Alt, shipped a year before the system they were made for. This is the room where the modifier row goes from two keys to three.',
        },
      ],
      substituted:
        'Jersey 10 for MS Sans Serif. No icon artwork, marks or system sounds reproduced.',
      sources: [
        'https://en.wikipedia.org/wiki/Windows_95',
        'https://en.wikipedia.org/wiki/Windows_key',
        'https://www.howtogeek.com/741726/why-do-mice-have-scroll-wheels-microsoft-intellimouse-turns-25/',
      ],
    },
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
    machine: {
      plate: 'Translucent CRT · 15-inch',
      bezel: 26,
      buttons: 1,
      keys: ['Ctrl', '⌥', '⌘'],
      tell: 'The case became translucent in the same year the interface became glossy — one argument in two materials. The indicator also stopped being a state and became a behaviour: it breathes.',
    },
    provenance: {
      interprets: [
        {
          name: 'Mac OS X 10.0 “Cheetah” — the Aqua interface',
          vendor: 'Apple',
          released: '24 March 2001',
        },
      ],
      display: {
        description: '15-inch translucent all-in-one CRT, typical of the period',
        resolution: '1024 × 768',
        dated: 'typical of 1998–2001',
      },
      accessories: [
        {
          name: 'Apple USB Mouse, round and translucent — the “hockey puck”',
          dated: 'released 15 August 1998, discontinued July 2000',
          note: "One button and perfectly circular, so it gave the hand no clue which way it was pointing. The object predates this room's software by three years, which is honest: people ran 10.0 on the machines they already had.",
        },
      ],
      substituted: 'Inter for Lucida Grande. No icon artwork, marks or system sounds reproduced.',
      sources: [
        'https://en.wikipedia.org/wiki/Mac_OS_X_10.0',
        'https://en.wikipedia.org/wiki/Hockey_puck_mouse',
      ],
    },
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
    machine: {
      plate: 'Widescreen LCD · 22-inch',
      bezel: 15,
      buttons: 3,
      keys: ['Ctrl', '❖', 'Alt'],
      tell: 'The first screen here with no raster — no tube, so no scanlines, no vignette, no corner curvature. The gloss doubles instead. The era whose software claims to be sheet glass shipped on hardware that literally was.',
    },
    provenance: {
      interprets: [
        {
          name: 'Windows Vista — the Aero interface',
          vendor: 'Microsoft',
          released: '30 January 2007',
        },
      ],
      display: {
        description: '22-inch widescreen LCD, glossy, typical of the period',
        resolution: '1680 × 1050',
        dated: 'typical of 2007',
      },
      accessories: [
        {
          name: 'Two-button mouse with a scroll wheel',
          dated: '2007',
          note: 'The peak of the pointing device: three inputs, and a direct descendant of the 1996 IntelliMouse. Nothing after this room has more.',
        },
      ],
      substituted: 'Inter for Segoe UI. No icon artwork, marks or system sounds reproduced.',
      sources: [
        'https://en.wikipedia.org/wiki/Windows_Vista',
        'https://en.wikipedia.org/wiki/Windows_Aero',
      ],
    },
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
    machine: {
      plate: 'Aluminium LCD · 24-inch',
      bezel: 8,
      buttons: 0,
      keys: ['Ctrl', '⌥', '⌘'],
      tell: 'The flattening was not only a rendering decision. In one window the hardware lost its bevel, its vents, its indicator and its cable — and the mouse lost its buttons and became a surface. Affordance collapsed on both sides of the glass at once.',
    },
    provenance: {
      interprets: [
        { name: 'iOS 7', vendor: 'Apple', released: '18 September 2013' },
        {
          name: 'Windows 8 — the Metro design language',
          vendor: 'Microsoft',
          released: 'October 2012',
        },
      ],
      display: {
        description: '24-inch LCD, matte, typical of the period',
        resolution: '1920 × 1080',
        dated: 'typical of 2013',
      },
      accessories: [
        {
          name: 'Apple Magic Mouse — multi-touch, no visible buttons',
          dated: '20 October 2009',
          note: 'The pointing device lost its buttons four years before the interface lost its bevels. The hardware flattened first.',
        },
      ],
      substituted: 'Inter for Helvetica Neue. No icon artwork or marks reproduced.',
      sources: [
        'https://en.wikipedia.org/wiki/IOS_7',
        'https://en.wikipedia.org/wiki/Magic_Mouse',
        'https://en.wikipedia.org/wiki/Windows_8',
      ],
    },
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
    machine: {
      plate: '—',
      bezel: 4,
      buttons: 0,
      keys: ['Ctrl', '⌥', '⌘'],
      tell: "Nothing is silkscreened on it, nothing indicates power, nothing vents, nothing plugs in, nothing clicks. The object makes the room's point faster than its wall text does.",
    },
    provenance: {
      interprets: [
        {
          name: 'Present-day system interfaces — no single release',
          vendor: 'various',
          released: 'the room is named for the year it was built, not for a product',
        },
      ],
      display: {
        description: '27-inch bezel-less panel',
        resolution: '2560 × 1440',
        dated: 'typical of 2025',
      },
      accessories: [
        {
          name: 'Apple Magic Trackpad — the entire surface is the button',
          dated: '27 July 2010',
          note: 'The last step of the argument: not fewer buttons, no buttons. The peripheral became a surface fifteen years before this room.',
        },
      ],
      substituted: 'Inter for system stacks. No icon artwork or marks reproduced.',
      sources: ['https://en.wikipedia.org/wiki/Magic_Trackpad'],
    },
  },
]

export const defaultEra = 'redmond95'
