import type { WebStatItem, TeamMember } from '@amulet-laboratories/rig'

export interface Product {
  id: string
  name: string
  price: string
  category: string
  tag: string
  img: string
  description: string
  maker: string
  materials: string
}

export const products: Product[] = [
  {
    id: 'sea-salt-candle',
    name: 'Sea Salt Candle — Driftwood',
    price: '$34',
    category: 'Candles & Scents',
    tag: 'New',
    img: '',
    description:
      'Hand-poured soy wax candle with a Pacific driftwood fragrance. 60-hour burn time. Reusable ceramic vessel thrown by Helen Yoo.',
    maker: 'The Greer Sisters',
    materials: 'Soy wax, cotton wick, essential oils',
  },
  {
    id: 'briar-cove-honey',
    name: 'Briar Cove Honey (12oz)',
    price: '$18',
    category: 'Pantry',
    tag: 'Local',
    img: '',
    description:
      'Raw, unfiltered wildflower honey from 12 hives on the hillside east of town. Flavor changes with the season — spring is light and floral, late summer is dark and complex.',
    maker: 'David Okafor',
    materials: 'Raw wildflower honey',
  },
  {
    id: 'hand-thrown-mug',
    name: 'Hand-thrown Mug — Fog',
    price: '$42',
    category: 'Ceramics',
    tag: 'Staff Pick',
    img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80',
    description:
      "Stoneware mug with Helen's signature fog-blue glaze made from local clay. Each one is slightly different. Microwave and dishwasher safe.",
    maker: 'Helen Yoo',
    materials: 'Stoneware clay, local-sourced glaze',
  },
  {
    id: 'wool-throw',
    name: 'Wool Throw — Charcoal',
    price: '$88',
    category: 'Home',
    tag: '',
    img: '',
    description:
      'Midweight wool blanket woven in Pendleton, Oregon. Charcoal with a subtle herringbone pattern. 50" x 70".',
    maker: 'Pendleton Woolen Mills',
    materials: '100% virgin wool',
  },
  {
    id: 'kelp-salt',
    name: 'Kelp Salt Blend (4oz)',
    price: '$12',
    category: 'Pantry',
    tag: 'Staff Pick',
    img: '',
    description:
      'Sea salt blended with hand-harvested bull kelp from the Oregon coast. Savory, mineral, slightly sweet. Extraordinary on eggs and roasted vegetables.',
    maker: 'Salt & Signal',
    materials: 'Sea salt, dried bull kelp',
  },
  {
    id: 'stoneware-planter',
    name: 'Stoneware Planter — Sage',
    price: '$56',
    category: 'Ceramics',
    tag: 'Low Stock',
    img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
    description:
      'Wheel-thrown planter with drainage hole and matching saucer. Sage green matte glaze. 6" diameter — perfect for herbs or small succulents.',
    maker: 'Helen Yoo',
    materials: 'Stoneware clay, matte glaze',
  },
  {
    id: 'wildcrafted-soap',
    name: 'Wildcrafted Soap Trio',
    price: '$24',
    category: 'Local Makers',
    tag: 'Local',
    img: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=400&q=80',
    description:
      'Three bars of cold-process soap made with tallow from a ranch in Coquille. Scents: cedar, lavender, and unscented. Each bar lasts 4-6 weeks.',
    maker: 'The Greer Sisters',
    materials: 'Tallow, olive oil, essential oils',
  },
  {
    id: 'cedar-cutting-board',
    name: 'Cedar Cutting Board',
    price: '$68',
    category: 'Home',
    tag: '',
    img: '',
    description:
      'Edge-grain cutting board made from reclaimed western red cedar. Finished with food-safe mineral oil. 12" x 18".',
    maker: 'Harbor Woodworks',
    materials: 'Reclaimed western red cedar',
  },
  {
    id: 'oregon-olive-oil',
    name: 'Oregon Olive Oil (500ml)',
    price: '$22',
    category: 'Pantry',
    tag: '',
    img: '',
    description:
      'Cold-pressed extra virgin olive oil from a small grove in southern Oregon. Peppery finish, low acidity. Harvest 2025.',
    maker: 'Durant Oregon',
    materials: 'Extra virgin olive oil',
  },
  {
    id: 'linen-napkins',
    name: 'Linen Napkin Set — Oat',
    price: '$36',
    category: 'Home',
    tag: 'New',
    img: '',
    description:
      'Set of four stonewashed linen napkins. Oat colorway. Pre-shrunk, gets softer with every wash.',
    maker: 'Rough Linen',
    materials: '100% European flax linen',
  },
  {
    id: 'beeswax-tapers',
    name: 'Beeswax Taper Candles (2)',
    price: '$16',
    category: 'Candles & Scents',
    tag: 'Local',
    img: '',
    description:
      'Hand-dipped beeswax taper candles. 10" tall, 8-hour burn time each. Natural honey scent — no added fragrance.',
    maker: 'The Greer Sisters',
    materials: '100% beeswax, cotton wick',
  },
  {
    id: 'ceramic-spoon-rest',
    name: 'Ceramic Spoon Rest',
    price: '$28',
    category: 'Ceramics',
    tag: '',
    img: '',
    description:
      "Simple oval spoon rest in Helen's fog-blue glaze. Keeps your counter clean and looks good doing it.",
    maker: 'Helen Yoo',
    materials: 'Stoneware clay, local-sourced glaze',
  },
  {
    id: 'huckleberry-preserves',
    name: 'Huckleberry Preserves (8oz)',
    price: '$14',
    category: 'Pantry',
    tag: 'Seasonal',
    img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
    description:
      "Small-batch preserves made from wild huckleberries picked on the southern Oregon coast. Limited run — when it's gone, it's gone until next August.",
    maker: 'David Okafor',
    materials: 'Wild huckleberries, cane sugar, pectin',
  },
  {
    id: 'incense-sage',
    name: 'Incense — Coastal Sage',
    price: '$10',
    category: 'Candles & Scents',
    tag: '',
    img: '',
    description:
      'Charcoal-based incense sticks with wild coastal sage and a hint of sea salt. 20 sticks per box, 45-minute burn time each.',
    maker: 'Salt & Signal',
    materials: 'Charcoal, sage, natural binder',
  },
  {
    id: 'block-print-towel',
    name: 'Block Print Tea Towel',
    price: '$22',
    category: 'Local Makers',
    tag: 'Local',
    img: '',
    description:
      'Hand-printed on unbleached cotton using carved linoleum blocks. Patterns inspired by Oregon coast tidepools. Every print is slightly different.',
    maker: 'Marta Engström',
    materials: 'Unbleached cotton, non-toxic ink',
  },
  {
    id: 'ceramic-pourover',
    name: 'Ceramic Pour-over Set',
    price: '$74',
    category: 'Ceramics',
    tag: '',
    img: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=400&q=80',
    description:
      'Dripper and carafe in matched fog-blue glaze. Fits standard #2 filters. Brews 2-3 cups. The best way to make coffee if you have three extra minutes.',
    maker: 'Helen Yoo',
    materials: 'Stoneware clay, local-sourced glaze',
  },
]

