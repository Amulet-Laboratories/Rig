/**
 * Briar Cove — Shared fictional business/people data
 * Used across multiple showcases (Anchor Dashboard, Bestiary, etc.)
 */

export const businesses = [
  { id: 'compass-rose', name: 'Compass Rose Books', industry: 'Retail' },
  { id: 'salt-timber', name: 'Salt & Timber', industry: 'Hospitality' },
  { id: 'lanternlight', name: 'Lanternlight Brewing', industry: 'Food & Beverage' },
  { id: 'tidemark', name: 'Tidemark Marina', industry: 'Maritime' },
  { id: 'wren-sparrow', name: 'Wren & Sparrow', industry: 'Apparel' },
  { id: 'stone-hearth', name: 'Stone Hearth Bakery', industry: 'Food & Beverage' },
  { id: 'driftwood', name: 'Driftwood Provisions', industry: 'Grocery' },
  { id: 'coastal-iron', name: 'Coastal Iron Forge', industry: 'Manufacturing' },
  { id: 'harborview', name: 'Harborview Wellness', industry: 'Healthcare' },
  { id: 'cliffside', name: 'Cliffside Ceramics', industry: 'Arts & Crafts' },
] as const

export type BusinessId = (typeof businesses)[number]['id']

export const contacts = [
  { name: 'Elara Voss', business: 'compass-rose', role: 'Owner' },
  { name: 'Marcus Thorne', business: 'salt-timber', role: 'Manager' },
  { name: 'Sable Aldridge', business: 'lanternlight', role: 'Head Brewer' },
  { name: 'Dorian Keel', business: 'tidemark', role: 'Harbormaster' },
  { name: 'Wren Calloway', business: 'wren-sparrow', role: 'Designer' },
  { name: 'Petra Lindhurst', business: 'stone-hearth', role: 'Head Baker' },
  { name: 'Jasper Cole', business: 'driftwood', role: 'Owner' },
  { name: 'Sienna Vane', business: 'coastal-iron', role: 'Founder' },
  { name: 'Nolan Birch', business: 'harborview', role: 'Director' },
  { name: 'Faye Whitmore', business: 'cliffside', role: 'Lead Artist' },
] as const

export function getBusinessName(id: string): string {
  return businesses.find((b) => b.id === id)?.name ?? id
}
