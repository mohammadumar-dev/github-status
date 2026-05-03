export type ThemeId = 'default' | 'light' | 'radical' | 'tokyonight' | 'dracula'

export type CardName =
  | 'profile'
  | 'stats'
  | 'streak'
  | 'heatmap'
  | 'langs'
  | 'repos'
  | 'commits'
  | 'activity'
  | 'all'

export interface CardQueryParams {
  username: string
  theme: ThemeId
  card: string
  bg_color?: string
  title_color?: string
  text_color?: string
  icon_color?: string
  border_color?: string
  accent_color?: string
  hide_border: boolean
  hide_rank: boolean
  show_icons: boolean
  locale: string
  cache_seconds: number
  top_repos: number
  animate: boolean
}

export interface CardOptions {
  hideRank: boolean
  showIcons: boolean
  hideBorder: boolean
  animate: boolean
  topRepos: number
  locale: string
}

export interface CardRenderResult {
  svg: string
  width: number
  height: number
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalContributions: number
  streakStartDate: string | null
  streakEndDate: string | null
  longestStreakStart: string | null
  longestStreakEnd: string | null
  lastContributionDate: string | null
}

export interface LanguageItem {
  name: string
  color: string
  percentage: number
  bytes: number
}

export type LanguageDistribution = LanguageItem[]

export interface DeveloperStats {
  totalStars: number
  totalForks: number
  totalWatchers: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  totalReviews: number
  totalRepos: number
}

export interface RankInfo {
  level: 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C'
  percentile: number
  score: number
  nextLevel: string
  pointsNeeded: number
}

export interface ProcessedActivity {
  id: string
  iconName: string
  color: string
  title: string
  subtitle: string
  repoName: string
  url: string
  createdAt: string
}

export interface TopRepo {
  name: string
  fullName: string
  description: string | null
  url: string
  stars: number
  forks: number
  language: string | null
  topics: string[]
  isFork: boolean
  updatedAt: string
}

export interface CommitWeek {
  week: number
  total: number
  days: number[]
}

export interface ProcessedGitHubData {
  username: string
  profile: import('./github').GitHubUser
  stats: DeveloperStats
  streak: StreakData
  heatmap: import('./github').ContributionCalendar
  languages: LanguageDistribution
  repos: TopRepo[]
  activity: ProcessedActivity[]
  commits: CommitWeek[]
  rank: RankInfo
  fetchDurationMs: number
  fetchedAt: string
  hasPartialData: boolean
}

export interface CachedProfile {
  username: string
  profileData: import('./github').GitHubUser
  statsData: DeveloperStats
  streakData: StreakData
  heatmapData: import('./github').ContributionCalendar
  languagesData: LanguageDistribution
  reposData: TopRepo[]
  activityData: ProcessedActivity[]
  commitData: CommitWeek[]
  lastFetchedAt: Date
  expiresAt: Date
  fetchDurationMs: number | null
}

export interface CacheStatus {
  cached: boolean
  expiresAt: Date | null
  age: number
  stale: boolean
}
