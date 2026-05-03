export interface ThemeConfig {
  id: string
  name: string
  bgColor: string
  borderColor: string
  titleColor: string
  textColor: string
  subTextColor: string
  iconColor: string
  accentColor: string
  accent2Color: string
  statNumColor: string
  ringColor: string
  heatmap: {
    l0: string
    l1: string
    l2: string
    l3: string
    l4: string
  }
}

const THEMES: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Default Dark',
    bgColor: '#0D1117',
    borderColor: '#21262D',
    titleColor: '#E6EDF3',
    textColor: '#C9D1D9',
    subTextColor: '#8B949E',
    iconColor: '#8B949E',
    accentColor: '#6366F1',
    accent2Color: '#818CF8',
    statNumColor: '#E6EDF3',
    ringColor: '#6366F1',
    heatmap: { l0: '#161B22', l1: '#0E4429', l2: '#006D32', l3: '#26A641', l4: '#39D353' },
  },
  {
    id: 'light',
    name: 'Light',
    bgColor: '#FFFFFF',
    borderColor: '#D0D7DE',
    titleColor: '#1F2328',
    textColor: '#1F2328',
    subTextColor: '#636C76',
    iconColor: '#636C76',
    accentColor: '#6366F1',
    accent2Color: '#818CF8',
    statNumColor: '#1F2328',
    ringColor: '#6366F1',
    heatmap: { l0: '#EBEDF0', l1: '#9BE9A8', l2: '#40C463', l3: '#30A14E', l4: '#216E39' },
  },
  {
    id: 'radical',
    name: 'Radical',
    bgColor: '#141321',
    borderColor: '#2D2B55',
    titleColor: '#A9FEF7',
    textColor: '#A9FEF7',
    subTextColor: '#7B6E9E',
    iconColor: '#FE428E',
    accentColor: '#FE428E',
    accent2Color: '#F8D847',
    statNumColor: '#FFFFFF',
    ringColor: '#FE428E',
    heatmap: { l0: '#1A1833', l1: '#4D2F6B', l2: '#7D3C98', l3: '#A93226', l4: '#FE428E' },
  },
  {
    id: 'tokyonight',
    name: 'Tokyo Night',
    bgColor: '#1A1B27',
    borderColor: '#2A2C40',
    titleColor: '#C0CAF5',
    textColor: '#A9B1D6',
    subTextColor: '#565F89',
    iconColor: '#7DCFFF',
    accentColor: '#70A5FD',
    accent2Color: '#BF91F3',
    statNumColor: '#C0CAF5',
    ringColor: '#70A5FD',
    heatmap: { l0: '#20212E', l1: '#1A3A5C', l2: '#1B4E7E', l3: '#4782B4', l4: '#70A5FD' },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    bgColor: '#282A36',
    borderColor: '#44475A',
    titleColor: '#F8F8F2',
    textColor: '#F8F8F2',
    subTextColor: '#6272A4',
    iconColor: '#FF79C6',
    accentColor: '#FF79C6',
    accent2Color: '#BD93F9',
    statNumColor: '#F8F8F2',
    ringColor: '#BD93F9',
    heatmap: { l0: '#282A36', l1: '#44475A', l2: '#6272A4', l3: '#BD93F9', l4: '#FF79C6' },
  },
]

const themeMap = new Map(THEMES.map(t => [t.id, t]))

export function getTheme(themeId: string): ThemeConfig {
  return themeMap.get(themeId) ?? THEMES[0]
}

export function getAllThemes(): ThemeConfig[] {
  return THEMES
}
