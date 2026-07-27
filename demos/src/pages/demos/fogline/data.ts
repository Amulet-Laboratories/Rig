import type {
  WebStatItem,
  TeamMember,
  MenuItem,
  FeatureItem,
  ServiceItem,
  GalleryItem,
  ContactFormField,
} from '@amulet-laboratories/rig'

// ── Coffee offerings ──

export interface Coffee {
  id: string
  name: string
  origin: string
  region: string
  process: string
  roast: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark'
  notes: string
  price: string
  weight: string
  category: 'Single Origin' | 'Blend' | 'Seasonal'
  tag: string
  img: string
}

export const coffees: Coffee[] = [
  {
    id: 'huehuetenango',
    name: 'Huehuetenango',
    origin: 'Guatemala',
    region: 'Huehuetenango Highlands',
    process: 'Washed',
    roast: 'Medium',
    notes: 'Dark chocolate, orange peel, brown sugar',
    price: '$19',
    weight: '12oz',
    category: 'Single Origin',
    tag: 'Staff Pick',
    img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'yirgacheffe',
    name: 'Yirgacheffe',
    origin: 'Ethiopia',
    region: 'Gedeo Zone',
    process: 'Natural',
    roast: 'Light',
    notes: 'Blueberry, jasmine, honey',
    price: '$22',
    weight: '12oz',
    category: 'Single Origin',
    tag: 'Limited',
    img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'nariño',
    name: 'Nariño',
    origin: 'Colombia',
    region: 'Nariño Department',
    process: 'Washed',
    roast: 'Medium',
    notes: 'Caramel, red apple, walnut',
    price: '$18',
    weight: '12oz',
    category: 'Single Origin',
    tag: '',
    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sidama',
    name: 'Sidama',
    origin: 'Ethiopia',
    region: 'Sidama Zone',
    process: 'Washed',
    roast: 'Light',
    notes: 'Lemon, black tea, raw sugar',
    price: '$21',
    weight: '12oz',
    category: 'Single Origin',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'antigua',
    name: 'Antigua',
    origin: 'Guatemala',
    region: 'Antigua Valley',
    process: 'Washed',
    roast: 'Medium-Dark',
    notes: 'Cocoa, smoky vanilla, toasted almond',
    price: '$20',
    weight: '12oz',
    category: 'Single Origin',
    tag: '',
    img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'harbor-blend',
    name: 'Harbor Blend',
    origin: 'Guatemala / Colombia',
    region: 'Multi-region',
    process: 'Washed',
    roast: 'Medium',
    notes: 'Chocolate, hazelnut, smooth finish',
    price: '$16',
    weight: '12oz',
    category: 'Blend',
    tag: 'Best Seller',
    img: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fogline-espresso',
    name: 'Fogline Espresso',
    origin: 'Ethiopia / Guatemala',
    region: 'Multi-region',
    process: 'Mixed',
    roast: 'Medium-Dark',
    notes: 'Toffee, dark cherry, bittersweet cocoa',
    price: '$17',
    weight: '12oz',
    category: 'Blend',
    tag: '',
    img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'morning-fog',
    name: 'Morning Fog',
    origin: 'Colombia / Ethiopia',
    region: 'Multi-region',
    process: 'Washed',
    roast: 'Light',
    notes: 'Citrus, stone fruit, floral sweetness',
    price: '$17',
    weight: '12oz',
    category: 'Blend',
    tag: '',
    img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'winter-solstice',
    name: 'Winter Solstice',
    origin: 'Guatemala / Colombia',
    region: 'Multi-region',
    process: 'Natural / Washed',
    roast: 'Dark',
    notes: 'Molasses, dried fig, clove, cedar',
    price: '$18',
    weight: '12oz',
    category: 'Seasonal',
    tag: 'Seasonal',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    origin: 'Ethiopia',
    region: 'Guji / Yirgacheffe',
    process: 'Natural',
    roast: 'Light',
    notes: 'Strawberry, chamomile, raw honey',
    price: '$23',
    weight: '10oz',
    category: 'Seasonal',
    tag: 'Seasonal',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'cold-brew-concentrate',
    name: 'Cold Brew Concentrate',
    origin: 'Harbor Blend base',
    region: 'Multi-region',
    process: 'Immersion brewed',
    roast: 'Medium',
    notes: 'Rich, smooth, low acid. Dilute 1:1.',
    price: '$14',
    weight: '16oz',
    category: 'Blend',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'decaf-nariño',
    name: 'Decaf Nariño',
    origin: 'Colombia',
    region: 'Nariño Department',
    process: 'Swiss Water',
    roast: 'Medium',
    notes: 'Milk chocolate, toasted grain, gentle',
    price: '$19',
    weight: '12oz',
    category: 'Single Origin',
    tag: '',
    img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=400&q=80',
  },
]

