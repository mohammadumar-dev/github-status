import { rect, text, cardHeader, circleBadge, formatNumber } from '../renderer'
import { MONO_FONT_STACK } from '../fonts'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'

const WIDTH = 495
const HEIGHT = 220

export function render(data: ProcessedGitHubData, theme: ThemeConfig, opts: CardOptions): CardRenderResult {
  const { stats, rank } = data

  const tiles = [
    { value: formatNumber(stats.totalStars), label: 'Total Stars', color: '#F59E0B', icon: '⭐' },
    { value: formatNumber(stats.totalForks), label: 'Total Forks', color: theme.accentColor, icon: '🍴' },
    { value: formatNumber(stats.totalCommits), label: 'Commits (yr)', color: '#10B981', icon: '📦' },
    { value: formatNumber(stats.totalPRs), label: 'Pull Requests', color: '#8B5CF6', icon: '🔀' },
    { value: formatNumber(stats.totalIssues), label: 'Issues', color: '#EC4899', icon: '🐛' },
    { value: formatNumber(stats.totalReviews), label: 'Code Reviews', color: '#3B82F6', icon: '👁' },
  ]

  const tileW = 140
  const tileH = 60
  const cols = 3
  const startX = 20
  const startY = 55

  const tilesHtml = tiles.map((tile, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * (tileW + 8)
    const y = startY + row * (tileH + 8)

    return `<g>
      ${rect(x, y, tileW, tileH, { rx: 4, fill: theme.bgColor, stroke: theme.borderColor, strokeWidth: 1 })}
      ${text(x + tileW / 2, y + 24, tile.value, {
        fontSize: 20,
        fontWeight: 700,
        fill: tile.color,
        anchor: 'middle',
        fontFamily: MONO_FONT_STACK,
      })}
      ${text(x + tileW / 2, y + 42, tile.label, {
        fontSize: 10,
        fill: theme.subTextColor,
        anchor: 'middle',
      })}
    </g>`
  }).join('\n')

  const badgeContent = !opts.hideRank ? circleBadge(
    WIDTH - 52,
    50,
    30,
    rank.level,
    `Top ${rank.percentile}%`,
    theme,
  ) : ''

  const svgContent = `
  ${rect(0, 0, WIDTH, HEIGHT, {
    rx: 8,
    fill: theme.bgColor,
    stroke: theme.borderColor,
    strokeWidth: 1,
  })}
  ${cardHeader(20, 30, WIDTH - 40, 'Developer Stats', 'chart', theme)}
  ${tilesHtml}
  ${badgeContent}
  `

  return { svg: svgContent, width: WIDTH, height: HEIGHT }
}
