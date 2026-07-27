import type { GalleryItem } from '@amulet-laboratories/rig'

export interface Exhibition extends GalleryItem {
  year: string
  count: number
  medium: string
  venue: string
  available: boolean
}

export const exhibitions: Exhibition[] = [
  {
    id: 'littoral-drift',
    title: 'Littoral Drift',
    year: '2025',
    count: 12,
    medium: 'Mixed media on panel',
    venue: 'Brine Gallery, Portland, OR',
    available: true,
    description:
      'Wave erosion patterns mapped onto geological survey data collected at three sites along the Briar Cove shoreline. Exhibited at Brine Gallery, Portland.',
    img: '',
    imgAlt: 'Littoral Drift series — mixed media on panel depicting wave erosion patterns',
  },
  {
    id: 'signal-fires',
    title: 'Signal Fires',
    year: '2024',
    count: 8,
    medium: 'Oil on linen',
    venue: 'Puget Sound Arts Council, Seattle, WA (group)',
    available: true,
    description:
      'Night paintings of controlled burns along the Oregon coast. Palette restricted to cadmium red, lamp black, and unbleached titanium.',
    img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Signal Fires series — oil on linen, night paintings of coastal controlled burns',
  },
  {
    id: 'salt-archive',
    title: 'Salt Archive',
    year: '2023',
    count: 15,
    medium: 'Encaustic and found material',
    venue: 'Tideline Projects, Briar Cove, OR (two-person)',
    available: false,
    description:
      'Preservation and decay in tidal objects — shell fragments, rope, rusted hardware collected from the Old Harbor breakwater.',
    img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Salt Archive series — encaustic and found tidal objects',
  },
  {
    id: 'fog-studies',
    title: 'Fog Studies',
    year: '2022',
    count: 6,
    medium: 'Watercolor on Japanese paper',
    venue: 'MFA Thesis Exhibition, PNCA, Portland, OR',
    available: false,
    description:
      'Atmospheric conditions as portraiture. Each piece painted on-site in a single session during morning fog on the Dune Quarter bluffs.',
    img: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Fog Studies series — watercolor atmospheric conditions painted on-site',
  },
  {
    id: 'undertow-series',
    title: 'Undertow',
    year: '2021',
    count: 9,
    medium: 'Charcoal and ink on paper',
    venue: 'Briar Cove Public Library (artist-in-residence)',
    available: true,
    description:
      'Large-scale drawings of wave mechanics — the invisible forces pulling beneath the surface. Some works measure over six feet.',
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Undertow series — large charcoal and ink drawings of wave mechanics',
  },
]

export const exhibitionStats = [
  { value: '3', label: 'Solo Exhibitions' },
  { value: '50+', label: 'Works in Series' },
  { value: '2022', label: 'MFA, PNCA' },
  { value: '2021', label: 'Practice Since' },
]

export const press = [
  {
    source: 'Portland Monthly',
    quote: 'Lys works at the intersection of landscape and memory, finding poetry in erosion.',
  },
  {
    source: 'Oregon ArtsWatch',
    quote: 'The strongest voice to emerge from the southern coast in a decade.',
  },
  {
    source: 'Brine Gallery Catalog',
    quote: 'Maren Lys paints what the sea leaves behind — and what it takes.',
  },
]

export interface CVEntry {
  year: string
  text: string
}

export const cvEducation: CVEntry[] = [
  {
    year: '2022',
    text: 'MFA, Pacific Northwest College of Art, Portland, OR (thesis: Littoral Systems)',
  },
  { year: '2020', text: 'BFA, University of Oregon, Eugene, OR' },
]

export const cvSolo: CVEntry[] = [
  { year: '2025', text: 'Littoral Drift, Brine Gallery, Portland, OR' },
  { year: '2023', text: 'Salt Archive, Tideline Projects, Briar Cove, OR (two-person)' },
  { year: '2021', text: 'Undertow, Briar Cove Public Library (artist-in-residence)' },
]

export const cvGroup: CVEntry[] = [
  {
    year: '2024',
    text: 'Pacific Northwest Emerging Artists, Puget Sound Arts Council, Seattle, WA',
  },
  { year: '2022', text: 'New Landscapes, Disjecta Contemporary Art Center, Portland, OR' },
]

export const cvResidencies: CVEntry[] = [
  { year: '2024', text: 'Sitka Center for Art and Ecology, Otis, OR' },
  { year: '2021', text: 'Briar Cove Public Library, Briar Cove, OR' },
]

export const cvAwards: CVEntry[] = [
  { year: '2023', text: 'Oregon Arts Commission Individual Artist Fellowship' },
  { year: '2025', text: 'Littoral Drift catalog published by Brine Editions' },
]

export interface UpcomingShow {
  title: string
  venue: string
  dates: string
  description: string
  type: 'solo' | 'group'
}

export const upcomingShows: UpcomingShow[] = [
  {
    title: 'Littoral Drift II — New Work',
    venue: 'Brine Gallery, Portland, OR',
    dates: 'Sep 12 – Nov 3, 2026',
    description:
      'New mixed media works extending the Littoral Drift series into three dimensions. Panel, cast plaster, and tidal sediment. Opening reception September 12, 6–9 PM.',
    type: 'solo',
  },
  {
    title: 'Coast/Interior',
    venue: 'Jordan Schnitzer Museum of Art, Eugene, OR',
    dates: 'Jan 2027',
    description:
      "Group exhibition exploring the relationship between Oregon's coastal and interior landscapes. Curated by Dr. Amanda Park.",
    type: 'group',
  },
]
