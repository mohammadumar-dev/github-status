import { rect, text, cardHeader, heatmapCell, formatNumber } from '../renderer'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'
import type { ContributionDay } from '@/types/github'

const WIDTH = 730
const HEIGHT = 165

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const CELL_SIZE = 10
const CELL_GAP = 2
const GRID_X = 38
const GRID_Y = 56

function getContributionLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

export function render(data: ProcessedGitHubData, theme: ThemeConfig, _opts: CardOptions): CardRenderResult {
  const { heatmap } = data

  // Day labels (left side)
  const dayLabelHtml = DAY_LABELS.map((label, i) => {
    if (!label) return ''
    const y = GRID_Y + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + 4
    return text(GRID_X - 4, y, label, {
      fontSize: 9,
      fill: theme.subTextColor,
      anchor: 'end',
    })
  }).join('\n')

  // Render weeks
  const cells: string[] = []
  const monthLabels: string[] = []
  let lastMonth = -1

  heatmap.weeks.forEach((week, weekIndex) => {
    const x = GRID_X + weekIndex * (CELL_SIZE + CELL_GAP)

    // Month label
    if (week.contributionDays.length > 0) {
      const firstDay = week.contributionDays[0]
      const month = new Date(firstDay.date).getMonth()
      if (month !== lastMonth) {
        monthLabels.push(text(x, GRID_Y - 8, MONTHS[month], {
          fontSize: 9,
          fill: theme.subTextColor,
        }))
        lastMonth = month
      }
    }

    // Day cells
    week.contributionDays.forEach((day: ContributionDay) => {
      const y = GRID_Y + day.weekday * (CELL_SIZE + CELL_GAP)
      const level = getContributionLevel(day.contributionCount)
      cells.push(heatmapCell(x, y, level, day.date, day.contributionCount, theme))
    })
  })

  // Legend
  const legendX = WIDTH - 120
  const legendY = HEIGHT - 14
  const legendCells = [0, 1, 2, 3, 4].map((level, i) => {
    const colorMap: Record<number, string> = {
      0: theme.heatmap.l0, 1: theme.heatmap.l1, 2: theme.heatmap.l2,
      3: theme.heatmap.l3, 4: theme.heatmap.l4,
    }
    return `<rect x="${legendX + 32 + i * 13}" y="${legendY - 8}" width="10" height="10" rx="2" fill="${colorMap[level]}"/>`
  }).join('')

  const svgContent = `
  ${rect(0, 0, WIDTH, HEIGHT, {
    rx: 8,
    fill: theme.bgColor,
    stroke: theme.borderColor,
    strokeWidth: 1,
  })}
  ${cardHeader(20, 30, WIDTH - 40, 'Contribution Activity', 'calendar', theme)}
  ${text(WIDTH - 20, 30, `${formatNumber(heatmap.totalContributions)} contributions`, {
    fontSize: 11,
    fill: theme.subTextColor,
    anchor: 'end',
  })}
  ${dayLabelHtml}
  ${monthLabels.join('\n')}
  ${cells.join('\n')}
  ${text(legendX, legendY, 'Less', { fontSize: 9, fill: theme.subTextColor })}
  ${legendCells}
  ${text(legendX + 100, legendY, 'More', { fontSize: 9, fill: theme.subTextColor })}
  `

  return { svg: svgContent, width: WIDTH, height: HEIGHT }
}
