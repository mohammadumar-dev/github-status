import type { GitHubRepo } from '@/types/github'
import type { ContributionsCollection } from '@/types/github'
import type { DeveloperStats } from '@/types/card'

export function aggregateStats(
  repos: GitHubRepo[],
  contributions: ContributionsCollection | null,
): DeveloperStats {
  const ownedRepos = repos.filter(r => !r.fork)

  const totalStars = ownedRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const totalForks = ownedRepos.reduce((sum, r) => sum + r.forks_count, 0)
  const totalWatchers = ownedRepos.reduce((sum, r) => sum + r.watchers_count, 0)

  return {
    totalStars,
    totalForks,
    totalWatchers,
    totalCommits: contributions?.totalCommitContributions ?? 0,
    totalPRs: contributions?.totalPullRequestContributions ?? 0,
    totalIssues: contributions?.totalIssueContributions ?? 0,
    totalReviews: contributions?.pullRequestReviewContributions?.totalCount ?? 0,
    totalRepos: ownedRepos.length,
  }
}
