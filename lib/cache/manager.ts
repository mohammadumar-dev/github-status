import { prisma } from '@/lib/prisma'
import { fetchAllGitHubData } from '@/lib/github/fetcher'
import type { ProcessedGitHubData } from '@/types/card'
import type { CacheStatus } from './types'

class CacheManager {
  async get(username: string): Promise<ProcessedGitHubData | null> {
    try {
      const cached = await prisma.githubProfileCache.findUnique({
        where: { username },
      })

      if (!cached) return null
      if (cached.expiresAt < new Date()) return null

      return this.hydrate(cached)
    } catch (err) {
      console.error('[Cache] get error:', err)
      return null
    }
  }

  async set(username: string, data: ProcessedGitHubData, ttlSeconds: number): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000)

    try {
      await prisma.githubProfileCache.upsert({
        where: { username },
        create: {
          username,
          profileData: data.profile as object,
          statsData: data.stats as object,
          streakData: data.streak as object,
          heatmapData: data.heatmap as object,
          languagesData: data.languages as unknown as object,
          reposData: data.repos as unknown as object,
          activityData: data.activity as unknown as object,
          commitData: data.commits as unknown as object,
          lastFetchedAt: new Date(),
          expiresAt,
          fetchDurationMs: data.fetchDurationMs,
        },
        update: {
          profileData: data.profile as object,
          statsData: data.stats as object,
          streakData: data.streak as object,
          heatmapData: data.heatmap as object,
          languagesData: data.languages as unknown as object,
          reposData: data.repos as unknown as object,
          activityData: data.activity as unknown as object,
          commitData: data.commits as unknown as object,
          lastFetchedAt: new Date(),
          expiresAt,
          fetchDurationMs: data.fetchDurationMs,
          errorCount: 0,
          lastError: null,
        },
      })
    } catch (err) {
      console.error('[Cache] set error:', err)
    }
  }

  async invalidate(username: string): Promise<void> {
    try {
      await prisma.githubProfileCache.updateMany({
        where: { username },
        data: { expiresAt: new Date(Date.now() - 1000) },
      })
    } catch (err) {
      console.error('[Cache] invalidate error:', err)
    }
  }

  async getOrFetch(username: string, ttlSeconds = 3600): Promise<ProcessedGitHubData> {
    // Check for fresh cache
    const fresh = await this.get(username)
    if (fresh) return fresh

    try {
      // Fetch from GitHub
      const data = await fetchAllGitHubData(username)
      await this.set(username, data, ttlSeconds)
      return data
    } catch (fetchErr) {
      // On GitHub fetch failure, return stale data if available
      const stale = await this.getStale(username)
      if (stale) {
        console.warn(`[Cache] Returning stale data for ${username} due to fetch error:`, fetchErr)
        return stale
      }
      throw fetchErr
    }
  }

  async getCacheStatus(username: string): Promise<CacheStatus> {
    try {
      const cached = await prisma.githubProfileCache.findUnique({
        where: { username },
        select: { expiresAt: true, lastFetchedAt: true },
      })

      if (!cached) {
        return { cached: false, expiresAt: null, age: 0, stale: false }
      }

      const now = Date.now()
      const age = Math.floor((now - cached.lastFetchedAt.getTime()) / 1000)
      const stale = cached.expiresAt < new Date()

      return { cached: true, expiresAt: cached.expiresAt, age, stale }
    } catch {
      return { cached: false, expiresAt: null, age: 0, stale: false }
    }
  }

  private async getStale(username: string): Promise<ProcessedGitHubData | null> {
    try {
      const cached = await prisma.githubProfileCache.findUnique({
        where: { username },
      })
      return cached ? this.hydrate(cached) : null
    } catch {
      return null
    }
  }

  private hydrate(cached: {
    username: string
    profileData: unknown
    statsData: unknown
    streakData: unknown
    heatmapData: unknown
    languagesData: unknown
    reposData: unknown
    activityData: unknown
    commitData: unknown
    lastFetchedAt: Date
    expiresAt: Date
    fetchDurationMs: number | null
  }): ProcessedGitHubData {
    return {
      username: cached.username,
      profile: cached.profileData as ProcessedGitHubData['profile'],
      stats: cached.statsData as ProcessedGitHubData['stats'],
      streak: cached.streakData as ProcessedGitHubData['streak'],
      heatmap: cached.heatmapData as ProcessedGitHubData['heatmap'],
      languages: cached.languagesData as ProcessedGitHubData['languages'],
      repos: cached.reposData as ProcessedGitHubData['repos'],
      activity: cached.activityData as ProcessedGitHubData['activity'],
      commits: cached.commitData as ProcessedGitHubData['commits'],
      rank: { level: 'C', percentile: 95, score: 0, nextLevel: 'C+', pointsNeeded: 30 },
      fetchDurationMs: cached.fetchDurationMs ?? 0,
      fetchedAt: cached.lastFetchedAt.toISOString(),
      hasPartialData: false,
    }
  }
}

export const cacheManager = new CacheManager()
