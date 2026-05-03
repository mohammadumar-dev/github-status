import { fetchUserProfile, fetchUserRepos, fetchRepoLanguages, fetchRepoCommitActivity, fetchUserEvents } from './rest'
import { fetchContributionData } from './graphql'
import { calculateStreaks } from '@/lib/processing/streak'
import { aggregateLanguages } from '@/lib/processing/languages'
import { aggregateStats } from '@/lib/processing/stats'
import { calculateRank } from '@/lib/processing/rank'
import { processEvents } from '@/lib/processing/activity'
import type { ProcessedGitHubData, TopRepo, CommitWeek } from '@/types/card'
import type { GitHubRepo } from './types'

export async function fetchAllGitHubData(username: string): Promise<ProcessedGitHubData> {
  const startTime = Date.now()

  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString()
  const yearEnd = now.toISOString()

  const [profileResult, reposResult, contributionResult, eventsResult] = await Promise.allSettled([
    fetchUserProfile(username),
    fetchUserRepos(username, 30),
    fetchContributionData(username, yearStart, yearEnd),
    fetchUserEvents(username, 30),
  ])

  if (profileResult.status === 'rejected') {
    throw profileResult.reason
  }

  const profile = profileResult.value
  const repos = reposResult.status === 'fulfilled' ? reposResult.value : []
  const contributions = contributionResult.status === 'fulfilled' ? contributionResult.value : null
  const events = eventsResult.status === 'fulfilled' ? eventsResult.value : []

  const top10Repos = repos.slice(0, 10)
  const top5Repos = repos.slice(0, 5)

  const [languageResults, commitActivityResults] = await Promise.all([
    Promise.allSettled(top10Repos.map(r => fetchRepoLanguages(r.owner.login, r.name))),
    Promise.allSettled(top5Repos.map(r => fetchRepoCommitActivity(r.owner.login, r.name))),
  ])

  const langMaps = languageResults
    .filter((r): r is PromiseFulfilledResult<Record<string, number>> => r.status === 'fulfilled')
    .map(r => r.value)

  const allCommitWeeks = commitActivityResults
    .filter((r): r is PromiseFulfilledResult<import('./types').WeeklyCommitActivity[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter((w): w is import('./types').WeeklyCommitActivity => Array.isArray(w?.days))

  const aggregatedCommits = aggregateCommitWeeks(allCommitWeeks)

  const calendar = contributions?.contributionsCollection.contributionCalendar ?? {
    totalContributions: 0,
    colors: [],
    isHalloween: false,
    weeks: [],
  }

  const stats = aggregateStats(
    repos,
    contributions?.contributionsCollection ?? null,
  )

  const streak = calculateStreaks(calendar.weeks)
  const languages = aggregateLanguages(langMaps)
  const rank = calculateRank(stats)
  const activity = processEvents(events)

  const topRepos: TopRepo[] = repos.slice(0, 6).map(mapToTopRepo)

  const fetchDurationMs = Date.now() - startTime
  const hasPartialData =
    reposResult.status === 'rejected' ||
    contributionResult.status === 'rejected' ||
    eventsResult.status === 'rejected'

  return {
    username,
    profile,
    stats,
    streak,
    heatmap: calendar,
    languages,
    repos: topRepos,
    activity,
    commits: aggregatedCommits,
    rank,
    fetchDurationMs,
    fetchedAt: new Date().toISOString(),
    hasPartialData,
  }
}

function mapToTopRepo(repo: GitHubRepo): TopRepo {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics ?? [],
    isFork: repo.fork,
    updatedAt: repo.pushed_at ?? repo.updated_at,
  }
}

function aggregateCommitWeeks(weeks: import('./types').WeeklyCommitActivity[]): CommitWeek[] {
  const byWeek = new Map<number, CommitWeek>()

  for (const w of weeks) {
    const existing = byWeek.get(w.week)
    if (existing) {
      existing.total += w.total
      existing.days = existing.days.map((d, i) => d + (w.days[i] ?? 0))
    } else {
      byWeek.set(w.week, { week: w.week, total: w.total, days: [...w.days] })
    }
  }

  return Array.from(byWeek.values()).sort((a, b) => a.week - b.week).slice(-52)
}
