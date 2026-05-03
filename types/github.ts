export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  default_branch: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface WeeklyCommitActivity {
  days: number[]
  total: number
  week: number
}

export type GitHubEventType =
  | 'PushEvent'
  | 'PullRequestEvent'
  | 'IssuesEvent'
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'ForkEvent'
  | 'WatchEvent'
  | 'ReleaseEvent'
  | 'IssueCommentEvent'
  | 'PullRequestReviewEvent'
  | 'PullRequestReviewCommentEvent'
  | 'CommitCommentEvent'
  | 'MemberEvent'
  | 'PublicEvent'
  | 'GollumEvent'

export interface GitHubEvent {
  id: string
  type: GitHubEventType
  actor: {
    login: string
    avatar_url: string
  }
  repo: {
    id: number
    name: string
    url: string
  }
  payload: Record<string, unknown>
  public: boolean
  created_at: string
}

export interface ContributionDay {
  date: string
  contributionCount: number
  color: string
  weekday: number
}

export interface ContributionWeek {
  firstDay: string
  contributionDays: ContributionDay[]
}

export interface ContributionCalendar {
  totalContributions: number
  colors: string[]
  isHalloween: boolean
  weeks: ContributionWeek[]
}

export interface ContributionsCollection {
  totalCommitContributions: number
  totalPullRequestContributions: number
  totalIssueContributions: number
  totalRepositoryContributions: number
  pullRequestReviewContributions: { totalCount: number }
  contributionCalendar: ContributionCalendar
}

export interface ContributionData {
  contributionsCollection: ContributionsCollection
}