export const categories = [
  'Shop All',
  'Pantry',
  'Home',
  'Ceramics',
  'Local Makers',
  'Candles & Scents',
]

export const tagVariants: Record<string, string> = {
  New: 'primary',
  Local: 'success',
  'Staff Pick': '',
  'Low Stock': 'warning',
  Seasonal: 'accent',
}

export const collections = [
  {
    name: 'The Pantry Edit',
    description: 'Our favorite shelf-stable goods from Oregon producers.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80',
    category: 'Pantry',
  },
  {
    name: 'Housewarming',
    description: 'Everything you need to make a new place feel like home.',
    img: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80',
    category: 'Home',
  },
  {
    name: 'Made in Briar Cove',
    description: 'Directly from our neighbors — ceramics, soaps, honey, and more.',
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
    category: 'Local Makers',
  },
]

export interface Review {
  name: string
  location: string
  text: string
  product: string
}

export const reviews: Review[] = [
  {
    name: 'Sarah M.',
    location: 'Portland, OR',
    text: 'Every time I visit Briar Cove, Salt & Signal is my first stop. The kelp salt blend is in permanent rotation in my kitchen.',
    product: 'Kelp Salt Blend',
  },
  {
    name: 'James & Liz',
    location: 'Eugene, OR',
    text: 'We ordered the housewarming collection for friends who just moved to the coast. Everything arrived beautifully wrapped with a handwritten note. They loved it.',
    product: 'Housewarming Collection',
  },
  {
    name: 'T. Nakamura',
    location: 'Briar Cove, OR',
    text: "Helen's mugs are the only ones I use anymore. The fog glaze is even better in person than in the photos.",
    product: 'Hand-thrown Mug',
  },
  {
    name: 'Rachel K.',
    location: 'Bend, OR',
    text: 'I drove an hour out of my way to visit after seeing them tagged on Instagram. Left with a full bag and zero regrets. The soap trio smells incredible.',
    product: 'Wildcrafted Soap Trio',
  },
]

export const makers: (TeamMember & { products: string })[] = [
  {
    id: 'helen-yoo',
    name: 'Helen Yoo',
    role: 'Ceramics — Briar Cove, OR',
    bio: 'Helen throws every mug, planter, and bowl in her garage studio overlooking the harbor. Her fog-blue glaze is made from local clay.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    products: 'Mugs, planters, spoon rests, pour-over sets',
  },
  {
    id: 'david-okafor',
    name: 'David Okafor',
    role: 'Honey & Preserves — Briar Cove, OR',
    bio: 'David keeps 12 hives on the hillside east of town. His honey and seasonal preserves change with whatever is blooming.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    products: 'Wildflower honey, huckleberry preserves',
  },
  {
    id: 'greer-sisters',
    name: 'The Greer Sisters',
    role: 'Soaps & Candles — Port Orford, OR',
    bio: 'Ava and June cold-process their soaps with tallow from a ranch in Coquille. The sea salt candles are poured in their kitchen.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    products: 'Soap trio, sea salt candles, beeswax tapers',
  },
  {
    id: 'marta-engstrom',
    name: 'Marta Engström',
    role: 'Textiles — Bandon, OR',
    bio: 'Marta block-prints tea towels and napkins by hand using carved linoleum blocks. Every print is slightly different.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    products: 'Block print tea towels, napkins',
  },
]

export const storeStats: WebStatItem[] = [
  { value: '2022', label: 'Year opened' },
  { value: '600', label: 'Square feet' },
  { value: '50mi', label: 'Max sourcing radius' },
  { value: '12', label: 'Local makers' },
]

export const values = [
  {
    title: 'Small-batch only',
    description:
      'We work with producers who make things by hand, in small quantities. No factories, no mass-produced anything.',
  },
  {
    title: 'Transparent sourcing',
    description:
      "Every product has a story. We list the maker, the origin, and the materials — because you deserve to know what you're bringing home.",
  },
  {
    title: 'Community over commerce',
    description:
      "We host makers' markets, run a shelf for local artisans, and donate unsold pantry goods to the Briar Cove food bank.",
  },
  {
    title: 'Zero-waste goals',
    description:
      'We ship in compostable mailers, stock refill stations for soaps and oils, and accept packaging back for reuse.',
  },
]
