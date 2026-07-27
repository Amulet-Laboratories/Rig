import type { WebStatItem, FeatureItem, MenuItem } from '@amulet-laboratories/rig'

export const hotelStats: WebStatItem[] = [
  { value: '22', label: 'Rooms' },
  { value: '1', label: 'Restaurant' },
  { value: '1', label: 'Cocktail Bar' },
  { value: '2018', label: 'Opened' },
]

function toFeatureItems(prefix: string, items: string[]): FeatureItem[] {
  return items.map((text, i) => ({ id: `${prefix}-${i}`, text }))
}

export interface Room {
  id: string
  name: string
  rate: string
  size: string
  sleeps: string
  description: string
  img: string
  amenities: FeatureItem[]
  signature?: boolean
}

export const rooms: Room[] = [
  {
    id: 'harbor-suite',
    name: 'Harbor Suite',
    rate: '$320/night',
    size: '480 sq ft',
    sleeps: '2 guests',
    description:
      'Corner suite with wraparound windows overlooking the harbor and Dune Road. King bed, clawfoot tub, separate reading nook with daybed. Our most requested room.',
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    amenities: toFeatureItems('harbor', [
      'King bed',
      'Harbor view',
      'Clawfoot tub',
      'Reading nook with daybed',
      'Fireplace',
      'In-room espresso',
    ]),
  },
  {
    id: 'dune-room',
    name: 'Dune Room',
    rate: '$240/night',
    size: '320 sq ft',
    sleeps: '2 guests',
    description:
      'West-facing room with direct views of the dunes and beach access path. Queen bed, walk-in rain shower, writing desk by the window.',
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    amenities: toFeatureItems('dune', [
      'Queen bed',
      'Ocean view',
      'Rain shower',
      'Writing desk',
      'Heated floors',
    ]),
  },
  {
    id: 'fog-room',
    name: 'Fog Room',
    rate: '$220/night',
    size: '280 sq ft',
    sleeps: '2 guests',
    description:
      'North-facing room designed for quiet. Queen bed, blackout curtains, deep soaking tub. Named for the morning fog that rolls past the windows.',
    img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    amenities: toFeatureItems('fog', [
      'Queen bed',
      'Soaking tub',
      'Blackout curtains',
      'Sound machine',
      'Heated floors',
    ]),
  },
  {
    id: 'captains-quarters',
    name: 'Captain\u2019s Quarters',
    rate: '$360/night',
    size: '520 sq ft',
    sleeps: '2 guests',
    description:
      'Top-floor suite with a private balcony, king bed, wet bar, and the best sunset view on the property. Maritime-inspired fixtures. Our signature room.',
    img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    amenities: toFeatureItems('captain', [
      'King bed',
      'Private balcony',
      'Sunset view',
      'Wet bar',
      'Fireplace',
      'Vintage record player',
    ]),
    signature: true,
  },
  {
    id: 'garden-cottage',
    name: 'Garden Cottage',
    rate: '$280/night',
    size: '400 sq ft',
    sleeps: '2 guests + pet',
    description:
      'Detached cottage behind the main house with a private garden patio. King bed, kitchenette, dog-friendly. The only pet-friendly accommodation on the property.',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    amenities: toFeatureItems('garden', [
      'King bed',
      'Private patio',
      'Kitchenette',
      'Pet-friendly ($50/night)',
      'Garden access',
      'Outdoor shower',
    ]),
  },
]

export interface Review {
  name: string
  location: string
  text: string
  stayType: string
}

export const reviews: Review[] = [
  {
    name: 'Claire & David',
    location: 'San Francisco, CA',
    text: "We booked the Harbor Suite for our anniversary and didn't want to leave. The view at sunrise, the cocktails at the bar, the halibut at dinner — everything was exactly right.",
    stayType: 'Harbor Suite · Anniversary',
  },
  {
    name: 'Tom R.',
    location: 'Portland, OR',
    text: 'The Lantern House is the reason we keep coming back to Briar Cove. The Garden Cottage is perfect for us and our dog. Staff remember your name by the second morning.',
    stayType: 'Garden Cottage · Repeat Guest',
  },
  {
    name: 'Akiko M.',
    location: 'Seattle, WA',
    text: 'I stayed in the Fog Room during storm season. Watched the waves from bed with a glass of wine from the bar. Exactly the kind of quiet I needed.',
    stayType: 'Fog Room · Solo Retreat',
  },
]

export const allAmenities: FeatureItem[] = [
  { id: 'all-bath', text: 'Organic bath products by Briar Cove Apothecary' },
  { id: 'all-wifi', text: 'Complimentary Wi-Fi throughout the property' },
  { id: 'all-coffee', text: 'In-room coffee and tea service' },
  { id: 'all-housekeeping', text: 'Twice-daily housekeeping' },
  { id: 'all-turndown', text: 'Turndown service with local chocolate' },
  { id: 'all-robes', text: 'Plush robes and slippers' },
  { id: 'all-minibar', text: 'Curated minibar with Oregon wines and spirits' },
  { id: 'all-breakfast', text: 'Complimentary breakfast for direct bookings' },
]

