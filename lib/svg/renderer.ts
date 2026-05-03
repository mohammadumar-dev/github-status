import type { ThemeConfig } from './themes'
import type { LanguageItem } from '@/types/card'
import { FONT_FACE_CSS, FONT_STACK, MONO_FONT_STACK } from './fonts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RectOpts {
  rx?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  clipPath?: string
}

interface TextOpts {
  fontSize?: number
  fontWeight?: string | number
  fill?: string
  anchor?: 'start' | 'middle' | 'end'
  dominantBaseline?: string
  fontFamily?: string
  opacity?: number
  maxWidth?: number
}

// ─── Core Builders ────────────────────────────────────────────────────────────

export function svgRoot(width: number, height: number, children: string, theme: ThemeConfig): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>${FONT_FACE_CSS}</style>
  </defs>
  <rect width="${width}" height="${height}" fill="${theme.bgColor}" rx="8"/>
  ${children}
</svg>`
}

export function rect(x: number, y: number, w: number, h: number, opts: RectOpts = {}): string {
  const attrs = [
    `x="${x}" y="${y}" width="${w}" height="${h}"`,
    opts.rx !== undefined ? `rx="${opts.rx}"` : '',
    opts.fill ? `fill="${opts.fill}"` : 'fill="none"',
    opts.stroke ? `stroke="${opts.stroke}"` : '',
    opts.strokeWidth !== undefined ? `stroke-width="${opts.strokeWidth}"` : '',
    opts.opacity !== undefined ? `opacity="${opts.opacity}"` : '',
    opts.clipPath ? `clip-path="${opts.clipPath}"` : '',
  ].filter(Boolean).join(' ')
  return `<rect ${attrs}/>`
}

export function text(x: number, y: number, content: string, opts: TextOpts = {}): string {
  const escaped = escapeXml(opts.maxWidth ? truncateText(content, opts.maxWidth) : content)
  const attrs = [
    `x="${x}" y="${y}"`,
    `font-family="${opts.fontFamily ?? FONT_STACK}"`,
    `font-size="${opts.fontSize ?? 12}"`,
    opts.fontWeight ? `font-weight="${opts.fontWeight}"` : '',
    opts.fill ? `fill="${opts.fill}"` : '',
    opts.anchor ? `text-anchor="${opts.anchor}"` : '',
    opts.dominantBaseline ? `dominant-baseline="${opts.dominantBaseline}"` : '',
    opts.opacity !== undefined ? `opacity="${opts.opacity}"` : '',
  ].filter(Boolean).join(' ')
  return `<text ${attrs}>${escaped}</text>`
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function truncateText(str: string, maxChars: number): string {
  if (str.length <= maxChars) return str
  return str.slice(0, maxChars - 1) + '…'
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function relativeTime(dateStr: string): string {
  const delta = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`
  if (delta < 604800) return `${Math.floor(delta / 86400)}d ago`
  if (delta < 2592000) return `${Math.floor(delta / 604800)}w ago`
  return `${Math.floor(delta / 2592000)}mo ago`
}

// ─── Chart Primitives ─────────────────────────────────────────────────────────

export function heatmapCell(
  x: number,
  y: number,
  level: number,
  date: string,
  count: number,
  theme: ThemeConfig,
): string {
  const colorMap: Record<number, string> = {
    0: theme.heatmap.l0,
    1: theme.heatmap.l1,
    2: theme.heatmap.l2,
    3: theme.heatmap.l3,
    4: theme.heatmap.l4,
  }
  const fill = colorMap[Math.min(level, 4)] ?? theme.heatmap.l4
  return `<rect x="${x}" y="${y}" width="10" height="10" rx="2" fill="${fill}">
    <title>${date}: ${count} contribution${count !== 1 ? 's' : ''}</title>
  </rect>`
}

