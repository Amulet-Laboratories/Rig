import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const CACHE_DIR = resolve(import.meta.dirname!, '../../.health/cache')
const CACHE_FILE = resolve(CACHE_DIR, 'intelligence-ecosystem.json')
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

interface NpmDownloads {
  downloads: number
}

interface EcosystemData {
  githubStars: number
  weeklyDownloads: number
  monthlyDownloads: number
  releaseCount: number
  daysSinceLastRelease: number
  openIssues: number
  contributorCount: number
  ageInDays: number
  license: string
}

interface CacheEntry {
  timestamp: string
  data: Record<string, EcosystemData>
}

function loadCache(): CacheEntry | null {
  if (!existsSync(CACHE_FILE)) return null
  try {
    const raw = JSON.parse(readFileSync(CACHE_FILE, 'utf-8')) as CacheEntry
    const age = Date.now() - new Date(raw.timestamp).getTime()
    if (age > CACHE_TTL_MS) return null
    return raw
  } catch {
    return null
  }
}

function saveCache(data: Record<string, EcosystemData>): void {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true })
  writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: new Date().toISOString(), data }, null, 2))
}

async function fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T | null> {
  try {
    const res = await fetch(url, { headers })
    if (!res.ok) {
      console.warn(`  [warn] ${url} → ${res.status}`)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    console.warn(`  [warn] fetch failed: ${url}`, e)
    return null
  }
}

export async function collectEcosystem(
  libraries: { id: string; npm: string; github: string }[],
): Promise<Record<string, EcosystemData>> {
  const cache = loadCache()
  if (cache) {
    console.log('  [cache] ecosystem data is fresh, skipping API calls')
    return cache.data
  }

  const results: Record<string, EcosystemData> = {}
  const ghHeaders: Record<string, string> = {}
  if (process.env.GITHUB_TOKEN) {
    ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  for (const lib of libraries) {
    console.log(`  [fetch] ${lib.id}...`)
    const eco: EcosystemData = {
      githubStars: 0,
      weeklyDownloads: 0,
      monthlyDownloads: 0,
      releaseCount: 0,
      daysSinceLastRelease: 999,
      openIssues: 0,
      contributorCount: 0,
      ageInDays: 0,
      license: 'unknown',
    }

    // npm downloads
    if (lib.npm) {
      const weeklyDl = await fetchJson<NpmDownloads>(
        `https://api.npmjs.org/downloads/point/last-week/${lib.npm}`,
      )
      if (weeklyDl) eco.weeklyDownloads = weeklyDl.downloads

      const monthlyDl = await fetchJson<NpmDownloads>(
        `https://api.npmjs.org/downloads/point/last-month/${lib.npm}`,
      )
      if (monthlyDl) eco.monthlyDownloads = monthlyDl.downloads

      // npm registry for license + created date
      const registry = await fetchJson<{ license?: string; time?: Record<string, string> }>(
        `https://registry.npmjs.org/${lib.npm}`,
      )
      if (registry) {
        eco.license = registry.license ?? 'unknown'
        if (registry.time?.created) {
          eco.ageInDays = Math.round(
            (Date.now() - new Date(registry.time.created).getTime()) / (1000 * 60 * 60 * 24),
          )
        }
      }
    }

    // GitHub
    if (lib.github) {
      const repo = await fetchJson<{
        stargazers_count?: number
        open_issues_count?: number
        license?: { spdx_id?: string }
        created_at?: string
      }>(`https://api.github.com/repos/${lib.github}`, ghHeaders)
      if (repo) {
        eco.githubStars = repo.stargazers_count ?? 0
        eco.openIssues = repo.open_issues_count ?? 0
        if (repo.license?.spdx_id) eco.license = repo.license.spdx_id
        if (repo.created_at && eco.ageInDays === 0) {
          eco.ageInDays = Math.round(
            (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24),
          )
        }
      }

      // Contributors (first page count)
      const contributors = await fetchJson<unknown[]>(
        `https://api.github.com/repos/${lib.github}/contributors?per_page=1&anon=true`,
        ghHeaders,
      )
      // GitHub returns Link header with last page count, but simplified here
      if (contributors) eco.contributorCount = contributors.length

      // Releases
      const releases = await fetchJson<{ published_at?: string }[]>(
        `https://api.github.com/repos/${lib.github}/releases?per_page=100`,
        ghHeaders,
      )
      if (releases) {
        eco.releaseCount = releases.length
        if (releases[0]?.published_at) {
          eco.daysSinceLastRelease = Math.round(
            (Date.now() - new Date(releases[0].published_at).getTime()) / (1000 * 60 * 60 * 24),
          )
        }
      }
    }

    results[lib.id] = eco
  }

  saveCache(results)
  return results
}
