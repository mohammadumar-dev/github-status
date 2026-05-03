import type { ContributionWeek } from '@/types/github'
import type { StreakData } from '@/types/card'

export function calculateStreaks(weeks: ContributionWeek[]): StreakData {
  const days = weeks
    .flatMap(w => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date))

  if (days.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
      streakStartDate: null,
      streakEndDate: null,
      longestStreakStart: null,
      longestStreakEnd: null,
      lastContributionDate: null,
    }
  }

  const totalContributions = days.reduce((sum, d) => sum + d.contributionCount, 0)

  const todayStr = new Date().toISOString().slice(0, 10)
  const yesterdayStr = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)

  let currentStreak = 0
  let streakStartDate: string | null = null
  let streakEndDate: string | null = null
  let longestStreak = 0
  let longestStreakStart: string | null = null
  let longestStreakEnd: string | null = null
  let lastContributionDate: string | null = null

  // Walk backwards from today to compute current streak
  const dayMap = new Map(days.map(d => [d.date, d.contributionCount]))

  // Find last contribution date
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      lastContributionDate = days[i].date
      break
    }
  }

  // Current streak: start from today or yesterday and go backwards
  const startFrom = dayMap.has(todayStr) && (dayMap.get(todayStr) ?? 0) > 0
    ? todayStr
    : dayMap.has(yesterdayStr) && (dayMap.get(yesterdayStr) ?? 0) > 0
    ? yesterdayStr
    : null

  if (startFrom) {
    let cursor = new Date(startFrom)
    while (true) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const count = dayMap.get(dateStr) ?? 0
      if (count === 0) break
      currentStreak++
      if (streakEndDate === null) streakEndDate = dateStr
      streakStartDate = dateStr
      cursor = new Date(cursor.getTime() - 86_400_000)
    }
  }

  // Longest streak: forward pass
  let runStart: string | null = null
  let runLength = 0

  for (const day of days) {
    if (day.contributionCount > 0) {
      if (runLength === 0) runStart = day.date
      runLength++
      if (runLength > longestStreak) {
        longestStreak = runLength
        longestStreakStart = runStart
        longestStreakEnd = day.date
      }
    } else {
      runLength = 0
      runStart = null
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalContributions,
    streakStartDate,
    streakEndDate,
    longestStreakStart,
    longestStreakEnd,
    lastContributionDate,
  }
}
