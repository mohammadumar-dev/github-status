import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'
import { render as renderProfile } from './profile'
import { render as renderStats } from './stats'
import { render as renderStreak } from './streak'
import { render as renderHeatmap } from './heatmap'
import { render as renderLanguages } from './languages'
import { render as renderRepos } from './repos'
import { render as renderCommits } from './commits'
import { render as renderActivity } from './activity'

const GAP = 12

export function render(data: ProcessedGitHubData, theme: ThemeConfig, opts: CardOptions): CardRenderResult {
  const profile = renderProfile(data, theme, opts)
  const stats = renderStats(data, theme, opts)
  const streak = renderStreak(data, theme, opts)
  const heatmap = renderHeatmap(data, theme, opts)
  const languages = renderLanguages(data, theme, opts)
  const repos = renderRepos(data, theme, opts)
  const commits = renderCommits(data, theme, opts)
  const activity = renderActivity(data, theme, opts)

  // Layout:
  // Col1 (495px): profile | commits | repos
  // Col2 (300px): stats | streak | languages | activity
  // Row2 (full width): heatmap
  const col1X = 0
  const col2X = profile.width + GAP

  let col1Y = 0
  let col2Y = 0

  const col1Cards = [
    { card: profile, x: col1X, y: col1Y },
  ]
  col1Y += profile.height + GAP
  col1Cards.push({ card: commits, x: col1X, y: col1Y })
  col1Y += commits.height + GAP
  col1Cards.push({ card: repos, x: col1X, y: col1Y })
  col1Y += repos.height + GAP

  const col2Cards = [
    { card: stats, x: col2X, y: col2Y },
  ]
  col2Y += stats.height + GAP
  col2Cards.push({ card: streak, x: col2X, y: col2Y })
  col2Y += streak.height + GAP
  col2Cards.push({ card: languages, x: col2X, y: col2Y })
  col2Y += languages.height + GAP
  col2Cards.push({ card: activity, x: col2X, y: col2Y })
  col2Y += activity.height + GAP

  const topRowHeight = Math.max(col1Y, col2Y)
  const heatmapY = topRowHeight
  const totalWidth = col2X + 300
  const totalHeight = heatmapY + heatmap.height

  const cardPlacements = [
    ...col1Cards,
    ...col2Cards,
    { card: heatmap, x: 0, y: heatmapY },
  ]

  const svgContent = `
  ${cardPlacements.map(({ card, x, y }) =>
    `<g transform="translate(${x},${y})">${card.svg}</g>`
  ).join('\n')}
  `

  return { svg: svgContent, width: totalWidth, height: totalHeight }
}
