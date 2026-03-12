/**
 * Tide Radio — Music player fixture data
 * Tracks, playlists, artists, player state for a streaming radio UI.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number // seconds
  genre: string
  coverColor: string
  liked: boolean
}

export interface Playlist {
  id: string
  name: string
  icon: string
  trackIds: string[]
  description: string
}

export interface Artist {
  id: string
  name: string
  color: string
  trackCount: number
  genre: string
}

export interface PlayerState {
  currentTrackId: string | null
  isPlaying: boolean
  volume: number
  progress: number // 0-1
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'
}

export interface EqBand {
  id: string
  label: string
  frequency: string
  gain: number // -12 to 12
}

// ---------------------------------------------------------------------------
// Tracks
// ---------------------------------------------------------------------------
export const tracks: Track[] = [
  {
    id: 'tr-01',
    title: 'Midnight Resonance',
    artist: 'Neon Dusk',
    album: 'After Hours',
    duration: 247,
    genre: 'Synthwave',
    coverColor: '#6366f1',
    liked: true,
  },
  {
    id: 'tr-02',
    title: 'Solar Winds',
    artist: 'Aether Collective',
    album: 'Celestial',
    duration: 312,
    genre: 'Ambient',
    coverColor: '#f59e0b',
    liked: false,
  },
  {
    id: 'tr-03',
    title: 'Pulse Circuit',
    artist: 'Neon Dusk',
    album: 'After Hours',
    duration: 198,
    genre: 'Synthwave',
    coverColor: '#6366f1',
    liked: true,
  },
  {
    id: 'tr-04',
    title: 'Deep Current',
    artist: 'Tidal Force',
    album: 'Submersion',
    duration: 284,
    genre: 'Downtempo',
    coverColor: '#06b6d4',
    liked: false,
  },
  {
    id: 'tr-05',
    title: 'Ghost Signal',
    artist: 'Phantom Module',
    album: 'Transmission',
    duration: 226,
    genre: 'Darkwave',
    coverColor: '#a855f7',
    liked: true,
  },
  {
    id: 'tr-06',
    title: 'Starfall',
    artist: 'Aether Collective',
    album: 'Celestial',
    duration: 345,
    genre: 'Ambient',
    coverColor: '#f59e0b',
    liked: false,
  },
  {
    id: 'tr-07',
    title: 'Iron Lattice',
    artist: 'Grid Theory',
    album: 'Structure',
    duration: 271,
    genre: 'IDM',
    coverColor: '#ef4444',
    liked: false,
  },
  {
    id: 'tr-08',
    title: 'Coral Depths',
    artist: 'Tidal Force',
    album: 'Submersion',
    duration: 318,
    genre: 'Downtempo',
    coverColor: '#06b6d4',
    liked: true,
  },
  {
    id: 'tr-09',
    title: 'Neon Cathedral',
    artist: 'Neon Dusk',
    album: 'Night Drive',
    duration: 256,
    genre: 'Synthwave',
    coverColor: '#ec4899',
    liked: false,
  },
  {
    id: 'tr-10',
    title: 'Terminal Velocity',
    artist: 'Phantom Module',
    album: 'Transmission',
    duration: 203,
    genre: 'Darkwave',
    coverColor: '#a855f7',
    liked: true,
  },
  {
    id: 'tr-11',
    title: 'Morning Fog',
    artist: 'Still Garden',
    album: 'Quiet Hours',
    duration: 394,
    genre: 'Ambient',
    coverColor: '#10b981',
    liked: false,
  },
  {
    id: 'tr-12',
    title: 'Hexagon',
    artist: 'Grid Theory',
    album: 'Structure',
    duration: 189,
    genre: 'IDM',
    coverColor: '#ef4444',
    liked: false,
  },
]

// ---------------------------------------------------------------------------
// Playlists
// ---------------------------------------------------------------------------
export const playlists: Playlist[] = [
  {
    id: 'pl-favorites',
    name: 'Favorites',
    icon: 'codicon:heart-filled',
    trackIds: tracks.filter((t) => t.liked).map((t) => t.id),
    description: 'Your liked tracks',
  },
  {
    id: 'pl-focus',
    name: 'Deep Focus',
    icon: 'codicon:lightbulb',
    trackIds: ['tr-02', 'tr-04', 'tr-06', 'tr-08', 'tr-11'],
    description: 'Ambient and downtempo for concentration',
  },
  {
    id: 'pl-drive',
    name: 'Night Drive',
    icon: 'codicon:rocket',
    trackIds: ['tr-01', 'tr-03', 'tr-05', 'tr-09', 'tr-10'],
    description: 'Synthwave and darkwave energy',
  },
  {
    id: 'pl-all',
    name: 'All Tracks',
    icon: 'codicon:library',
    trackIds: tracks.map((t) => t.id),
    description: 'Complete library',
  },
]

// ---------------------------------------------------------------------------
// Artists
// ---------------------------------------------------------------------------
export const artists: Artist[] = [
  { id: 'ar-01', name: 'Neon Dusk', color: '#6366f1', trackCount: 3, genre: 'Synthwave' },
  { id: 'ar-02', name: 'Aether Collective', color: '#f59e0b', trackCount: 2, genre: 'Ambient' },
  { id: 'ar-03', name: 'Tidal Force', color: '#06b6d4', trackCount: 2, genre: 'Downtempo' },
  { id: 'ar-04', name: 'Phantom Module', color: '#a855f7', trackCount: 2, genre: 'Darkwave' },
  { id: 'ar-05', name: 'Grid Theory', color: '#ef4444', trackCount: 2, genre: 'IDM' },
  { id: 'ar-06', name: 'Still Garden', color: '#10b981', trackCount: 1, genre: 'Ambient' },
]

// ---------------------------------------------------------------------------
// EQ bands
// ---------------------------------------------------------------------------
export const eqBands: EqBand[] = [
  { id: 'eq-1', label: '60', frequency: '60 Hz', gain: 2 },
  { id: 'eq-2', label: '170', frequency: '170 Hz', gain: 0 },
  { id: 'eq-3', label: '310', frequency: '310 Hz', gain: -1 },
  { id: 'eq-4', label: '600', frequency: '600 Hz', gain: 0 },
  { id: 'eq-5', label: '1K', frequency: '1 kHz', gain: 3 },
  { id: 'eq-6', label: '3K', frequency: '3 kHz', gain: 1 },
  { id: 'eq-7', label: '6K', frequency: '6 kHz', gain: -2 },
  { id: 'eq-8', label: '12K', frequency: '12 kHz', gain: 4 },
  { id: 'eq-9', label: '14K', frequency: '14 kHz', gain: 2 },
  { id: 'eq-10', label: '16K', frequency: '16 kHz', gain: 0 },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function getTrackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id)
}

export function getPlaylistTracks(playlist: Playlist): Track[] {
  return playlist.trackIds
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean) as Track[]
}

export function getGenres(): string[] {
  return [...new Set(tracks.map((t) => t.genre))].sort()
}

export function getTracksByGenre(genre: string): Track[] {
  return tracks.filter((t) => t.genre === genre)
}

export const defaultPlayerState: PlayerState = {
  currentTrackId: 'tr-01',
  isPlaying: true,
  volume: 72,
  progress: 0.35,
  shuffle: false,
  repeat: 'off',
}
