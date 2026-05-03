import { rect, text, cardHeader, divider, truncateText, escapeXml } from '../renderer'
import { MONO_FONT_STACK } from '../fonts'
import { getLanguageColor } from '@/lib/processing/languages'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData, TopRepo } from '@/types/card'

const WIDTH = 495

export function render(data: ProcessedGitHubData, theme: ThemeConfig, opts: CardOptions): CardRenderResult {
  const repos = data.repos.slice(0, opts.topRepos)
  const repoH = 76
  const startY = 46
  const totalHeight = startY + repos.length * repoH + 8

  const reposHtml = repos.map((repo, i) => renderRepo(repo, i, startY, repoH, theme)).join('\n')

  const svgContent = `
  ${rect(0, 0, WIDTH, totalHeight, { rx: 8, fill: theme.bgColor, stroke: theme.borderColor, strokeWidth: 1 })}
  ${cardHeader(20, 30, WIDTH - 40, 'Top Repositories', 'code', theme)}
  ${reposHtml}
  `

  return { svg: svgContent, width: WIDTH, height: totalHeight }
}

function renderRepo(repo: TopRepo, index: number, startY: number, repoH: number, theme: ThemeConfig): string {
  const y = startY + index * repoH
  const langColor = repo.language ? getLanguageColor(repo.language) : theme.subTextColor

  const topicPills = repo.topics.slice(0, 3).map((topic, i) => {
    const pillX = 20 + i * 80
    return `<g>
      <rect x="${pillX}" y="${y + 40}" width="70" height="14" rx="7" fill="${theme.borderColor}"/>
      ${text(pillX + 35, y + 49, truncateText(topic, 9), {
        fontSize: 9,
        fill: theme.subTextColor,
        anchor: 'middle',
      })}
    </g>`
  }).join('')

  const metaItems = [
    repo.language ? `<circle cx="20" cy="${y + 66}" r="5" fill="${langColor}"/>${text(28, y + 69, repo.language, { fontSize: 10, fill: theme.subTextColor })}` : '',
    `${text(140, y + 69, `⭐ ${repo.stars}`, { fontSize: 10, fill: theme.subTextColor })}`,
    `${text(190, y + 69, `🍴 ${repo.forks}`, { fontSize: 10, fill: theme.subTextColor })}`,
  ].filter(Boolean).join('')

  return `<g>
    ${index > 0 ? divider(20, y, WIDTH - 40, theme) : ''}
    ${text(20, y + 14, escapeXml(repo.name), {
      fontSize: 13,
      fontWeight: 700,
      fill: theme.accentColor,
      fontFamily: MONO_FONT_STACK,
    })}
    ${repo.isFork ? text(20 + repo.name.length * 8 + 8, y + 14, '(fork)', {
      fontSize: 10,
      fill: theme.subTextColor,
    }) : ''}
    ${repo.description ? text(20, y + 28, truncateText(repo.description, 55), {
      fontSize: 11,
      fill: theme.subTextColor,
    }) : ''}
    ${topicPills}
    ${metaItems}
  </g>`
}
