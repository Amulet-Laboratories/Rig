/**
 * Obelisk — Activity, tree, panel, and status bar fixtures.
 */
import type { Action, TabItem, StatusBarItem, TreeNode, ListItem } from '@core/types'

// ---------------------------------------------------------------------------
// Domains & Registries
// ---------------------------------------------------------------------------
export interface DomainMeta {
  id: string
  label: string
  accent: string
}

export const domains: DomainMeta[] = [
  { id: 'legal', label: 'Legal', accent: '#ef4444' },
  { id: 'life', label: 'Life', accent: '#22c55e' },
  { id: 'software', label: 'Software', accent: '#3b82f6' },
  { id: 'business', label: 'Business', accent: '#c9956d' },
  { id: 'history', label: 'History', accent: '#a855f7' },
  { id: 'world', label: 'World', accent: '#eab308' },
]

export const domainRegistries: Record<string, string[]> = {
  legal: ['cases', 'documents', 'evidence', 'issues', 'persons', 'sources', 'timeline'],
  life: ['contacts', 'dependents', 'education', 'employment', 'finance', 'goals', 'health', 'identity', 'insurance', 'inventory', 'property', 'recurring', 'tax', 'vehicles'],
  software: ['incidents', 'infrastructure', 'pipelines', 'repos', 'stacks', 'tools'],
  business: ['accounts', 'clients', 'compliance', 'contracts', 'foundation', 'ip', 'processes', 'revenue', 'strategy'],
  history: ['events', 'moments', 'periods', 'persons', 'places', 'years'],
  world: ['campaigns', 'characters'],
}

// ---------------------------------------------------------------------------
// Activity Bar
// ---------------------------------------------------------------------------
export const activityItems: Action[] = [
  { id: 'explorer', label: 'Explorer', icon: 'codicon:files' },
  { id: 'search', label: 'Search', icon: 'codicon:search' },
]

// ---------------------------------------------------------------------------
// Mock Vault Records
// ---------------------------------------------------------------------------
export interface VaultRecord {
  id: string
  name: string
  domain: string
  registry: string
  slug: string
  status?: string
  tags?: string[]
}

export const mockRecords: VaultRecord[] = [
  // Legal
  { id: 'legal:cases:custody-dispute', name: 'Custody Dispute', domain: 'legal', registry: 'cases', slug: 'custody-dispute', status: 'active', tags: ['family', 'priority'] },
  { id: 'legal:cases:property-lien', name: 'Property Lien Resolution', domain: 'legal', registry: 'cases', slug: 'property-lien', status: 'pending', tags: ['property'] },
  { id: 'legal:documents:retainer-agreement', name: 'Retainer Agreement', domain: 'legal', registry: 'documents', slug: 'retainer-agreement', tags: ['contracts'] },
  { id: 'legal:documents:temporary-order', name: 'Temporary Order — May 2025', domain: 'legal', registry: 'documents', slug: 'temporary-order', tags: ['court'] },
  { id: 'legal:documents:financial-disclosure', name: 'Financial Disclosure', domain: 'legal', registry: 'documents', slug: 'financial-disclosure', tags: ['finance'] },
  { id: 'legal:evidence:text-messages-jan', name: 'Text Messages — Jan 2025', domain: 'legal', registry: 'evidence', slug: 'text-messages-jan', tags: ['communications'] },
  { id: 'legal:evidence:school-records', name: 'School Records', domain: 'legal', registry: 'evidence', slug: 'school-records', tags: ['education'] },
  { id: 'legal:issues:visitation-schedule', name: 'Visitation Schedule', domain: 'legal', registry: 'issues', slug: 'visitation-schedule', status: 'open' },
  { id: 'legal:issues:attorney-fees', name: 'Attorney Fee Dispute', domain: 'legal', registry: 'issues', slug: 'attorney-fees', status: 'open' },
  { id: 'legal:persons:judge-martinez', name: 'Judge Martinez', domain: 'legal', registry: 'persons', slug: 'judge-martinez' },
  { id: 'legal:persons:atty-chen', name: 'Attorney Chen', domain: 'legal', registry: 'persons', slug: 'atty-chen' },
  { id: 'legal:timeline:initial-filing', name: 'Initial Filing — Mar 2024', domain: 'legal', registry: 'timeline', slug: 'initial-filing' },
  { id: 'legal:timeline:mediation-session', name: 'Mediation Session — Aug 2025', domain: 'legal', registry: 'timeline', slug: 'mediation-session' },

  // Software
  { id: 'software:repos:rig', name: 'Rig', domain: 'software', registry: 'repos', slug: 'rig', tags: ['vue', 'component-library'] },
  { id: 'software:repos:hex', name: 'Hex', domain: 'software', registry: 'repos', slug: 'hex', tags: ['css', 'themes'] },
  { id: 'software:repos:obelisk', name: 'Obelisk', domain: 'software', registry: 'repos', slug: 'obelisk', tags: ['tauri', 'vue', 'desktop'] },
  { id: 'software:repos:amulet-ink', name: 'amulet.ink', domain: 'software', registry: 'repos', slug: 'amulet-ink', tags: ['website'] },
  { id: 'software:stacks:frontend', name: 'Frontend Stack', domain: 'software', registry: 'stacks', slug: 'frontend', tags: ['vue', 'vite', 'tailwind'] },
  { id: 'software:stacks:backend', name: 'Backend Stack', domain: 'software', registry: 'stacks', slug: 'backend', tags: ['node', 'netlify'] },
  { id: 'software:tools:claude', name: 'Claude', domain: 'software', registry: 'tools', slug: 'claude', tags: ['ai', 'coding'] },
  { id: 'software:tools:github', name: 'GitHub', domain: 'software', registry: 'tools', slug: 'github', tags: ['vcs', 'ci'] },
  { id: 'software:pipelines:rig-ci', name: 'Rig CI Pipeline', domain: 'software', registry: 'pipelines', slug: 'rig-ci' },
  { id: 'software:incidents:deploy-failure', name: 'Deploy Failure — Feb 2026', domain: 'software', registry: 'incidents', slug: 'deploy-failure', status: 'resolved' },

  // Life
  { id: 'life:health:annual-checkup', name: 'Annual Checkup 2026', domain: 'life', registry: 'health', slug: 'annual-checkup' },
  { id: 'life:finance:savings-plan', name: 'Savings Plan', domain: 'life', registry: 'finance', slug: 'savings-plan' },
  { id: 'life:vehicles:civic-2019', name: '2019 Honda Civic', domain: 'life', registry: 'vehicles', slug: 'civic-2019' },
  { id: 'life:goals:learn-rust', name: 'Learn Rust', domain: 'life', registry: 'goals', slug: 'learn-rust', status: 'in-progress' },
  { id: 'life:insurance:renters', name: 'Renters Insurance', domain: 'life', registry: 'insurance', slug: 'renters' },

  // Business
  { id: 'business:clients:hotel-amulet', name: 'Hotel Amulet', domain: 'business', registry: 'clients', slug: 'hotel-amulet', tags: ['hospitality'] },
  { id: 'business:clients:coffee-amulet', name: 'Coffee Amulet', domain: 'business', registry: 'clients', slug: 'coffee-amulet', tags: ['food-bev'] },
  { id: 'business:contracts:hotel-retainer', name: 'Hotel Retainer — 2026', domain: 'business', registry: 'contracts', slug: 'hotel-retainer' },
  { id: 'business:revenue:q1-2026', name: 'Q1 2026 Revenue', domain: 'business', registry: 'revenue', slug: 'q1-2026' },
  { id: 'business:foundation:mission', name: 'Mission Statement', domain: 'business', registry: 'foundation', slug: 'mission' },
]

