import { githubGraphQL } from './client'
import type { ContributionData } from './types'

const CONTRIBUTION_QUERY = `
  query ContributionData($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        pullRequestReviewContributions { totalCount }
        contributionCalendar {
          totalContributions
          colors
          isHalloween
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              color
              weekday
            }
          }
        }
      }
    }
  }
`

interface GraphQLResult {
  user: {
    contributionsCollection: ContributionData['contributionsCollection']
  } | null
}

export async function fetchContributionData(
  username: string,
  from?: string,
  to?: string,
): Promise<ContributionData> {
  const variables: Record<string, unknown> = { username }
  if (from) variables.from = from
  if (to) variables.to = to

  const result = await githubGraphQL<GraphQLResult>(CONTRIBUTION_QUERY, variables)

  if (!result.user) {
    throw new Error(`GitHub GraphQL: user '${username}' not found`)
  }

  return {
    contributionsCollection: result.user.contributionsCollection,
  }
}
