import { rect, text, cardHeader, progressBar } from '../renderer'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'

const WIDTH = 300
const HEIGHT = 205

export function render(data: ProcessedGitHubData, theme: ThemeConfig, _opts: CardOptions): CardRenderResult {
  const { languages } = data

  if (languages.length === 0) {
    const svgContent = `
    ${rect(0, 0, WIDTH, HEIGHT, { rx: 8, fill: theme.bgColor, stroke: theme.borderColor, strokeWidth: 1 })}
    ${cardHeader(16, 30, WIDTH - 32, 'Most Used Languages', 'code', theme)}
    ${text(WIDTH / 2, HEIGHT / 2 + 10, 'No language data', {
      fontSize: 12,
      fill: theme.subTextColor,
      anchor: 'middle',
    })}
    `
    return { svg: svgContent, width: WIDTH, height: HEIGHT }
  }

  // Stacked bar
  const barX = 16
  const barY = 50
  const barW = WIDTH - 32
  const barH = 8
  let currentX = barX
  const barSegments = languages.map(lang => {
    const segW = Math.max(1, Math.round((lang.percentage / 100) * barW))
    const seg = `<rect x="${currentX}" y="${barY}" width="${segW}" height="${barH}" fill="${lang.color}"/>`
    currentX += segW
    return seg
  })

  // Round the bar container
  const stackedBar = `<g>
    <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${barH / 2}" fill="${theme.borderColor}"/>
    ${barSegments.join('\n    ')}
    <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${barH / 2}" fill="none"/>
  </g>`

  // Language list
  const listStartY = 72
  const rowH = 18
  const langRows = languages.map((lang, i) => {
    const y = listStartY + i * rowH
    const barTrackX = 110
    const barTrackW = WIDTH - 16 - barTrackX - 32
    const pct = Math.min(100, lang.percentage)
    return `<g>
      <circle cx="24" cy="${y + 5}" r="5" fill="${lang.color}"/>
      ${text(34, y + 9, lang.name, {
        fontSize: 11,
        fontWeight: 600,
        fill: theme.textColor,
      })}
      ${progressBar(barTrackX, y + 2, barTrackW, 5, pct, lang.color, theme.borderColor)}
      ${text(WIDTH - 16, y + 9, `${lang.percentage.toFixed(1)}%`, {
        fontSize: 10,
        fill: theme.subTextColor,
        anchor: 'end',
      })}
    </g>`
  }).join('\n')

  const dynamicHeight = listStartY + languages.length * rowH + 12
  const finalHeight = Math.max(HEIGHT, dynamicHeight)

  const svgContent = `
  ${rect(0, 0, WIDTH, finalHeight, { rx: 8, fill: theme.bgColor, stroke: theme.borderColor, strokeWidth: 1 })}
  ${cardHeader(16, 30, WIDTH - 32, 'Most Used Languages', 'code', theme)}
  ${stackedBar}
  ${langRows}
  `

  return { svg: svgContent, width: WIDTH, height: finalHeight }
}
