import type { WebStatItem, TeamMember, ServiceItem } from '@amulet-laboratories/rig'

export interface Property {
  id: string
  title: string
  neighborhood: string
  address: string
  beds: number
  baths: number
  sqft: string
  price: string
  pricePerSqft: number
  mls: string
  propertyTax: string
  tag: string
  tagType: 'new' | 'featured' | 'open-house' | 'reduced' | 'pending' | ''
  description: string
  img: string
  alt: string
  yearBuilt: string
  lotSize: string
  features: string[]
  agentId: string
  images: string[]
  dom: number
  hasVirtualTour: boolean
}

export type TidemarkAgent = TeamMember & {
  years: number
  phone: string
  email: string
  specialties: string[]
}

export type TidemarkNeighborhood = ServiceItem & {
  img: string
  imgAlt: string
  medianPrice: string
  medianPricePerSqft: string
  schoolDistrict: string
  schoolRating: string
  walkability: string
  amenities: string[]
  lifestyleTags: string[]
}

export interface Testimonial {
  quote: string
  name: string
  detail: string
}

export interface SoldProperty {
  id: string
  title: string
  neighborhood: string
  beds: number
  baths: number
  sqft: string
  soldPrice: string
  soldDate: string
  img: string
  agentId: string
}

export const heroStats: WebStatItem[] = [
  { value: '20+', label: 'Years' },
  { value: '150+', label: 'Homes Sold' },
  { value: '4', label: 'Neighborhoods' },
  { value: '99%', label: 'Client Satisfaction' },
]