// ---------------------------------------------------------------------------
// Build explorer tree from records for a given domain
// ---------------------------------------------------------------------------
export function buildRegistryTree(domain: string): TreeNode<VaultRecord>[] {
  const registries = domainRegistries[domain] ?? []
  return registries
    .map((reg) => {
      const records = mockRecords.filter((r) => r.domain === domain && r.registry === reg)
      if (records.length === 0) return null
      return {
        id: `${domain}.${reg}`,
        label: `${reg} (${records.length})`,
        icon: 'codicon:folder' as const,
        children: records.map((r) => ({
          id: r.id,
          label: r.name,
          icon: 'codicon:file' as const,
          data: r,
        })),
      }
    })
    .filter(Boolean) as TreeNode<VaultRecord>[]
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------
export const panelTabs: TabItem[] = [
  { id: 'activity', label: 'Activity' },
  { id: 'problems', label: 'Problems' },
]

export const activityLogItems: ListItem[] = [
  { id: 'act-1', label: 'Created record: Mediation Session', description: '2 minutes ago', icon: 'codicon:add' },
  { id: 'act-2', label: 'Updated record: Custody Dispute', description: '15 minutes ago', icon: 'codicon:edit' },
  { id: 'act-3', label: 'Deleted record: Draft Notes', description: '1 hour ago', icon: 'codicon:trash' },
  { id: 'act-4', label: 'Switched domain to Legal', description: '1 hour ago', icon: 'codicon:arrow-swap' },
]

// ---------------------------------------------------------------------------
// Status Bar
// ---------------------------------------------------------------------------
export function buildStatusBarItems(domain: string, recordCount: number, registry?: string, unsaved?: number): StatusBarItem[] {
  const meta = domains.find((d) => d.id === domain)
  const left: StatusBarItem[] = [
    { id: 'domain', content: meta?.label ?? domain, align: 'left', priority: 1 },
    { id: 'records', content: `${recordCount} records`, align: 'left', priority: 2 },
  ]
  if (registry) {
    left.push({ id: 'registry', content: registry, align: 'left', priority: 3 })
  }
  if (unsaved && unsaved > 0) {
    left.push({ id: 'unsaved', content: `${unsaved} unsaved`, align: 'left', priority: 4 })
  }
  return [
    ...left,
    { id: 'undo', content: 'Undo', align: 'right', priority: 5 },
    { id: 'redo', content: 'Redo', align: 'right', priority: 6 },
  ]
}

// ---------------------------------------------------------------------------
// Default Editor Tabs
// ---------------------------------------------------------------------------
export const defaultEditorTabs: TabItem[] = [
  { id: 'legal:cases:custody-dispute', label: 'Custody Dispute', icon: 'codicon:file', closable: true, dirty: true },
  { id: 'legal:documents:retainer-agreement', label: 'Retainer Agreement', icon: 'codicon:file', closable: true },
]

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export const chatModes = ['Ask', 'Edit', 'Agent'] as const
export const chatModels = ['Claude 3.5 Sonnet', 'Claude 3 Opus'] as const
export const chatContexts = [
  { id: 'current-record', label: 'Current Record', icon: 'codicon:file' },
  { id: 'domain', label: 'Domain', icon: 'codicon:folder-library' },
  { id: 'all-records', label: 'All Records', icon: 'codicon:database' },
  { id: 'linked', label: 'Linked Records', icon: 'codicon:references' },
] as const
