import { rect, text, cardHeader, divider, truncateText, escapeXml, iconPath } from '../renderer'
import { MONO_FONT_STACK, FONT_STACK } from '../fonts'
import type { ThemeConfig } from '../themes'
import type { CardOptions, CardRenderResult, ProcessedGitHubData } from '@/types/card'

const WIDTH = 495

export function render(data: ProcessedGitHubData, theme: ThemeConfig, _opts: CardOptions): CardRenderResult {
  const { profile } = data
  const bio = profile.bio ? truncateText(profile.bio, 80) : null
  const hasExtendedBio = bio && bio.length > 40

  const metaItems: Array<{ icon: string; label: string }> = []
  if (profile.company) metaItems.push({ icon: 'building', label: truncateText(profile.company.replace('@', ''), 20) })
  if (profile.location) metaItems.push({ icon: 'location', label: truncateText(profile.location, 20) })
  if (profile.blog) {
    const blogDisplay = profile.blog.replace(/^https?:\/\//, '').replace(/\/$/, '')
    metaItems.push({ icon: 'link', label: truncateText(blogDisplay, 22) })
  }
  const joinYear = profile.created_at ? new Date(profile.created_at).getFullYear() : null
  if (joinYear) metaItems.push({ icon: 'calendar', label: `Joined ${joinYear}` })

  const metaY = hasExtendedBio ? 115 : 100
  const dividerY = metaItems.length > 0 ? metaY + 22 : (hasExtendedBio ? 115 : 100)
  const statsY = dividerY + 16
  const height = statsY + 52

  const avatarSize = 64
  const avatarX = 20
  const avatarY = 20

  const metaRow = metaItems.slice(0, 4).map((item, i) => {
    const itemX = 20 + i * 118
    return `<g transform="translate(${itemX}, ${metaY})">
      <g transform="translate(0, -10) scale(0.55)">${iconPath(item.icon as Parameters<typeof iconPath>[0], theme.iconColor)}</g>
      ${text(14, 0, item.label, { fontSize: 10, fill: theme.subTextColor })}
    </g>`
  }).join('\n')

  const statsData = [
    { value: String(profile.followers), label: 'Followers' },
    { value: String(profile.following), label: 'Following' },
    { value: String(profile.public_repos), label: 'Repos' },
    { value: String(profile.public_gists), label: 'Gists' },
  ]

  const statsRow = statsData.map((stat, i) => {
    const colW = WIDTH / 4
    const cx = colW * i + colW / 2
    return `<g>
      ${text(cx, statsY + 16, stat.value, {
        fontSize: 16,
        fontWeight: 700,
        fill: theme.statNumColor,
        anchor: 'middle',
        fontFamily: MONO_FONT_STACK,
      })}
      ${text(cx, statsY + 30, stat.label, {
        fontSize: 10,
        fill: theme.subTextColor,
        anchor: 'middle',
        fontFamily: FONT_STACK,
      })}
    </g>`
  }).join('\n')

  const vertDividers = [1, 2, 3].map(i => {
    const x = (WIDTH / 4) * i
    return `<line x1="${x}" y1="${statsY}" x2="${x}" y2="${statsY + 42}" stroke="${theme.borderColor}" stroke-width="1"/>`
  }).join('\n')

  const svgContent = `
  ${rect(0, 0, WIDTH, height, {
    rx: 8,
    fill: theme.bgColor,
    stroke: theme.borderColor,
    strokeWidth: 1,
  })}

  <!-- Avatar placeholder circle (real avatars need HTTP fetch; use initials instead) -->
  <circle cx="${avatarX + avatarSize / 2}" cy="${avatarY + avatarSize / 2}" r="${avatarSize / 2}"
    fill="${theme.accentColor}" stroke="${theme.ringColor}" stroke-width="2"/>
  ${text(avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 1, profile.login.charAt(0).toUpperCase(), {
    fontSize: 26,
    fontWeight: 700,
    fill: '#FFFFFF',
    anchor: 'middle',
    dominantBaseline: 'middle',
  })}

  <!-- Name and username -->
  ${text(100, 38, truncateText(profile.name ?? profile.login, 28), {
    fontSize: 17,
    fontWeight: 700,
    fill: theme.titleColor,
  })}
  ${text(100, 55, `@${profile.login}`, {
    fontSize: 13,
    fill: theme.subTextColor,
    fontFamily: MONO_FONT_STACK,
  })}

  <!-- Bio -->
  ${bio ? text(100, 72, truncateText(bio, 40), {
    fontSize: 12,
    fill: theme.textColor,
    maxWidth: 40,
  }) : ''}
  ${hasExtendedBio && bio ? text(100, 87, truncateText(bio.slice(40), 40), {
    fontSize: 12,
    fill: theme.textColor,
  }) : ''}

  <!-- Meta pills -->
  ${metaItems.length > 0 ? metaRow : ''}

  <!-- Divider -->
  ${divider(0, dividerY, WIDTH, theme)}

  <!-- Stats row -->
  ${statsRow}
  ${vertDividers}
  `

  return {
    svg: svgContent,
    width: WIDTH,
    height,
  }
}