export function languageBar(
  x: number,
  y: number,
  w: number,
  langs: LanguageItem[],
  height = 8,
): string {
  if (langs.length === 0) return ''
  const total = langs.reduce((s, l) => s + l.percentage, 0)
  let currentX = x
  const segments = langs.map(lang => {
    const segW = Math.round((lang.percentage / total) * w)
    const seg = `<rect x="${currentX}" y="${y}" width="${segW}" height="${height}" fill="${lang.color}" rx="0"/>`
    currentX += segW
    return seg
  })
  // Round left and right ends
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${height}" rx="${height / 2}" fill="${langs[0].color}"/>
    ${segments.join('\n    ')}
    <rect x="${x}" y="${y}" width="${w}" height="${height}" rx="${height / 2}" fill="none"/>
  </g>`
}

export function sparkline(
  x: number,
  y: number,
  w: number,
  h: number,
  data: number[],
  color: string,
): string {
  if (data.length < 2) return ''
  const max = Math.max(...data, 1)
  const step = w / (data.length - 1)

  const points = data.map((val, i) => ({
    px: x + i * step,
    py: y + h - (val / max) * h,
  }))

  // Build smooth cubic bezier path
  let d = `M ${points[0].px},${points[0].py}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpX = (prev.px + curr.px) / 2
    d += ` C ${cpX},${prev.py} ${cpX},${curr.py} ${curr.px},${curr.py}`
  }

  const fillPath = d + ` L ${points[points.length - 1].px},${y + h} L ${x},${y + h} Z`
  const gradId = `spark_${color.replace('#', '')}`

  return `<defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="${fillPath}" fill="url(#${gradId})"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
}

export function progressBar(
  x: number,
  y: number,
  w: number,
  h: number,
  pct: number,
  color: string,
  bgColor: string,
): string {
  const filled = Math.max(0, Math.min(1, pct / 100)) * w
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${bgColor}"/>
    <rect x="${x}" y="${y}" width="${filled}" height="${h}" rx="${h / 2}" fill="${color}"/>
  </g>`
}

export function circleBadge(
  cx: number,
  cy: number,
  r: number,
  label: string,
  sublabel: string,
  theme: ThemeConfig,
): string {
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${theme.bgColor}" stroke="${theme.accentColor}" stroke-width="2"/>
    ${text(cx, cy - 6, label, {
      fontSize: 16,
      fontWeight: 700,
      fill: theme.statNumColor,
      anchor: 'middle',
      dominantBaseline: 'auto',
      fontFamily: MONO_FONT_STACK,
    })}
    ${text(cx, cy + 10, sublabel, {
      fontSize: 9,
      fill: theme.subTextColor,
      anchor: 'middle',
    })}
  </g>`
}

export function cardHeader(
  x: number,
  y: number,
  w: number,
  title: string,
  iconName: string | null,
  theme: ThemeConfig,
): string {
  const iconSvg = iconName ? `<g transform="translate(${x + 2}, ${y - 13}) scale(0.75)">${iconPath(iconName as IconName, theme.iconColor)}</g>` : ''
  const textX = iconName ? x + 20 : x + 4
  return `<g>
    ${iconSvg}
    ${text(textX, y, title, {
      fontSize: 14,
      fontWeight: 600,
      fill: theme.titleColor,
    })}
    ${divider(x, y + 8, w, theme)}
  </g>`
}

export function divider(x: number, y: number, w: number, theme: ThemeConfig): string {
  return `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${theme.borderColor}" stroke-width="1"/>`
}

export function statTile(
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  theme: ThemeConfig,
  accentColor?: string,
): string {
  return `<g>
    ${text(x + w / 2, y + h / 2 - 8, value, {
      fontSize: 20,
      fontWeight: 700,
      fill: accentColor ?? theme.statNumColor,
      anchor: 'middle',
      fontFamily: MONO_FONT_STACK,
    })}
    ${text(x + w / 2, y + h / 2 + 10, label, {
      fontSize: 10,
      fill: theme.subTextColor,
      anchor: 'middle',
    })}
  </g>`
}

// ─── Icons (Lucide path data) ─────────────────────────────────────────────────

export type IconName =
  | 'star' | 'fork' | 'commit' | 'pr' | 'issue' | 'review'
  | 'user' | 'location' | 'building' | 'link' | 'calendar'
  | 'fire' | 'trophy' | 'chart' | 'code' | 'eye' | 'clock'
  | 'arrow-up' | 'arrow-down' | 'check' | 'alert' | 'refresh'

const ICON_PATHS: Record<IconName, string> = {
  star:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  fork:     'M6 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm12 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM6 21a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-6V9m6 12V9m0 0a6 6 0 0 1 6-6',
  commit:   'M12 5v14M5 12l7-7 7 7',
  pr:       'M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9v4a3 3 0 0 0 3 3h6',
  issue:    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4m0 4h.01',
  review:   'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  user:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  location: 'M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zm-4 0h20M10 7h.01M14 7h.01M10 11h.01M14 11h.01M10 15h.01M14 15h.01',
  link:     'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  fire:     'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  trophy:   'M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z',
  chart:    'M3 3v18h18M18 9l-5 5-4-4-3 3',
  code:     'M16 18l6-6-6-6M8 6l-6 6 6 6',
  eye:      'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  clock:    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-14v4l3 3',
  'arrow-up':   'M12 19V5m-7 7 7-7 7 7',
  'arrow-down': 'M12 5v14m7-7-7 7-7-7',
  check:    'M20 6L9 17l-5-5',
  alert:    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01',
  refresh:  'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
}

export function iconPath(name: IconName, color = 'currentColor', size = 16): string {
  const d = ICON_PATHS[name] ?? ICON_PATHS.alert
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`
}
