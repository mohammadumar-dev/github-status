import { rect, text, cardHeader, truncateText, relativeTime } from '../renderer'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'

const WIDTH = 300

export function render(data: ProcessedGitHubData, theme: ThemeConfig, _opts: CardOptions): CardRenderResult {
  const events = data.activity.slice(0, 6)
  const rowH = 36
  const startY = 46
  const totalHeight = startY + events.length * rowH + 12

  const eventRows = events.map((event, i) => {
    const y = startY + i * rowH
    const isLast = i === events.length - 1

    return `<g>
      <!-- Timeline dot -->
      <circle cx="28" cy="${y + 10}" r="5" fill="${event.color}"/>
      <!-- Connecting line -->
      ${!isLast ? `<line x1="28" y1="${y + 16}" x2="28" y2="${y + rowH}" stroke="${theme.borderColor}" stroke-width="1"/>` : ''}
      <!-- Event title -->
      ${text(40, y + 10, truncateText(event.title, 28), {
        fontSize: 11,
        fontWeight: 600,
        fill: theme.textColor,
      })}
      <!-- Repo name -->
      ${text(40, y + 24, truncateText(event.repoName.split('/')[1] ?? event.repoName, 22), {
        fontSize: 10,
        fill: theme.accentColor,
      })}
      <!-- Timestamp -->
      ${text(WIDTH - 12, y + 10, relativeTime(event.createdAt), {
        fontSize: 9,
        fill: theme.subTextColor,
        anchor: 'end',
      })}
    </g>`
  }).join('\n')

  const emptyState = events.length === 0
    ? text(WIDTH / 2, totalHeight / 2, 'No recent activity', {
        fontSize: 12,
        fill: theme.subTextColor,
        anchor: 'middle',
      })
    : ''

  const svgContent = `
  ${rect(0, 0, WIDTH, totalHeight, { rx: 8, fill: theme.bgColor, stroke: theme.borderColor, strokeWidth: 1 })}
  ${cardHeader(16, 30, WIDTH - 32, 'Recent Activity', 'clock', theme)}
  ${eventRows}
  ${emptyState}
  `

  return { svg: svgContent, width: WIDTH, height: totalHeight }
}
