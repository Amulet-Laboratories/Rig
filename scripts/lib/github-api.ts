/**
 * GitHub API helpers for contributor counting with pagination.
 * Uses the Link header to get accurate total contributor counts
 * without fetching every page.
 */

const GITHUB_API = 'https://api.github.com'

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return h
}

/**
 * Parse the GitHub Link header to extract the last page number.
 * Example: `<...?page=42>; rel="last"` → 42
 */
function parseLastPage(linkHeader: string | null): number | null {
  if (!linkHeader) return null
  const match = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/)
  return match ? Number(match[1]) : null
}

/**
 * Get accurate contributor count by inspecting the Link header
 * on per_page=1 requests.
 */
export async function getContributorCount(owner: string, repo: string): Promise<number> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=1&anon=true`,
      { headers: headers() },
    )
    if (!res.ok) return 0
    const lastPage = parseLastPage(res.headers.get('link'))
    return lastPage ?? 1
  } catch {
    return 0
  }
}

/**
 * Get the total number of releases.
 */
export async function getReleaseStats(
  owner: string,
  repo: string,
): Promise<{ count: number; daysSinceLast: number }> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/releases?per_page=1`, {
      headers: headers(),
    })
    if (!res.ok) return { count: 0, daysSinceLast: 999 }

    const lastPage = parseLastPage(res.headers.get('link'))
    const count = lastPage ?? 1

    const releases = (await res.json()) as { published_at?: string }[]
    let daysSinceLast = 999
    if (releases[0]?.published_at) {
      daysSinceLast = Math.round(
        (Date.now() - new Date(releases[0].published_at).getTime()) / (1000 * 60 * 60 * 24),
      )
    }

    return { count, daysSinceLast }
  } catch {
    return { count: 0, daysSinceLast: 999 }
  }
}

/**
 * Get basic repo metadata (stars, open issues, license, age).
 */
export async function getRepoMeta(
  owner: string,
  repo: string,
): Promise<{
  stars: number
  openIssues: number
  license: string
  ageInDays: number
} | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers: headers() })
    if (!res.ok) return null
    const data = (await res.json()) as {
      stargazers_count?: number
      open_issues_count?: number
      license?: { spdx_id?: string }
      created_at?: string
    }
    return {
      stars: data.stargazers_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
      license: data.license?.spdx_id ?? 'unknown',
      ageInDays: data.created_at
        ? Math.round((Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    }
  } catch {
    return null
  }
}