export const coffeeCategories = ['All', 'Single Origin', 'Blend', 'Seasonal']

export const tagVariants: Record<string, string> = {
  New: 'primary',
  'Staff Pick': '',
  Limited: 'warning',
  'Best Seller': 'success',
  Seasonal: 'accent',
}

// ── Reviews ──

export interface Review {
  name: string
  location: string
  text: string
}

export const reviews: Review[] = [
  {
    name: 'Nora K.',
    location: 'Portland, OR',
    text: 'The Yirgacheffe is the best single origin I have ever had outside of Addis Ababa. Elena clearly knows her farmers.',
  },
  {
    name: 'Chris & Dana',
    location: 'Eugene, OR',
    text: 'We subscribe to the Harbor Blend and it arrives like clockwork. Consistent, clean, and our mornings depend on it.',
  },
  {
    name: 'A. Whitfield',
    location: 'Briar Cove, OR',
    text: 'I started coming for the espresso and stayed for the community. The tasting bar on Saturday mornings is the best thing in town.',
  },
]

// ── Team ──

export const team: TeamMember[] = [
  {
    id: 'elena-campos',
    name: 'Elena Campos',
    role: 'Owner & Head Roaster',
    bio: 'Left restaurant consulting in Portland in 2019 to pursue a decade-long obsession with coffee roasting. Home-roasted since 2012. Has visited origin farms in Guatemala, Ethiopia, and Colombia.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'kai-nakamura',
    name: 'Kai Nakamura',
    role: 'Production Roaster',
    bio: 'Five years at Stumptown before moving to the coast. Manages the daily roast schedule and quality control. Can identify roast level by sound alone.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ada-whitfield',
    name: 'Ada Whitfield',
    role: 'Tasting Bar Manager',
    bio: 'Third-generation Briar Cove. Former barista at Heart Coffee in Portland. Runs the tasting bar, trains seasonal staff, and curates the brew-at-home gear selection.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'marco-reyes',
    name: 'Marco Reyes',
    role: 'Green Buyer',
    bio: 'Travels to origin twice a year to maintain direct relationships with producers. Fluent in Spanish. Formerly with Counter Culture Coffee in Durham, NC.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
]

// ── Stats ──

export const roasteryStats: WebStatItem[] = [
  { value: '2019', label: 'Year founded' },
  { value: '1974', label: 'Probat vintage' },
  { value: '3', label: 'Origin countries' },
  { value: '12', label: 'Direct farm partners' },
]

// ── Values / approach ──

export const values: ServiceItem[] = [
  {
    id: 'direct-trade',
    title: 'Direct trade',
    description:
      'We buy green coffee directly from farm cooperatives, paying 40-60% above commodity price. No middlemen, no mystery.',
  },
  {
    id: 'small-batch',
    title: 'Small-batch roasting',
    description:
      'Every batch goes through our 1974 Probat UG-22. Twelve kilos at a time, hand-monitored from first crack to finish.',
  },
  {
    id: 'transparent',
    title: 'Transparent sourcing',
    description:
      'Every bag lists the farm, the region, the process, and the roast date. We publish our green pricing annually.',
  },
]

// ── Wholesale tiers ──

export interface WholesaleTier {
  name: string
  minOrder: string
  discount: string
  features: string[]
}

export const wholesaleTiers: WholesaleTier[] = [
  {
    name: 'Cafe Partner',
    minOrder: '20 lbs/month',
    discount: '25% off retail',
    features: [
      'Dedicated account rep',
      'Free cupping sessions',
      'Menu consultation',
      'Co-branded bags available',
    ],
  },
  {
    name: 'Restaurant',
    minOrder: '10 lbs/month',
    discount: '20% off retail',
    features: ['Flexible ordering', 'Staff training session', 'Seasonal rotation suggestions'],
  },
  {
    name: 'Office & Retail',
    minOrder: '5 lbs/month',
    discount: '15% off retail',
    features: ['Monthly delivery', 'Branded shelf talkers', 'New release first access'],
  },
]

export const wholesalePartners: (ServiceItem & { type: string; since: string })[] = [
  {
    id: 'undertow',
    title: 'Undertow Brewing Co.',
    type: 'Espresso program',
    description: 'Full espresso bar program with staff training and seasonal menu rotation.',
    since: '2021',
  },
  {
    id: 'lantern-house',
    title: 'The Lantern House',
    type: 'In-room & breakfast service',
    description: 'In-room French press service and breakfast buffet coffee for all guest rooms.',
    since: '2021',
  },
  {
    id: 'library',
    title: 'Briar Cove Public Library',
    type: 'Staff kitchen & events',
    description: 'Staff kitchen drip service and catering for author talks and community events.',
    since: '2022',
  },
  {
    id: 'aldric',
    title: 'Aldric, Pace & Wynn LLP',
    type: 'Office drip program',
    description:
      'Daily office drip service with rotating single origins and a dedicated brew station.',
    since: '2023',
  },
]

// ── Timeline ──

export const timeline = [
  { year: '2012', event: 'Elena begins home-roasting in her Portland apartment' },
  { year: '2015', event: 'First trip to Guatemala — visits Huehuetenango farms' },
  { year: '2017', event: 'Finds a decommissioned 1974 Probat UG-22 in Astoria' },
  { year: '2019', event: 'Signs lease on converted net-mending shed, Harbor Road' },
  { year: '2019', event: 'Fogline opens weeks before the pandemic — pivots to mail-order' },
  { year: '2021', event: 'Undertow and Lantern House become first wholesale accounts' },
  { year: '2023', event: 'Kai and Marco join; roasting capacity doubles' },
  { year: '2024', event: 'Tasting bar opens on weekends — Ada Whitfield manages' },
]

// ── Tasting bar menu ──

export const barMenu: MenuItem[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Double shot, Fogline Espresso blend',
    price: '$4',
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Equal parts espresso and steamed milk',
    price: '$5',
  },
  {
    id: 'pour-over',
    name: 'Pour Over',
    description: 'V60 — choose any single origin',
    price: '$6',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    description: 'Harbor Blend concentrate, served over ice',
    price: '$5',
  },
  {
    id: 'cupping-flight',
    name: 'Cupping Flight',
    description: 'Three single origins, side by side',
    price: '$8',
  },
  {
    id: 'drip',
    name: 'Drip Coffee',
    description: 'Rotating single origin, brewed fresh',
    price: '$3',
  },
]

