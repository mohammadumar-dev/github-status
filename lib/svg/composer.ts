import { getTheme } from './themes'
import { svgRoot, rect, text } from './renderer'
import { FONT_FACE_CSS } from './fonts'
import type { ThemeConfig } from './themes'
import type { CardQueryParams } from '@/lib/validators/card-params'
import type { ProcessedGitHubData, CardOptions } from '@/types/card'
import { render as renderProfile } from './cards/profile'
import { render as renderStats } from './cards/stats'
import { render as renderStreak } from './cards/streak'
import { render as renderHeatmap } from './cards/heatmap'
import { render as renderLanguages } from './cards/languages'
import { render as renderRepos } from './cards/repos'
import { render as renderCommits } from './cards/commits'
import { render as renderActivity } from './cards/activity'
import { render as renderAll } from './cards/all'

type CardRenderer = (
  data: ProcessedGitHubData,
  theme: ThemeConfig,
  opts: CardOptions,
) => { svg: string; width: number; height: number }

const CARD_RENDERERS: Record<string, CardRenderer> = {
  profile: renderProfile,
  stats: renderStats,
  streak: renderStreak,
  heatmap: renderHeatmap,
  langs: renderLanguages,
  repos: renderRepos,
  commits: renderCommits,
  activity: renderActivity,
  all: renderAll,
}

interface ComposeResult {
  svg: string
  contentType: string
  cacheSeconds: number
}

export function composeCards(
  username: string,
  params: CardQueryParams,
  data: ProcessedGitHubData,
): ComposeResult {
  let theme = getTheme(params.theme)

  // Apply color overrides
  if (params.bg_color || params.title_color || params.text_color ||
      params.icon_color || params.border_color || params.accent_color) {
    theme = {
      ...theme,
      ...(params.bg_color && { bgColor: `#${params.bg_color}` }),
      ...(params.title_color && { titleColor: `#${params.title_color}` }),
      ...(params.text_color && { textColor: `#${params.text_color}`, subTextColor: `#${params.text_color}` }),
      ...(params.icon_color && { iconColor: `#${params.icon_color}` }),
      ...(params.border_color && { borderColor: `#${params.border_color}` }),
      ...(params.accent_color && { accentColor: `#${params.accent_color}` }),
    }
  }

  const opts: CardOptions = {
    hideRank: params.hide_rank,
    showIcons: params.show_icons,
    hideBorder: params.hide_border,
    animate: params.animate,
    topRepos: params.top_repos,
    locale: params.locale,
  }

  const cardParam = params.card.toLowerCase().trim()

  // Single card or 'all' composite
  if (cardParam === 'all') {
    const result = renderAll(data, theme, opts)
    const svg = wrapInRoot(result.svg, result.width, result.height, theme)
    return { svg, contentType: 'image/svg+xml', cacheSeconds: params.cache_seconds }
  }

  if (CARD_RENDERERS[cardParam]) {
    const result = CARD_RENDERERS[cardParam](data, theme, opts)
    const svg = wrapInRoot(result.svg, result.width, result.height, theme)
    return { svg, contentType: 'image/svg+xml', cacheSeconds: params.cache_seconds }
  }

  // Comma-separated list of cards stacked vertically
  const cardNames = cardParam.split(',').map(c => c.trim()).filter(c => CARD_RENDERERS[c])
  if (cardNames.length === 0) {
    // Fall back to 'all' if no valid card names
    const result = renderAll(data, theme, opts)
    const svg = wrapInRoot(result.svg, result.width, result.height, theme)
    return { svg, contentType: 'image/svg+xml', cacheSeconds: params.cache_seconds }
  }

  const GAP = 12
  const cards = cardNames.map(name => CARD_RENDERERS[name](data, theme, opts))
  const maxWidth = Math.max(...cards.map(c => c.width))
  let currentY = 0
  const stacked = cards.map(card => {
    const g = `<g transform="translate(0,${currentY})">${card.svg}</g>`
    currentY += card.height + GAP
    return g
  })
  const totalHeight = currentY - GAP

  const svg = wrapInRoot(stacked.join('\n'), maxWidth, totalHeight, theme)
  return { svg, contentType: 'image/svg+xml', cacheSeconds: params.cache_seconds }
}

function wrapInRoot(children: string, width: number, height: number, theme: ThemeConfig): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>${FONT_FACE_CSS}</style>
  </defs>
  ${children}
</svg>`
}

export function makeErrorSvg(message: string): string {
  const theme = getTheme('default')
  const WIDTH = 495
  const HEIGHT = 120
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs><style>${FONT_FACE_CSS}</style></defs>
  ${rect(0, 0, WIDTH, HEIGHT, { rx: 8, fill: theme.bgColor, stroke: '#F87171', strokeWidth: 1 })}
  ${text(20, 44, '⚠', { fontSize: 24 })}
  ${text(52, 44, 'Error', { fontSize: 16, fontWeight: 700, fill: '#F87171' })}
  ${text(20, 68, message.slice(0, 60), { fontSize: 12, fill: theme.subTextColor })}
  ${text(20, 86, message.length > 60 ? message.slice(60, 110) : '', { fontSize: 12, fill: theme.subTextColor })}
</svg>`
}
