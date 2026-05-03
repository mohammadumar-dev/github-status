export interface CacheStatus {
  cached: boolean
  expiresAt: Date | null
  age: number
  stale: boolean
}

export interface CacheHit {
  data: import('@/types/card').ProcessedGitHubData
  fromCache: true
  stale: boolean
}

export interface CacheMiss {
  data: import('@/types/card').ProcessedGitHubData
  fromCache: false
  stale: false
}

export type CacheResult = CacheHit | CacheMiss
