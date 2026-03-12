/**
 * Bestiary Compendium — Creature catalog mock data
 * Theme: Obelisk | Archetype: Filterable card catalog with detail panel
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Classification =
  | 'Beast'
  | 'Aberration'
  | 'Construct'
  | 'Elemental'
  | 'Undead'
  | 'Fey'
  | 'Fiend'
  | 'Monstrosity'

export type Habitat =
  | 'Coastal'
  | 'Underground'
  | 'Forest'
  | 'Mountain'
  | 'Swamp'
  | 'Desert'
  | 'Arctic'
  | 'Urban'
  | 'Planar'

export type ThreatLevel = 1 | 2 | 3 | 4 | 5

export interface Creature {
  id: string
  name: string
  classification: Classification
  habitat: Habitat[]
  threatLevel: ThreatLevel
  description: string
  traits: string[]
  imageColor: string
  lore: string
  encounters: number
}

// ---------------------------------------------------------------------------
// Color mapping for image placeholders
// ---------------------------------------------------------------------------

export const classificationColors: Record<Classification, string> = {
  Beast: '#6b8f4e',
  Aberration: '#8b5ab5',
  Construct: '#7a7a7a',
  Elemental: '#c97034',
  Undead: '#4a6b5a',
  Fey: '#b5a347',
  Fiend: '#a03030',
  Monstrosity: '#5a7ab5',
}

export const threatColors: Record<ThreatLevel, string> = {
  1: '#4ade80',
  2: '#a3e635',
  3: '#fbbf24',
  4: '#f97316',
  5: '#ef4444',
}

// ---------------------------------------------------------------------------
// Creature data
// ---------------------------------------------------------------------------

export const creatures: Creature[] = [
  {
    id: 'c-001',
    name: 'Ashenmaw Serpent',
    classification: 'Beast',
    habitat: ['Coastal', 'Swamp'],
    threatLevel: 3,
    description: 'A massive sea serpent with scales that smolder like dying embers. Its breath leaves a trail of caustic ash across the water.',
    traits: ['Venomous', 'Amphibious', 'Pack hunter'],
    imageColor: '#6b4e3d',
    lore: 'Sailors along the Brine Coast speak of Ashenmaw Serpents in hushed tones. The creatures are believed to nest in volcanic vents beneath the continental shelf, surfacing only during the warmest months to hunt in shallow waters. Their venom is prized by alchemists for its peculiar property of igniting when mixed with salt water.',
    encounters: 47,
  },
  {
    id: 'c-002',
    name: 'Glimmerweave Spider',
    classification: 'Beast',
    habitat: ['Forest', 'Underground'],
    threatLevel: 2,
    description: 'A bioluminescent arachnid that spins webs of light to lure prey. Its silk glows faintly blue in darkness.',
    traits: ['Nocturnal', 'Web spinner', 'Bioluminescent'],
    imageColor: '#3d6b8f',
    lore: 'Glimmerweave Spiders are considered a nuisance by miners but a treasure by textile workers. Their silk, when properly harvested, can be woven into fabric that produces a gentle, steady light without heat. The Lanternweavers Guild of Briar Cove maintains careful breeding programs in abandoned mine shafts.',
    encounters: 183,
  },
  {
    id: 'c-003',
    name: 'Voidstone Golem',
    classification: 'Construct',
    habitat: ['Underground', 'Urban'],
    threatLevel: 5,
    description: 'An ancient war machine carved from obsidian-like stone that absorbs light. Its hollow core radiates a low hum audible only to the attuned.',
    traits: ['Immune to magic', 'Slow', 'Heavily armored', 'Anti-magic aura'],
    imageColor: '#2a2a3d',
    lore: 'Only three Voidstone Golems are known to exist, remnants of a forgotten empire that weaponized null-magic zones. Each stands roughly twelve feet tall and moves with grinding deliberation. Scholars debate whether they are autonomous or awaiting commands from masters long dead. One guards the sealed archive beneath Thornspire Academy.',
    encounters: 3,
  },
  {
    id: 'c-004',
    name: 'Thornmantle Stag',
    classification: 'Fey',
    habitat: ['Forest'],
    threatLevel: 2,
    description: 'A ethereal deer whose antlers grow living brambles, blooming with tiny white flowers. It walks between the mortal world and the Feywild.',
    traits: ['Phase shift', 'Healing aura', 'Territorial'],
    imageColor: '#5a8f5a',
    lore: 'Thornmantle Stags are omens of balance. Where one is sighted, the boundary between worlds is thin. Druids follow their trails to locate natural ley line crossings. Harming one is taboo among every culture that borders the Oldwood, as their deaths cause localized blights that can last decades.',
    encounters: 29,
  },
  {
    id: 'c-005',
    name: 'Cinderskull Revenant',
    classification: 'Undead',
    habitat: ['Desert', 'Underground'],
    threatLevel: 4,
    description: 'The burning remains of a fire mage, perpetually wreathed in pale flame. Its skull floats above a column of cinders and bone ash.',
    traits: ['Fire immune', 'Spell echo', 'Undead resilience'],
    imageColor: '#8f4a2a',
    lore: 'Cinderskull Revenants form when a pyromancer dies mid-casting, their final spell lodging in their remains like a spiritual splinter. They roam the Ashfall Wastes in slow, purposeful circuits, repeating fragments of their last incantation. Dispelling the echo is the only way to grant them peace, but the magical resonance makes approach extremely dangerous.',
    encounters: 12,
  },
  {
    id: 'c-006',
    name: 'Kelp Wraith',
    classification: 'Aberration',
    habitat: ['Coastal', 'Swamp'],
    threatLevel: 3,
    description: 'A mass of animated seaweed and brine that assumes a roughly humanoid shape. It drags prey beneath the waterline with tendrils of kelp.',
    traits: ['Aquatic', 'Camouflage', 'Entangling'],
    imageColor: '#2a5a3d',
    lore: 'Kelp Wraiths are not truly undead despite their name — they are aberrant colonies of semi-sentient plant matter animated by residual magical pollution. They first appeared in the harbors of Briar Cove after the Tidemill Incident and have since spread along the entire southern coast. Herbalists note they seem drawn to areas of concentrated arcane runoff.',
    encounters: 67,
  },
  {
    id: 'c-007',
    name: 'Cogwork Falcon',
    classification: 'Construct',
    habitat: ['Urban', 'Mountain'],
    threatLevel: 1,
    description: 'A clockwork bird used as a courier and scout. Its brass feathers catch the light as it spirals above the rooftops.',
    traits: ['Flying', 'Messenger', 'Fragile'],
    imageColor: '#b5943d',
    lore: 'Originally developed by the Artificers Enclave as mail couriers, Cogwork Falcons have become ubiquitous in major cities. Each one requires weekly winding by a trained artisan. Their internal navigation is remarkably sophisticated — they can find a recipient anywhere within a fifty-mile radius using a combination of geomantic lodestones and wind pattern analysis.',
    encounters: 412,
  },
  {
    id: 'c-008',
    name: 'Blightbark Treant',
    classification: 'Monstrosity',
    habitat: ['Forest', 'Swamp'],
    threatLevel: 4,
    description: 'A corrupted tree spirit, its bark blackened and weeping sap. Parasitic fungi grow in its branches, releasing toxic spores.',
    traits: ['Slow', 'Spore cloud', 'Regeneration', 'Corrupted'],
    imageColor: '#3d3d2a',
    lore: 'Blightbark Treants are the tragic result of fey corruption — once noble guardians of ancient groves now twisted by disease or dark magic. They cannot be reasoned with and attack anything living that enters their territory. The Verdant Order maintains a registry of known Blightbark locations and patrols their perimeters to prevent unsuspecting travelers from wandering too close.',
    encounters: 18,
  },
  {
    id: 'c-009',
    name: 'Stormcaller Wyvern',
    classification: 'Beast',
    habitat: ['Mountain', 'Coastal'],
    threatLevel: 5,
    description: 'A massive winged reptile that generates electrical discharge from specialized organs along its spine. Thunderclaps follow its wingbeats.',
    traits: ['Flying', 'Lightning breath', 'Apex predator', 'Storm affinity'],
    imageColor: '#3d5a8f',
    lore: 'Stormcaller Wyverns are the apex aerial predators of the northern ranges. They nest at extreme altitudes, above the cloud line, and descend only to hunt. Their lightning-generation capability makes them essentially immune to ranged attacks — arrows and bolts are deflected by the ambient charge. Only dragon-bonded knights have successfully engaged one in combat.',
    encounters: 7,
  },
  {
    id: 'c-010',
    name: 'Mirrorling',
    classification: 'Fey',
    habitat: ['Forest', 'Urban'],
    threatLevel: 2,
    description: 'A tiny, reflective fey creature that mimics the appearance of whoever looks at it. Roughly the size of a sparrow.',
    traits: ['Shapeshifter', 'Curious', 'Harmless', 'Illusionist'],
    imageColor: '#8f8fb5',
    lore: 'Mirrorlings are among the most benign fey creatures encountered in the mortal world. They are attracted to strong emotions and tend to congregate around theaters, festivals, and other gatherings. While they can mimic appearance perfectly at their tiny scale, they cannot reproduce sound or scent. Children in Briar Cove keep them as unofficial pets.',
    encounters: 234,
  },
  {
    id: 'c-011',
    name: 'Obsidian Drake',
    classification: 'Elemental',
    habitat: ['Mountain', 'Underground'],
    threatLevel: 5,
    description: 'A wingless dragon-kin formed from living volcanic glass. It moves through rock as if swimming through water.',
    traits: ['Earth glide', 'Fire immune', 'Crystalline armor', 'Tremorsense'],
    imageColor: '#1a1a2e',
    lore: 'Obsidian Drakes are elemental entities that manifest near sites of intense geothermal activity. They seem territorial rather than predatory, attacking only creatures that disturb their volcanic domains. Mining operations have learned to detect their presence through the distinctive harmonic vibrations they produce while burrowing, giving workers precious minutes to evacuate.',
    encounters: 5,
  },
  {
    id: 'c-012',
    name: 'Whispermoths',
    classification: 'Fey',
    habitat: ['Forest', 'Swamp', 'Urban'],
    threatLevel: 1,
    description: 'A swarm of luminous moths whose wingbeats produce faint, musical tones. They gather in clouds that hum like distant choirs.',
    traits: ['Swarm', 'Bioluminescent', 'Mesmerizing', 'Harmless'],
    imageColor: '#b5a8d4',
    lore: 'Whispermoths are drawn to stories. Not metaphorically — they literally congregate wherever tales are being told, sung, or performed. Bards consider their presence a mark of quality, and some taverns in Briar Cove leave windows open during storytelling nights specifically to attract them. Their song is said to improve memory and ease nightmares.',
    encounters: 891,
  },
  {
    id: 'c-013',
    name: 'Ironhide Boar',
    classification: 'Beast',
    habitat: ['Forest', 'Mountain'],
    threatLevel: 3,
    description: 'A massive boar with metallic bristles that can deflect blades. Its tusks leave furrows in solid stone.',
    traits: ['Charge', 'Heavily armored', 'Aggressive', 'Territorial'],
    imageColor: '#5a5a6b',
    lore: 'Ironhide Boars are believed to be natural creatures that evolved near mineral-rich springs, gradually incorporating metal deposits into their biology over generations. They are solitary and extremely aggressive during mating season. Their bristles are harvested by armorers as a lightweight, flexible reinforcement material, making controlled hunting programs both lucrative and dangerous.',
    encounters: 52,
  },
  {
    id: 'c-014',
    name: 'Pale Lurker',
    classification: 'Aberration',
    habitat: ['Underground', 'Urban'],
    threatLevel: 4,
    description: 'A translucent, eyeless humanoid that clings to ceilings and walls. It detects prey through vibration and heat.',
    traits: ['Blindsight', 'Wall crawler', 'Ambush predator', 'Silent'],
    imageColor: '#c4b8a8',
    lore: 'Pale Lurkers are the apex predators of the deep undercity. They are patient hunters, capable of remaining motionless for weeks while waiting for prey. Their translucent skin makes them nearly invisible against stone surfaces. The Briar Cove sewer maintenance corps carries specialized resonance devices that detect their presence, but even so, encounters are frequently fatal.',
    encounters: 23,
  },
  {
    id: 'c-015',
    name: 'Duskwing Raven',
    classification: 'Fey',
    habitat: ['Forest', 'Urban', 'Mountain'],
    threatLevel: 1,
    description: 'A large raven with iridescent purple-black plumage. It can speak in riddles and is often found near crossroads.',
    traits: ['Intelligent', 'Speaking', 'Oracle', 'Flying'],
    imageColor: '#2e1a3d',
    lore: 'Duskwing Ravens occupy a peculiar ecological niche between messenger, omen, and pest. They are genuine fey entities, not enchanted animals, and possess intelligence comparable to a clever human child. They delight in wordplay and will trade useful information for shiny objects or entertaining stories. Several serve as informal informants for the Briar Cove constabulary.',
    encounters: 156,
  },
  {
    id: 'c-016',
    name: 'Saltfire Elemental',
    classification: 'Elemental',
    habitat: ['Coastal', 'Desert'],
    threatLevel: 3,
    description: 'A blazing humanoid figure formed from crystallized sea salt, burning with pale blue flame. It evaporates water on contact.',
    traits: ['Fire aura', 'Salt armor', 'Water vulnerability', 'Desiccating touch'],
    imageColor: '#5a8fb5',
    lore: 'Saltfire Elementals form spontaneously at the intersection of extreme heat and concentrated brine — typically on salt flats during lightning storms. They are volatile and short-lived, rarely persisting more than a few days. However, during their brief existence, they can cause tremendous damage to coastal settlements, as their desiccating aura kills vegetation and evaporates fresh water stores.',
    encounters: 31,
  },
  {
    id: 'c-017',
    name: 'Bonedust Swarm',
    classification: 'Undead',
    habitat: ['Desert', 'Underground'],
    threatLevel: 3,
    description: 'A cloud of animated bone fragments, each piece no larger than a grain of sand. It strips flesh in seconds.',
    traits: ['Swarm', 'Undead', 'Abrasive', 'Wind-borne'],
    imageColor: '#b5a88f',
    lore: 'Bonedust Swarms are the remnants of mass graves disturbed by necromantic energy. The bone matter is ground to powder by the animating force, creating a horrifyingly efficient predator. They move with prevailing winds and are most dangerous during sandstorms, where they become indistinguishable from natural particulate. Desert nomads carry blessed cloth masks as protection.',
    encounters: 19,
  },
  {
    id: 'c-018',
    name: 'Calcified Guardian',
    classification: 'Construct',
    habitat: ['Underground', 'Desert'],
    threatLevel: 4,
    description: 'A statue-like sentinel carved from limestone, standing vigil over ancient tombs. It activates only when thresholds are crossed.',
    traits: ['Sentinel', 'Stone form', 'Threshold trigger', 'Heavily armored'],
    imageColor: '#8f8a7a',
    lore: 'Unlike Voidstone Golems, Calcified Guardians were mass-produced protective constructs, affordable enough for wealthy merchants to commission as tomb guardians. Thousands were created during the Second Empire, and many remain active today. They follow simple conditional logic: permit authorized passage, destroy everything else. The authorization methods vary wildly and are often lost to time.',
    encounters: 41,
  },
  {
    id: 'c-019',
    name: 'Emberveil Fox',
    classification: 'Beast',
    habitat: ['Forest', 'Mountain'],
    threatLevel: 1,
    description: 'A small fox with fur that shifts between orange and translucent, appearing to flicker like candlelight.',
    traits: ['Elusive', 'Fire resistant', 'Nocturnal', 'Solitary'],
    imageColor: '#c97a4a',
    lore: 'Emberveil Foxes are the least dangerous fire-touched creatures, using their flickering camouflage purely for evasion rather than predation. They feed on insects drawn to their warmth and are particularly active during autumn. Trappers consider them nearly impossible to catch, as their phasing ability allows them to slip through nets and snares like smoke.',
    encounters: 88,
  },
  {
    id: 'c-020',
    name: 'Grave Warden',
    classification: 'Undead',
    habitat: ['Urban', 'Underground'],
    threatLevel: 2,
    description: 'An armored skeleton bound to protect a specific location. Unlike mindless undead, it retains tactical awareness and weapon proficiency.',
    traits: ['Intelligent undead', 'Sentinel', 'Armed', 'Bound'],
    imageColor: '#4a5a4a',
    lore: 'Grave Wardens are the ethical paradox of necromancy — undead created with the willing consent of the deceased, who chose in life to serve beyond death. The practice is legal in several jurisdictions but deeply controversial. Briar Cove maintains a small contingent of Grave Wardens in its catacombs, each one a former volunteer who signed binding contracts while living.',
    encounters: 34,
  },
  {
    id: 'c-021',
    name: 'Mistwalker',
    classification: 'Aberration',
    habitat: ['Swamp', 'Coastal', 'Forest'],
    threatLevel: 4,
    description: 'An entity that exists partially out of phase with reality. It appears as a silhouette surrounded by perpetual fog.',
    traits: ['Phase shift', 'Fog aura', 'Disorienting', 'Semi-corporeal'],
    imageColor: '#7a7a8f',
    lore: 'Mistwalkers are theorized to be creatures from an adjacent plane that became trapped between dimensions. They are not inherently hostile but their presence destabilizes local reality. Compasses spin, distances become unreliable, and time perception warps. Travelers who encounter them report losing hours or days. The Wayfinders Guild charts known Mistwalker territories and updates routes seasonally.',
    encounters: 14,
  },
  {
    id: 'c-022',
    name: 'Crystalline Beetle',
    classification: 'Elemental',
    habitat: ['Underground', 'Mountain'],
    threatLevel: 1,
    description: 'A hand-sized beetle with a carapace of living crystal that refracts light into rainbow patterns. Herding behavior.',
    traits: ['Burrower', 'Harmless', 'Crystal growth', 'Colonial'],
    imageColor: '#7ab5a8',
    lore: 'Crystalline Beetles are considered beneficial despite being elemental creatures. Their burrowing activities create crystal-lined tunnels that naturally reinforce mine shafts. Several mining operations have taken to encouraging beetle colonies rather than exterminating them. The crystals they produce are too soft for gemstone use but make attractive building material when polished.',
    encounters: 567,
  },
  {
    id: 'c-023',
    name: 'Hollowborn',
    classification: 'Fiend',
    habitat: ['Planar', 'Underground'],
    threatLevel: 5,
    description: 'A tall, gaunt entity with skin like burned parchment. Where its features should be, there is only smooth, featureless surface.',
    traits: ['Fear aura', 'Soul drain', 'Teleportation', 'Planar'],
    imageColor: '#1a1a1a',
    lore: 'Hollowborn are among the most dangerous planar entities catalogued by the Compendium. They feed on identity — prolonged proximity causes victims to forget their names, faces, and eventually their sense of self. They cannot cross into the material plane without being summoned, but once present, they are extraordinarily difficult to banish. Only three successful banishments are on record.',
    encounters: 2,
  },
  {
    id: 'c-024',
    name: 'Brambleshrike',
    classification: 'Monstrosity',
    habitat: ['Forest', 'Swamp'],
    threatLevel: 2,
    description: 'A bird-like creature the size of a hawk, with thorns instead of feathers. It impales prey on bramble bushes to feed later.',
    traits: ['Flying', 'Thorn barbs', 'Cruel', 'Territorial'],
    imageColor: '#5a3d3d',
    lore: 'Brambleshrike behavior mirrors that of mundane shrikes, but at a larger and more dangerous scale. They are semi-intelligent and hold grudges — a Brambleshrike wronged by a specific individual will pursue them for miles. Foresters mark their territories with red cloth strips and detour around them. Their thorn-feathers are used in specialized ammunition by hunters.',
    encounters: 76,
  },
  {
    id: 'c-025',
    name: 'Tidecaller Crab',
    classification: 'Elemental',
    habitat: ['Coastal'],
    threatLevel: 2,
    description: 'A crab the size of a wagon wheel that can manipulate local water levels. Its shell is encrusted with barnacles and small corals.',
    traits: ['Aquatic', 'Water manipulation', 'Heavily armored', 'Slow'],
    imageColor: '#3d7a8f',
    lore: 'Tidecaller Crabs are revered by coastal communities as harbingers of good fishing. Their water manipulation ability creates favorable currents that drive fish toward shore. Harming one is considered extreme bad luck by every maritime culture in the region. During spring equinox, they gather in large groups and collectively raise tides by several inches — a phenomenon called the Crab Tide.',
    encounters: 93,
  },
  {
    id: 'c-026',
    name: 'Shadeweaver',
    classification: 'Fiend',
    habitat: ['Planar', 'Urban'],
    threatLevel: 4,
    description: 'A spider-like fiend that weaves webs from solidified shadow. Its victims become trapped in nightmares they cannot distinguish from reality.',
    traits: ['Shadow magic', 'Web spinner', 'Dream manipulation', 'Incorporeal'],
    imageColor: '#2a1a3d',
    lore: 'Shadeweavers are the architects of fiendish influence operations. Rather than attacking directly, they infiltrate cities and weave shadow-webs in attics and cellars, gradually ensnaring sleeping residents in escalating nightmares. A single Shadeweaver can destabilize an entire neighborhood over weeks. The Church of Dawn maintains trained exorcists who specialize in detecting and destroying their webs.',
    encounters: 9,
  },
  {
    id: 'c-027',
    name: 'Dustback Tortoise',
    classification: 'Beast',
    habitat: ['Desert', 'Mountain'],
    threatLevel: 1,
    description: 'A massive tortoise with a shell of compacted sandstone. Small ecosystems of lichens and mosses grow on its back.',
    traits: ['Slow', 'Heavily armored', 'Herbivore', 'Ancient'],
    imageColor: '#8f7a5a',
    lore: 'Dustback Tortoises are among the longest-lived natural creatures, with verified specimens exceeding four hundred years. Their shells accumulate layers of sediment that effectively become geological records. Naturalists study the mineral bands on ancient Dustbacks to reconstruct past climate conditions. They are gentle and largely oblivious to creatures smaller than themselves.',
    encounters: 127,
  },
  {
    id: 'c-028',
    name: 'Riftmaw',
    classification: 'Aberration',
    habitat: ['Planar', 'Underground'],
    threatLevel: 5,
    description: 'A living tear in reality shaped like a mouth. The space inside it connects to nowhere — matter that enters simply ceases to exist.',
    traits: ['Annihilation field', 'Planar', 'Drifting', 'Inscrutable'],
    imageColor: '#0a0a1a',
    lore: 'Riftmaws defy conventional biology entirely. They are not creatures in any meaningful sense — they are wounds in the fabric of reality that exhibit predatory behavior. They move slowly but inexorably toward concentrations of magical energy. The Planar Studies department classifies them as existential hazards and maintains a real-time tracking network. Fortunately, they are exceedingly rare.',
    encounters: 1,
  },
  {
    id: 'c-029',
    name: 'Lantern Wasp',
    classification: 'Beast',
    habitat: ['Forest', 'Swamp'],
    threatLevel: 2,
    description: 'A dinner-plate-sized wasp whose abdomen glows with warm amber light. It builds paper nests that illuminate the forest canopy.',
    traits: ['Flying', 'Bioluminescent', 'Colonial', 'Venomous'],
    imageColor: '#b58f3d',
    lore: 'Lantern Wasps serve a crucial ecological role as both predators and light sources for the deep forest understory. Their bioluminescence enables photosynthesis in plants that would otherwise receive no sunlight. Herbalists harvest their nest paper for its unusual fire-resistant properties. While their sting is painful, it is rarely dangerous to healthy adults.',
    encounters: 203,
  },
  {
    id: 'c-030',
    name: 'Spirehorn Basilisk',
    classification: 'Monstrosity',
    habitat: ['Desert', 'Mountain'],
    threatLevel: 4,
    description: 'A six-legged reptile with a single spiraling horn of polished bone. Its gaze causes progressive petrification.',
    traits: ['Petrifying gaze', 'Six-legged', 'Territorial', 'Apex predator'],
    imageColor: '#5a4a3d',
    lore: 'Spirehorn Basilisks are solitary apex predators that claim territories spanning dozens of square miles. Their petrification is progressive rather than instantaneous — initial exposure causes numbness and rigidity, with full stone transformation requiring sustained eye contact of several seconds. Basilisk-stone (petrified remains) is a valued construction material, leading to morally dubious harvesting operations.',
    encounters: 15,
  },
  {
    id: 'c-031',
    name: 'Wisplight',
    classification: 'Fey',
    habitat: ['Swamp', 'Forest', 'Coastal'],
    threatLevel: 1,
    description: 'A floating orb of gentle light that drifts through marshlands. Follows travelers but keeps a respectful distance.',
    traits: ['Flying', 'Light source', 'Curious', 'Guide'],
    imageColor: '#b5d4a8',
    lore: 'Wisplights are the most commonly encountered fey creatures and the least understood. They appear to be sentient but communicate only through variations in brightness and color. Folklore claims they guide lost travelers to safety, and statistical analysis of rescue reports supports this — people followed by Wisplights are recovered faster and in better condition than those who were not.',
    encounters: 1247,
  },
  {
    id: 'c-032',
    name: 'Ironclad Scorpion',
    classification: 'Monstrosity',
    habitat: ['Desert', 'Underground'],
    threatLevel: 3,
    description: 'A dog-sized scorpion with a metallic exoskeleton and twin stingers. Its pincers can shear through chain mail.',
    traits: ['Venomous', 'Heavily armored', 'Burrower', 'Ambush predator'],
    imageColor: '#7a6b5a',
    lore: 'Ironclad Scorpions are the reason desert travelers wear greaves. They burrow just beneath the sand surface and strike at vibrations, making standard walking extremely hazardous in their territories. Their metallic exoskeleton is a natural alloy of iron and chitin that has no artificial equivalent. Several armorers have attempted to cultivate them for materials, with uniformly disastrous results.',
    encounters: 44,
  },
]

// ---------------------------------------------------------------------------
// Derived filter options
// ---------------------------------------------------------------------------

export const allClassifications: Classification[] = [
  ...new Set(creatures.map((c) => c.classification)),
].sort()

export const allHabitats: Habitat[] = [
  ...new Set(creatures.flatMap((c) => c.habitat)),
].sort()

export const allTraits: string[] = [
  ...new Set(creatures.flatMap((c) => c.traits)),
].sort()

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

export const sortOptions = [
  { id: 'name-asc', label: 'Name A-Z' },
  { id: 'name-desc', label: 'Name Z-A' },
  { id: 'threat-asc', label: 'Threat (Low-High)' },
  { id: 'threat-desc', label: 'Threat (High-Low)' },
  { id: 'encounters-desc', label: 'Most Encountered' },
  { id: 'encounters-asc', label: 'Least Encountered' },
]
