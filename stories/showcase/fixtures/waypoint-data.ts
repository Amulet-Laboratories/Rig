/**
 * Waypoint — Location picker / route planner fixture data
 * Locations, routes, categories, search results for a map-like UI.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Waypoint {
  id: string
  name: string
  category: WaypointCategory
  description: string
  address: string
  coordinates: { lat: number; lng: number }
  rating: number // 1-5
  tags: string[]
  saved: boolean
  icon: string
}

export type WaypointCategory =
  | 'landmark'
  | 'restaurant'
  | 'park'
  | 'transit'
  | 'hotel'
  | 'shop'

export interface Route {
  id: string
  name: string
  waypointIds: string[]
  distance: string
  duration: string
  mode: 'walk' | 'drive' | 'transit'
}

export interface SearchResult {
  id: string
  name: string
  category: WaypointCategory
  distance: string
  icon: string
}

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------
export const categoryConfig: Record<
  WaypointCategory,
  { label: string; icon: string; color: string }
> = {
  landmark: { label: 'Landmark', icon: 'codicon:location', color: '#e91e63' },
  restaurant: { label: 'Restaurant', icon: 'codicon:coffee', color: '#ff9800' },
  park: { label: 'Park', icon: 'codicon:globe', color: '#4caf50' },
  transit: { label: 'Transit', icon: 'codicon:arrow-swap', color: '#2196f3' },
  hotel: { label: 'Hotel', icon: 'codicon:home', color: '#9c27b0' },
  shop: { label: 'Shop', icon: 'codicon:package', color: '#607d8b' },
}

// ---------------------------------------------------------------------------
// Mode config
// ---------------------------------------------------------------------------
export const modeConfig: Record<
  Route['mode'],
  { label: string; icon: string }
> = {
  walk: { label: 'Walk', icon: 'codicon:person' },
  drive: { label: 'Drive', icon: 'codicon:dashboard' },
  transit: { label: 'Transit', icon: 'codicon:arrow-swap' },
}

// ---------------------------------------------------------------------------
// Waypoints
// ---------------------------------------------------------------------------
export const waypoints: Waypoint[] = [
  {
    id: 'wp-01',
    name: 'Harborview Tower',
    category: 'landmark',
    description: 'Historic observation tower with panoramic city views across the bay.',
    address: '42 Wharf Road',
    coordinates: { lat: 40.7128, lng: -74.006 },
    rating: 4.7,
    tags: ['scenic', 'historic', 'photography'],
    saved: true,
    icon: 'codicon:location',
  },
  {
    id: 'wp-02',
    name: 'The Copper Kettle',
    category: 'restaurant',
    description: 'Artisan coffee and seasonal brunch menu in a converted warehouse.',
    address: '118 Market Street',
    coordinates: { lat: 40.714, lng: -74.002 },
    rating: 4.5,
    tags: ['coffee', 'brunch', 'local'],
    saved: true,
    icon: 'codicon:coffee',
  },
  {
    id: 'wp-03',
    name: 'Bayshore Park',
    category: 'park',
    description: 'Waterfront park with walking trails, picnic areas, and a marina.',
    address: '200 Bayshore Boulevard',
    coordinates: { lat: 40.711, lng: -74.013 },
    rating: 4.3,
    tags: ['outdoors', 'trails', 'waterfront'],
    saved: false,
    icon: 'codicon:globe',
  },
  {
    id: 'wp-04',
    name: 'Central Station',
    category: 'transit',
    description: 'Main transit hub with rail, bus, and ferry connections.',
    address: '1 Station Plaza',
    coordinates: { lat: 40.715, lng: -74.009 },
    rating: 3.8,
    tags: ['transit', 'ferry', 'rail'],
    saved: false,
    icon: 'codicon:arrow-swap',
  },
  {
    id: 'wp-05',
    name: 'The Anchor Hotel',
    category: 'hotel',
    description: 'Boutique waterfront hotel with rooftop lounge and harbor views.',
    address: '55 Dock Street',
    coordinates: { lat: 40.709, lng: -74.004 },
    rating: 4.6,
    tags: ['boutique', 'waterfront', 'rooftop'],
    saved: true,
    icon: 'codicon:home',
  },
  {
    id: 'wp-06',
    name: 'Northwind Books',
    category: 'shop',
    description: 'Independent bookshop specializing in local history and rare editions.',
    address: '83 Elm Street',
    coordinates: { lat: 40.717, lng: -74.001 },
    rating: 4.8,
    tags: ['books', 'local', 'rare'],
    saved: false,
    icon: 'codicon:book',
  },
  {
    id: 'wp-07',
    name: 'Lantern Garden',
    category: 'restaurant',
    description: 'Modern Asian fusion with a lantern-lit courtyard.',
    address: '29 Garden Row',
    coordinates: { lat: 40.713, lng: -74.007 },
    rating: 4.4,
    tags: ['asian', 'outdoor-dining', 'cocktails'],
    saved: false,
    icon: 'codicon:coffee',
  },
  {
    id: 'wp-08',
    name: 'Tide Pool Aquarium',
    category: 'landmark',
    description: 'Interactive marine science center with touch pools and live exhibits.',
    address: '501 Harbor Way',
    coordinates: { lat: 40.708, lng: -74.015 },
    rating: 4.2,
    tags: ['family', 'science', 'marine'],
    saved: true,
    icon: 'codicon:beaker',
  },
  {
    id: 'wp-09',
    name: 'Ferry Terminal West',
    category: 'transit',
    description: 'West-side ferry terminal with connections to the islands.',
    address: '10 Pier West',
    coordinates: { lat: 40.706, lng: -74.018 },
    rating: 3.5,
    tags: ['ferry', 'islands', 'commute'],
    saved: false,
    icon: 'codicon:arrow-swap',
  },
  {
    id: 'wp-10',
    name: 'Cliffside Gardens',
    category: 'park',
    description: 'Terraced botanical gardens overlooking the estuary.',
    address: '77 Ridge Path',
    coordinates: { lat: 40.72, lng: -73.998 },
    rating: 4.9,
    tags: ['botanical', 'scenic', 'gardens'],
    saved: true,
    icon: 'codicon:globe',
  },
]

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
export const routes: Route[] = [
  {
    id: 'rt-01',
    name: 'Harbor Walk',
    waypointIds: ['wp-01', 'wp-03', 'wp-08', 'wp-09'],
    distance: '3.4 km',
    duration: '42 min',
    mode: 'walk',
  },
  {
    id: 'rt-02',
    name: 'Food Tour',
    waypointIds: ['wp-02', 'wp-07', 'wp-06'],
    distance: '1.8 km',
    duration: '22 min',
    mode: 'walk',
  },
  {
    id: 'rt-03',
    name: 'City Express',
    waypointIds: ['wp-04', 'wp-01', 'wp-05', 'wp-10'],
    distance: '8.2 km',
    duration: '15 min',
    mode: 'drive',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getWaypointById(id: string): Waypoint | undefined {
  return waypoints.find((w) => w.id === id)
}

export function getRouteWaypoints(route: Route): Waypoint[] {
  return route.waypointIds
    .map((id) => waypoints.find((w) => w.id === id))
    .filter(Boolean) as Waypoint[]
}

export function getSavedWaypoints(): Waypoint[] {
  return waypoints.filter((w) => w.saved)
}

export function getWaypointsByCategory(cat: WaypointCategory): Waypoint[] {
  return waypoints.filter((w) => w.category === cat)
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

export function formatCoordinates(coords: { lat: number; lng: number }): string {
  return `${coords.lat.toFixed(4)}°N, ${Math.abs(coords.lng).toFixed(4)}°W`
}
