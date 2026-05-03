import { rect, text, cardHeader, progressBar, formatNumber } from '../renderer'
import { MONO_FONT_STACK } from '../fonts'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'

const WIDTH = 495
const HEIGHT = 155

export function render(data: ProcessedGitHubData, theme: ThemeConfig, _opts: CardOptions): CardRenderResult {
  const { streak } = data

  const columns = [
    {
      icon: '🏆',
      value: String(streak.longestStreak),
      label: 'Longest Streak',
      sublabel: streak.longestStreakStart
        ? `${streak.longestStreakStart} – ${streak.longestStreakEnd ?? ''}`
        : 'N/A',
      color: '#F59E0B',
    },
    {
      icon: '🔥',
      value: String(streak.currentStreak),
      label: 'Current Streak',
      sublabel: streak.streakStartDate
        ? `${streak.streakStartDate} – now`
        : streak.lastContributionDate
        ? `Last: ${streak.lastContributionDate}`
        : 'No active streak',
      color: '#EF4444',
      isCenter: true,
    },
    {
      icon: '📈',
      value: formatNumber(streak.totalContributions),
      label: 'Total Contributions',
      sublabel: 'This year',
      color: '#10B981',
    },
  ]

  const colW = WIDTH / 3
  const centerY = 92

  const columnsHtml = columns.map((col, i) => {
    const cx = colW * i + colW / 2
    return `<g>
      ${text(cx, centerY - 32, col.icon, {
        fontSize: col.isCenter ? 24 : 18,
        anchor: 'middle',
      })}
      ${text(cx, centerY, col.value, {
        fontSize: col.isCenter ? 28 : 22,
        fontWeight: 700,
        fill: col.color,
        anchor: 'middle',
        fontFamily: MONO_FONT_STACK,
      })}
      ${text(cx, centerY + 16, col.label, {
        fontSize: 11,
        fill: theme.textColor,
        anchor: 'middle',
      })}
      ${text(cx, centerY + 28, col.sublabel, {
        fontSize: 9,
        fill: theme.subTextColor,
        anchor: 'middle',
        maxWidth: 28,
      })}
    </g>`
  }).join('\n')

  const vertDividers = [1, 2].map(i => {
    const x = colW * i
    return `<line x1="${x}" y1="46" x2="${x}" y2="${HEIGHT - 20}" stroke="${theme.borderColor}" stroke-width="1"/>`
  }).join('\n')

  // Progress toward next milestone (next multiple of 100)
  const nextMilestone = Math.ceil((streak.currentStreak + 1) / 50) * 50
  const progressPct = nextMilestone > 0 ? (streak.currentStreak / nextMilestone) * 100 : 0

  const svgContent = `
  ${rect(0, 0, WIDTH, HEIGHT, {
    rx: 8,
    fill: theme.bgColor,
    stroke: theme.borderColor,
    strokeWidth: 1,
  })}
  ${cardHeader(20, 30, WIDTH - 40, 'Contribution Streak', 'fire', theme)}
  ${columnsHtml}
  ${vertDividers}
  ${progressBar(20, HEIGHT - 16, WIDTH - 40, 5, progressPct, theme.accentColor, theme.borderColor)}
  ${text(WIDTH / 2, HEIGHT - 4, `Next milestone: ${nextMilestone} days`, {
    fontSize: 9,
    fill: theme.subTextColor,
    anchor: 'middle',
  })}
  `

  return { svg: svgContent, width: WIDTH, height: HEIGHT }
}
