/**
 * Briar Cove — User profiles for showcases requiring avatars and presence
 * Cross-references briar-cove.ts for business associations.
 * Used by: Messaging App, Kanban Board, Signal Feed, Calendar
 */
import type { BusinessId } from './briar-cove'

export type UserStatus = 'online' | 'away' | 'dnd' | 'offline'

export interface BriarCoveUser {
  id: string
  name: string
  /** Avatar background color */
  color: string
  status: UserStatus
  role: string
  business: BusinessId
}

export const users: BriarCoveUser[] = [
  {
    id: 'elara',
    name: 'Elara Voss',
    color: '#7c3aed',
    status: 'online',
    role: 'Owner @ Compass Rose Books',
    business: 'compass-rose',
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    color: '#0891b2',
    status: 'online',
    role: 'Manager @ Salt & Timber',
    business: 'salt-timber',
  },
  {
    id: 'sable',
    name: 'Sable Aldridge',
    color: '#b45309',
    status: 'away',
    role: 'Head Brewer @ Lanternlight',
    business: 'lanternlight',
  },
  {
    id: 'dorian',
    name: 'Dorian Keel',
    color: '#059669',
    status: 'online',
    role: 'Harbormaster @ Tidemark Marina',
    business: 'tidemark',
  },
  {
    id: 'wren',
    name: 'Wren Calloway',
    color: '#dc2626',
    status: 'dnd',
    role: 'Designer @ Wren & Sparrow',
    business: 'wren-sparrow',
  },
  {
    id: 'petra',
    name: 'Petra Lindhurst',
    color: '#7c6e5f',
    status: 'offline',
    role: 'Head Baker @ Stone Hearth',
    business: 'stone-hearth',
  },
  {
    id: 'jasper',
    name: 'Jasper Cole',
    color: '#2563eb',
    status: 'online',
    role: 'Owner @ Driftwood Provisions',
    business: 'driftwood',
  },
  {
    id: 'sienna',
    name: 'Sienna Vane',
    color: '#9333ea',
    status: 'away',
    role: 'Founder @ Coastal Iron Forge',
    business: 'coastal-iron',
  },
  {
    id: 'nolan',
    name: 'Nolan Birch',
    color: '#0d9488',
    status: 'online',
    role: 'Director @ Harborview Wellness',
    business: 'harborview',
  },
  {
    id: 'faye',
    name: 'Faye Whitmore',
    color: '#c2410c',
    status: 'online',
    role: 'Lead Artist @ Cliffside Ceramics',
    business: 'cliffside',
  },
  {
    id: 'rowan',
    name: 'Rowan Blackwood',
    color: '#4f46e5',
    status: 'away',
    role: 'Freelance Developer',
    business: 'compass-rose',
  },
  {
    id: 'ivy',
    name: 'Ivy Delacroix',
    color: '#be185d',
    status: 'online',
    role: 'Town Clerk',
    business: 'tidemark',
  },
]

export function getUserById(id: string): BriarCoveUser | undefined {
  return users.find((u) => u.id === id)
}

export function getUsersByBusiness(businessId: BusinessId): BriarCoveUser[] {
  return users.filter((u) => u.business === businessId)
}
