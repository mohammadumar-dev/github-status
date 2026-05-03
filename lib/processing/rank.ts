import type { DeveloperStats, RankInfo } from '@/types/card'

type Level = 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C'

interface LevelConfig {
  level: Level
  minScore: number
  nextLevel: string
}

const LEVELS: LevelConfig[] = [
  { level: 'S',  minScore: 5000, nextLevel: 'Legend' },
  { level: 'A+', minScore: 2000, nextLevel: 'S'  },
  { level: 'A',  minScore: 800,  nextLevel: 'A+' },
  { level: 'B+', minScore: 300,  nextLevel: 'A'  },
  { level: 'B',  minScore: 100,  nextLevel: 'B+' },
  { level: 'C+', minScore: 30,   nextLevel: 'B'  },
  { level: 'C',  minScore: 0,    nextLevel: 'C+' },
]

const PERCENTILE_MAP: Record<Level, number> = {
  S:   0.5,
  'A+': 5,
  A:   20,
  'B+': 40,
  B:   60,
  'C+': 80,
  C:   95,
}

export function calculateRank(stats: DeveloperStats): RankInfo {
  const score =
    stats.totalStars   * 2   +
    stats.totalForks   * 1.5 +
    stats.totalCommits * 1   +
    stats.totalPRs     * 2   +
    stats.totalIssues  * 0.5 +
    stats.totalReviews * 1.5

  const config = LEVELS.find(l => score >= l.minScore) ?? LEVELS[LEVELS.length - 1]
  const nextConfig = LEVELS.find(l => l.level === config.nextLevel)
  const pointsNeeded = nextConfig ? Math.max(0, Math.ceil(nextConfig.minScore - score)) : 0

  return {
    level: config.level,
    percentile: PERCENTILE_MAP[config.level],
    score: Math.round(score),
    nextLevel: config.nextLevel,
    pointsNeeded,
  }
}
