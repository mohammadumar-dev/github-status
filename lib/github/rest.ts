import { githubRest, UserNotFoundError } from './client'
import type { GitHubUser, GitHubRepo, WeeklyCommitActivity, GitHubEvent } from './types'

export async function fetchUserProfile(username: string): Promise<GitHubUser> {
  try {
    return await githubRest.get(`users/${username}`).json<GitHubUser>()
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw new UserNotFoundError(username)
    }
    throw error
  }
}

export async function fetchUserRepos(username: string, perPage = 30): Promise<GitHubRepo[]> {
  const pages: GitHubRepo[][] = []
  let page = 1
  const maxRepos = Number(process.env.MAX_REPOS_TO_SCAN ?? 30)
  const effectivePerPage = Math.min(perPage, 100)

  while (pages.flat().length < maxRepos) {
    const batch = await githubRest
      .get(`users/${username}/repos`, {
        searchParams: {
          type: 'owner',
          sort: 'pushed',
          per_page: effectivePerPage,
          page,
        },
      })
      .json<GitHubRepo[]>()

    if (batch.length === 0) break
    pages.push(batch)
    if (batch.length < effectivePerPage) break
    page++
  }

  return pages
    .flat()
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, maxRepos)
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    return await githubRest.get(`repos/${owner}/${repo}/languages`).json<Record<string, number>>()
  } catch {
    return {}
  }
}

export async function fetchRepoCommitActivity(owner: string, repo: string): Promise<WeeklyCommitActivity[]> {
  try {
    const res = await githubRest.get(`repos/${owner}/${repo}/stats/commit_activity`)
    // GitHub returns 202 (empty object {}) while stats are computing
    if (res.status === 202) return []
    const data = await res.json<unknown>()
    return Array.isArray(data) ? (data as WeeklyCommitActivity[]).filter(w => Array.isArray(w?.days)) : []
  } catch {
    return []
  }
}

export async function fetchUserEvents(username: string, perPage = 30): Promise<GitHubEvent[]> {
  try {
    return await githubRest
      .get(`users/${username}/events/public`, {
        searchParams: { per_page: perPage },
      })
      .json<GitHubEvent[]>()
  } catch {
    return []
  }
}