// ── Dining ──

export const starters: MenuItem[] = [
  {
    id: 'starter-bisque',
    name: 'Dungeness Crab Bisque',
    description: 'Cream, sherry, croutons, chive oil. A house staple since opening night.',
    price: '$18',
  },
  {
    id: 'starter-beet',
    name: 'Roasted Beet Salad',
    description: 'Golden and red beets, chèvre, candied walnuts, sherry vinaigrette.',
    price: '$16',
  },
]

export const mains: MenuItem[] = [
  {
    id: 'main-halibut',
    name: 'Seared Halibut',
    description: 'With braised fennel, preserved lemon, and saffron butter.',
    price: '$38',
  },
  {
    id: 'main-duck',
    name: 'Duck Confit',
    description: 'Slow-rendered leg, roasted root vegetables, blackberry jus.',
    price: '$36',
  },
  {
    id: 'main-risotto',
    name: 'Mushroom Risotto',
    description: 'Chanterelle, porcini, aged parmesan, truffle oil.',
    price: '$28',
  },
  {
    id: 'main-salmon',
    name: 'Pan-Roasted Salmon',
    description: 'Cedar-planked, dill crème fraîche, grilled asparagus, fingerling potatoes.',
    price: '$34',
  },
  {
    id: 'main-shortrib',
    name: 'Braised Short Rib',
    description: 'Red wine reduction, celery root purée, roasted carrots, gremolata.',
    price: '$42',
  },
  {
    id: 'main-prawns',
    name: 'Grilled Prawns',
    description: 'Garlic-herb butter, charred lemon, arugula, toasted sourdough.',
    price: '$32',
  },
  {
    id: 'main-ribeye',
    name: 'Dry-Aged Ribeye',
    description: '14oz, bone-in, roasted garlic compound butter, hand-cut fries.',
    price: '$56',
  },
]

export const desserts: MenuItem[] = [
  {
    id: 'dessert-fondant',
    name: 'Chocolate Fondant',
    description: 'Dark Valrhona, sea salt caramel, vanilla bean crème anglaise.',
    price: '$14',
  },
  {
    id: 'dessert-tarte',
    name: 'Pear Tarte Tatin',
    description: 'Caramelized Bartlett pear, puff pastry, crème fraîche, cardamom.',
    price: '$13',
  },
  {
    id: 'dessert-cheese',
    name: 'Cheese Board',
    description: 'Local and imported selections, honeycomb, fig jam, marcona almonds.',
    price: '$22',
  },
]

export const cocktails: MenuItem[] = [
  {
    id: 'cocktail-lantern',
    name: 'The Lantern',
    description: 'Rye, honey, orange bitters, smoked rosemary.',
    price: '$16',
  },
  {
    id: 'cocktail-foghorn',
    name: 'Foghorn',
    description: 'Gin, elderflower, cucumber, sparkling water.',
    price: '$15',
  },
  {
    id: 'cocktail-driftwood',
    name: 'Driftwood Old Fashioned',
    description: 'Bourbon, demerara, cedar smoke.',
    price: '$17',
  },
  {
    id: 'cocktail-salal',
    name: 'Salal Sour',
    description: 'Vodka, salal berry, lemon, egg white, lavender bitters.',
    price: '$16',
  },
  {
    id: 'cocktail-tidepool',
    name: 'Tidepool Collins',
    description: 'Oregon gin, blue curaçao, lime, tonic, edible flowers.',
    price: '$15',
  },
  {
    id: 'cocktail-midnight',
    name: 'Midnight on the Coast',
    description: 'Mezcal, activated charcoal, lime, agave, smoked salt rim.',
    price: '$18',
  },
]

export const wines: MenuItem[] = [
  {
    id: 'wine-pinot',
    name: 'Willamette Valley Pinot Noir',
    description: 'Domaine Drouhin',
    price: '$18 / $72',
  },
  {
    id: 'wine-tempranillo',
    name: 'Rogue Valley Tempranillo',
    description: 'Troon Vineyard',
    price: '$16 / $64',
  },
  {
    id: 'wine-chardonnay',
    name: 'Oregon Chardonnay',
    description: 'Stoller Family Estate',
    price: '$17 / $68',
  },
  {
    id: 'wine-viognier',
    name: 'Umpqua Valley Viognier',
    description: 'Abacela',
    price: '$15 / $60',
  },
]

export const menuPreview = [
  {
    name: 'Seared Halibut',
    price: '$38',
    note: 'With braised fennel, preserved lemon, and saffron butter.',
  },
  {
    name: 'Duck Confit',
    price: '$36',
    note: 'Slow-rendered leg, roasted root vegetables, blackberry jus.',
  },
  { name: 'Dungeness Crab Bisque', price: '$18', note: 'Cream, sherry, croutons, chive oil.' },
]