// ── Subscription features ──

export const subscriptionFeatures: FeatureItem[] = [
  { id: 'sub-discount', text: '10% off every bag' },
  { id: 'sub-shipping', text: 'Free shipping on every delivery' },
  { id: 'sub-pause', text: 'Pause, skip, or cancel anytime' },
  { id: 'sub-notes', text: 'Roaster notes included with each shipment' },
]

// ── Gallery ──

export const roasteryGallery: GalleryItem[] = [
  {
    id: 'gallery-roaster',
    title: 'The Probat',
    description:
      'Our 1974 Probat UG-22, restored over two years and moved to Briar Cove on a flatbed. Twelve kilos per batch, hand-monitored from first crack to finish.',
    img: 'https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Vintage Probat coffee roaster in the Fogline roastery',
  },
  {
    id: 'gallery-green',
    title: 'Green Selection',
    description:
      'Marco evaluates every lot before it enters our roastery. We cup samples from each harvest and only buy what meets our standards for sweetness, clarity, and complexity.',
    img: 'https://images.unsplash.com/photo-1447933601403-56dc2338178e?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Green coffee beans being sorted at the Fogline lab',
  },
  {
    id: 'gallery-bar',
    title: 'The Tasting Bar',
    description:
      'Eight stools, a three-group La Marzocco, and a view of the fishing fleet. The bar runs along the harbor-facing wall of the converted net shed.',
    img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Fogline tasting bar with harbor view',
  },
]

export const spaceGallery: GalleryItem[] = [
  {
    id: 'space-exterior',
    title: 'Harbor Road',
    description:
      'The converted net-mending shed at 18 Harbor Road. Look for the copper roasting chimney.',
    img: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Fogline Coffee Roasters exterior on Harbor Road',
  },
  {
    id: 'space-interior',
    title: 'Inside the Shed',
    description:
      'Original timber frame, concrete floors, and sliding barn doors. The Probat sits where the nets used to hang.',
    img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Interior of the Fogline roastery and tasting bar',
  },
  {
    id: 'space-roasting',
    title: 'Roast Day',
    description:
      'We roast Tuesday through Thursday. If you visit during roast hours you will smell it before you see it.',
    img: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=600&q=80',
    imgAlt: 'Fresh coffee being roasted at Fogline',
  },
]

// ── Contact form fields ──

export const contactFields: ContactFormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    autocomplete: 'name',
    maxlength: 200,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    autocomplete: 'email',
    maxlength: 320,
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'Wholesale inquiry, feedback, etc.',
    maxlength: 200,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
    placeholder: 'Tell us what is on your mind.',
    maxlength: 2000,
    rows: 4,
  },
]