export const properties: Property[] = [
  {
    id: 'driftwood-cottage',
    title: 'Driftwood Cottage',
    neighborhood: 'Dune Quarter',
    address: '34 Dune Road',
    beds: 3,
    baths: 2,
    sqft: '1,840',
    price: '$725,000',
    pricePerSqft: 394,
    mls: 'BCMLS-2026-1042',
    propertyTax: '$6,530/yr',
    tag: 'New Listing',
    tagType: 'new',
    description:
      'Cedar-shake cottage a half block from the beach path. Updated kitchen, south-facing deck, detached studio workshop.',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    alt: 'Exterior of Driftwood Cottage, a cedar-shake home with a south-facing deck in the Dune Quarter',
    yearBuilt: '1978',
    lotSize: '0.18 acres',
    features: [
      'Updated kitchen (2024)',
      'South-facing deck',
      'Detached studio workshop',
      'Cedar-shake siding',
      'Half block to beach',
      'New roof (2022)',
    ],
    agentId: 'dana',
    dom: 3,
    hasVirtualTour: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'harborview-loft',
    title: 'Harborview Loft',
    neighborhood: 'Old Harbor',
    address: '17 Cannery Row, Unit 4B',
    beds: 2,
    baths: 1,
    sqft: '1,120',
    price: '$485,000',
    pricePerSqft: 433,
    mls: 'BCMLS-2026-0987',
    propertyTax: '$4,370/yr',
    tag: 'Open House Mar 28',
    tagType: 'open-house',
    description:
      'Converted warehouse loft overlooking the marina. Exposed timber trusses, original plank floors, floor-to-ceiling windows facing the harbor.',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    alt: 'Open-plan loft interior with exposed timber trusses and harbor views at 17 Cannery Row',
    yearBuilt: '1942 (converted 2018)',
    lotSize: 'N/A (condo)',
    features: [
      'Exposed timber trusses',
      'Original plank floors',
      'Floor-to-ceiling harbor windows',
      'In-unit laundry',
      'One deeded parking space',
      'Pet-friendly building',
    ],
    agentId: 'dana',
    dom: 18,
    hasVirtualTour: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'cedar-ridge-estate',
    title: 'Cedar Ridge Estate',
    neighborhood: 'Ridgeline',
    address: '805 Pine Ridge Road',
    beds: 5,
    baths: 4,
    sqft: '3,600',
    price: '$1,250,000',
    pricePerSqft: 347,
    mls: 'BCMLS-2025-0841',
    propertyTax: '$11,250/yr',
    tag: 'Price Reduced',
    tagType: 'reduced',
    description:
      'Custom-built home on 2.4 acres with unobstructed ocean views. Chef kitchen, wine cellar, three-car garage, and old-growth cedars.',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    alt: 'Cedar Ridge Estate, a large custom home surrounded by old-growth cedars on Ridgeline',
    yearBuilt: '2008',
    lotSize: '2.4 acres',
    features: [
      'Chef kitchen with Viking range',
      'Temperature-controlled wine cellar',
      'Three-car heated garage',
      'Unobstructed ocean views',
      'Old-growth cedar grove',
      'Whole-house generator',
    ],
    agentId: 'dana',
    dom: 62,
    hasVirtualTour: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'fogwatch-retreat',
    title: 'Fogwatch Retreat',
    neighborhood: 'Ridgeline',
    address: '412 Ridgeline Drive',
    beds: 4,
    baths: 3,
    sqft: '2,800',
    price: '$985,000',
    pricePerSqft: 352,
    mls: 'BCMLS-2026-1018',
    propertyTax: '$8,865/yr',
    tag: 'Featured',
    tagType: 'featured',
    description:
      'A-frame meets modern on the ridge. Vaulted great room, wraparound deck, and 180-degree views from Heceta Head to the harbor.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    alt: 'Modern A-frame home with wraparound deck and panoramic ocean views on Ridgeline Drive',
    yearBuilt: '2015',
    lotSize: '0.8 acres',
    features: [
      'Vaulted great room with 24-ft ceilings',
      'Wraparound deck',
      '180-degree ocean views',
      'Radiant-heated floors',
      'EV charging station',
      'Native landscaping',
    ],
    agentId: 'dana',
    dom: 24,
    hasVirtualTour: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'seagrass-flat',
    title: 'Seagrass Flat',
    neighborhood: 'Old Harbor',
    address: '9 Harbor Street, Unit 2',
    beds: 1,
    baths: 1,
    sqft: '780',
    price: '$345,000',
    pricePerSqft: 442,
    mls: 'BCMLS-2026-0953',
    propertyTax: '$3,105/yr',
    tag: '',
    tagType: '',
    description:
      'Ground-floor flat in the heart of Old Harbor. Walk to everything — the brewery, the farmers market, the marina. Ideal starter or rental.',
    img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=600&q=80',
    alt: 'Compact ground-floor flat with warm finishes in the Old Harbor district',
    yearBuilt: '1960 (renovated 2020)',
    lotSize: 'N/A (condo)',
    features: [
      'Walk to brewery and marina',
      'Renovated kitchen and bath',
      'In-unit washer/dryer',
      'One parking space',
      'Low HOA ($185/mo)',
      'Strong rental history',
    ],
    agentId: 'dana',
    dom: 31,
    hasVirtualTour: false,
    images: [
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'salal-creek-farmstead',
    title: 'Salal Creek Farmstead',
    neighborhood: 'Salal Creek',
    address: '2800 Creek Road',
    beds: 3,
    baths: 2,
    sqft: '2,100',
    price: '$680,000',
    pricePerSqft: 324,
    mls: 'BCMLS-2025-0912',
    propertyTax: '$6,120/yr',
    tag: '',
    tagType: '',
    description:
      'Updated farmhouse on a quiet acre along the creek. Original wood floors, new roof, garden beds, and a barn converted to a workshop.',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    alt: 'Salal Creek Farmstead, a white farmhouse on a wooded acre with a converted barn workshop',
    yearBuilt: '1964 (updated 2023)',
    lotSize: '1.0 acre',
    features: [
      'Original hardwood floors',
      'New roof (2023)',
      'Raised garden beds',
      'Barn converted to workshop',
      'Creek frontage',
      'Walkable to Salal Creek Elementary',
    ],
    agentId: 'dana',
    dom: 45,
    hasVirtualTour: false,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'cannery-penthouse',
    title: 'Cannery Penthouse',
    neighborhood: 'Old Harbor',
    address: '21 Cannery Row, PH-1',
    beds: 3,
    baths: 2,
    sqft: '1,900',
    price: '$875,000',
    pricePerSqft: 461,
    mls: 'BCMLS-2026-1035',
    propertyTax: '$7,875/yr',
    tag: 'Pending',
    tagType: 'pending',
    description:
      'Top-floor unit in the renovated Briar Cove Cannery. Private rooftop terrace, steel-beam ceilings, radiant-heated floors throughout.',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    alt: 'Cannery Penthouse interior with steel-beam ceilings and modern finishes in Old Harbor',
    yearBuilt: '1938 (converted 2019)',
    lotSize: 'N/A (condo)',
    features: [
      'Private rooftop terrace',
      'Steel-beam ceilings',
      'Radiant-heated floors',
      'Two deeded parking spaces',
      'Secured building entry',
      'Marina and harbor views',
    ],
    agentId: 'dana',
    dom: 8,
    hasVirtualTour: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'keeper-cottage',
    title: 'Keeper Cottage',
    neighborhood: 'Dune Quarter',
    address: '1 Lighthouse Way',
    beds: 2,
    baths: 1,
    sqft: '1,050',
    price: '$520,000',
    pricePerSqft: 495,
    mls: 'BCMLS-2026-0968',
    propertyTax: '$4,680/yr',
    tag: '',
    tagType: '',
    description:
      'Former lighthouse keeper quarters, fully restored. Stone foundation, original hardware, private path to the point. One of a kind.',
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    alt: 'Keeper Cottage, a restored stone-foundation home near the lighthouse in Dune Quarter',
    yearBuilt: '1912 (restored 2021)',
    lotSize: '0.12 acres',
    features: [
      'Stone foundation (original)',
      'Restored period hardware',
      'Private path to lighthouse point',
      'New plumbing and electrical',
      'Wood-burning fireplace',
      'National Register eligible',
    ],
    agentId: 'dana',
    dom: 29,
    hasVirtualTour: false,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'ridgeline-modern',
    title: 'Ridgeline Modern',
    neighborhood: 'Ridgeline',
    address: '620 Pine Ridge Road',
    beds: 4,
    baths: 3,
    sqft: '3,200',
    price: '$1,150,000',
    pricePerSqft: 359,
    mls: 'BCMLS-2026-1048',
    propertyTax: '$10,350/yr',
    tag: 'New Listing',
    tagType: 'new',
    description:
      'Clean-line contemporary with floor-to-ceiling glass, white oak interiors, and a heated lap pool. Minutes from Compass Animal Hospital.',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    alt: 'Ridgeline Modern, a contemporary glass-and-wood home with a heated pool on Pine Ridge Road',
    yearBuilt: '2022',
    lotSize: '0.6 acres',
    features: [
      'Floor-to-ceiling glass walls',
      'White oak throughout',
      'Heated saltwater lap pool',
      'Smart home system',
      'Three-car garage with EV charging',
      'Drought-tolerant landscaping',
    ],
    agentId: 'dana',
    dom: 5,
    hasVirtualTour: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed9a332d5a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
  },
]

export const soldProperties: SoldProperty[] = [
  {
    id: 'beacon-house',
    title: 'Beacon House',
    neighborhood: 'Dune Quarter',
    beds: 4,
    baths: 3,
    sqft: '2,400',
    soldPrice: '$905,000',
    soldDate: 'Feb 2026',
    img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=600&q=80',
    agentId: 'dana',
  },
  {
    id: 'harbor-row-3a',
    title: 'Harbor Row 3A',
    neighborhood: 'Old Harbor',
    beds: 2,
    baths: 2,
    sqft: '1,340',
    soldPrice: '$510,000',
    soldDate: 'Jan 2026',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    agentId: 'dana',
  },
  {
    id: 'creekside-ranch',
    title: 'Creekside Ranch',
    neighborhood: 'Salal Creek',
    beds: 3,
    baths: 2,
    sqft: '1,780',
    soldPrice: '$625,000',
    soldDate: 'Dec 2025',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
    agentId: 'dana',
  },
]

export const agents: TidemarkAgent[] = [
  {
    id: 'dana',
    name: 'Dana Whitfield',
    role: 'Licensed Broker',
    years: 20,
    phone: '(541) 555-0189',
    email: 'dana@tidemarkre.com',
    specialties: ['Luxury homes', 'Waterfront', 'Land sales', 'Relocations'],
    bio: 'Born and raised on the Oregon coast. Dana founded Tidemark Realty in 2006 after fifteen years in Portland commercial real estate. She knows every neighborhood, every school district, and every street in Briar Cove — and works with buyers and sellers across all four neighborhoods.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
]

export const agent: TidemarkAgent = agents[0]!

export const neighborhoods: TidemarkNeighborhood[] = [
  {
    id: 'old-harbor',
    title: 'Old Harbor',
    description:
      'The original waterfront district. Working fishing boats, the renovated Cannery building, Undertow Brewing, and the Saturday farmers market all sit within a few blocks. Walkable and lively year-round.',
    img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Old Harbor waterfront with fishing boats and the renovated Cannery building',
    medianPrice: '$520,000',
    medianPricePerSqft: '$445',
    schoolDistrict: 'Briar Cove Elementary (K-5)',
    schoolRating: '7/10',
    walkability: 'Very Walkable',
    amenities: [
      'Undertow Brewing',
      'Saturday Farmers Market',
      'Marina & Boat Launch',
      'Cannery Shops',
    ],
    lifestyleTags: ['Walkable', 'Waterfront', 'Nightlife'],
  },
  {
    id: 'ridgeline',
    title: 'Ridgeline',
    description:
      'Elevated lots on the coastal bluffs with panoramic ocean views. Newer construction on larger parcels. Close to Compass Animal Hospital and Salal Creek Elementary.',
    img: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Panoramic ocean view from the Ridgeline bluffs above Briar Cove',
    medianPrice: '$1,050,000',
    medianPricePerSqft: '$352',
    schoolDistrict: 'Salal Creek Elementary (K-5)',
    schoolRating: '8/10',
    walkability: 'Car-Dependent',
    amenities: [
      'Compass Animal Hospital',
      'Ridge Trail',
      'Cedar Point Overlook',
      'Briar Cove Golf Club',
    ],
    lifestyleTags: ['Views', 'Privacy', 'Newer Homes'],
  },
  {
    id: 'salal-creek',
    title: 'Salal Creek',
    description:
      'A wooded neighborhood along the creek, ten minutes from downtown. Family-friendly and walkable to both schools and the Briar Cove Public Library.',
    img: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Tree-lined path along Salal Creek in the residential neighborhood',
    medianPrice: '$660,000',
    medianPricePerSqft: '$324',
    schoolDistrict: 'Salal Creek Elementary (K-5)',
    schoolRating: '8/10',
    walkability: 'Somewhat Walkable',
    amenities: [
      'Briar Cove Public Library',
      'Creek Trail',
      'Salal Creek Elementary',
      'Community Center',
    ],
    lifestyleTags: ['Family-Friendly', 'Quiet', 'Wooded'],
  },
  {
    id: 'dune-quarter',
    title: 'Dune Quarter',
    description:
      'Beach access from nearly every block. A mix of year-round homes and vacation rentals. The Lantern House sits at the north end, and Salt & Signal general store is a short walk south.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    imgAlt: 'Sandy beach path through the dunes in the Dune Quarter neighborhood',
    medianPrice: '$640,000',
    medianPricePerSqft: '$420',
    schoolDistrict: 'Briar Cove Elementary (K-5)',
    schoolRating: '7/10',
    walkability: 'Bikeable',
    amenities: ['Beach Access', 'The Lantern House', 'Salt & Signal', 'Lighthouse Point'],
    lifestyleTags: ['Beach', 'Vacation Rentals', 'Character Homes'],
  },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'Dana found us an off-market cottage in Dune Quarter, two blocks from the beach and under $700k. We were moved in within sixty days.',
    name: 'The Hendersons',
    detail: 'Buyers · Dune Quarter · $680k',
  },
  {
    quote:
      'Dana sold our loft in Old Harbor in eleven days, $30k above asking. Her knowledge of the harbor district is unmatched.',
    name: 'Jess & Tom Nakamura',
    detail: 'Sellers · Old Harbor · $515k',
  },
  {
    quote:
      'We relocated from Portland with no idea where to start. Dana showed us every neighborhood in the $600k\u2013$800k range, every school, every coffee shop. She made Salal Creek feel like home before we even had keys.',
    name: 'The Reyes Family',
    detail: 'Buyers · Salal Creek · $660k',
  },
]

export const marketStats = [
  { label: 'Median Sale Price', value: '$715,000', change: '+4.4% YoY' },
  { label: 'Avg. Days on Market', value: '34', change: '-4 days YoY' },
  { label: 'Sale-to-List Ratio', value: '99.1%', change: '+0.6% YoY' },
  { label: 'Homes Sold (TTM)', value: '94', change: '' },
]

export interface QuarterlyData {
  quarter: string
  median: string
  sold: number
  avgDom: number
  saleToList: string
}

export const quarterly: QuarterlyData[] = [
  { quarter: 'Q2 2025', median: '$672,000', sold: 24, avgDom: 39, saleToList: '98.1%' },
  { quarter: 'Q3 2025', median: '$690,000', sold: 26, avgDom: 35, saleToList: '99.3%' },
  { quarter: 'Q4 2025', median: '$710,000', sold: 19, avgDom: 36, saleToList: '99.0%' },
  { quarter: 'Q1 2026', median: '$715,000', sold: 25, avgDom: 34, saleToList: '99.1%' },
]

export const marketInterpretation = {
  headline: 'Continued appreciation, tightening inventory',
  summary:
    'Briar Cove remains a moderate seller\u2019s market through Q1 2026. Median prices rose 4.4% year-over-year to $715,000, and the average sale-to-list ratio of 99.1% means most homes sell at or above asking. Days on market dropped to 34 \u2014 four fewer than last year \u2014 signaling sustained buyer demand despite higher rates.',
  buyerTip:
    'Homes priced under $725k in Old Harbor and Salal Creek see the most competition. Get pre-approved and be ready to act within 48 hours of a new listing.',
  sellerTip:
    'Well-prepared listings on Ridgeline and Dune Quarter are averaging 12 fewer days on market than unprepared ones. Professional photography and a pre-listing inspection consistently outperform.',
}

export const tagVariants: Record<string, string> = {
  new: 'success',
  featured: 'info',
  'open-house': 'primary',
  reduced: 'accent',
  pending: 'muted',
}
