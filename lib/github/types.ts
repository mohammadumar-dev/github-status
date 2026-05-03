// Re-export from root types for backwards compat within this module
export type {
  GitHubUser,
  GitHubRepo,
  WeeklyCommitActivity,
  GitHubEvent,
  GitHubEventType,
  ContributionDay,
  ContributionWeek,
  ContributionCalendar,
  ContributionsCollection,
  ContributionData,
} from '@/types/github'

export interface GraphQLResponse<T> {
  data: T
  errors?: Array<{ message: string; locations?: unknown; path?: unknown }>
}

export interface GitHubGraphQLUser {
  user: ContributionData
}

import type { ContributionData } from '@/types/github'
