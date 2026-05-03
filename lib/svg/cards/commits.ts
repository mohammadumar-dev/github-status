import { rect, text, cardHeader, sparkline, formatNumber } from '../renderer'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'

const WIDTH = 495
const HEIGHT = 165

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function render(data: ProcessedGitHubData, theme: ThemeConfig, _opts: CardOptions): CardRenderResult {
  const { commits } = data

  const weeklyTotals = commits.length > 0 ? commits.map(w => w.total) : Array(52).fill(0)
  const nonZero = weeklyTotals.filter(v => v > 0)

  // Aggregate to monthly for x-axis labels
  const chartX = 40
  const chartY = 46
  const chartW = WIDTH - 60
  const chartH = 75

  // Grid lines
  const maxVal = Math.max(...weeklyTotals, 1)
  const gridLines = [0.25, 0.5, 0.75, 1].map(pct => {
    const lineY = chartY + chartH - pct * chartH
    return `<line x1="${chartX}" y1="${lineY}" x2="${chartX + chartW}" y2="${lineY}"
      stroke="${theme.borderColor}" stroke-width="0.5" opacity="0.5"/>`
  }).join('\n')

  // X-axis month labels (6 evenly spaced)
  const labelIndices = [0, 8, 17, 26, 35, 44]
  const xLabels = labelIndices.map(i => {
    const week = commits[i]
    if (!week) return ''
    const month = new Date(week.week * 1000).getMonth()
    const px = chartX + (i / Math.max(weeklyTotals.length - 1, 1)) * chartW
    return text(px, chartY + chartH + 14, MONTHS[month], {
      fontSize: 9,
      fill: theme.subTextColor,
      anchor: 'middle',
    })
  }).join('\n')

  // Average dashed line
  const avg = nonZero.length > 0 ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length : 0
  const avgY = chartY + chartH - (avg / maxVal) * chartH
  const avgLine = avg > 0 ? `<line x1="${chartX}" y1="${avgY}" x2="${chartX + chartW}" y2="${avgY}"
    stroke="${theme.subTextColor}" stroke-width="1" stroke-dasharray="4,4" opacity="0.5"/>` : ''

  // Last point highlight dot
  const lastVal = weeklyTotals[weeklyTotals.length - 1] ?? 0
  const lastX = chartX + chartW
  const lastY = chartY + chartH - (lastVal / maxVal) * chartH
  const highlightDot = lastVal > 0
    ? `<circle cx="${lastX}" cy="${lastY}" r="4" fill="${theme.accentColor}"/>`
    : ''

  // Summary row
  const peak = Math.max(...weeklyTotals)
  const total = weeklyTotals.reduce((a, b) => a + b, 0)
  const summaryY = HEIGHT - 14
  const summaryItems = [
    { label: 'Peak/wk', value: formatNumber(peak) },
    { label: 'Avg/wk', value: formatNumber(Math.round(avg)) },
    { label: 'Total', value: formatNumber(total) },
  ]

  const summaryHtml = summaryItems.map((item, i) => {
    const itemX = 20 + i * 150
    return `${text(itemX, summaryY, `${item.label}: `, {
      fontSize: 10,
      fill: theme.subTextColor,
    })}${text(itemX + 48, summaryY, item.value, {
      fontSize: 10,
      fontWeight: 700,
      fill: theme.statNumColor,
    })}`
  }).join('\n')

  const svgContent = `
  ${rect(0, 0, WIDTH, HEIGHT, { rx: 8, fill: theme.bgColor, stroke: theme.borderColor, strokeWidth: 1 })}
  ${cardHeader(20, 30, WIDTH - 40, 'Commit Activity', 'chart', theme)}
  ${gridLines}
  ${sparkline(chartX, chartY, chartW, chartH, weeklyTotals, theme.accentColor)}
  ${avgLine}
  ${highlightDot}
  ${xLabels}
  ${summaryHtml}
  `

  return { svg: svgContent, width: WIDTH, height: HEIGHT }
}
