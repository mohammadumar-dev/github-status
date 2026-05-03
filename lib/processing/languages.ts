import type { LanguageDistribution } from '@/types/card'

// Official GitHub Linguist colors
export const LINGUIST_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#B07219',
  'C++': '#F34B7D',
  'C#': '#178600',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41B883',
  PHP: '#4F5D95',
  Shell: '#89E051',
  'Objective-C': '#438EFF',
  Scala: '#DC322F',
  Haskell: '#5E5086',
  Elixir: '#6E4A7E',
  Clojure: '#DB5855',
  Erlang: '#B83998',
  'F#': '#B845FC',
  Lua: '#000080',
  Perl: '#0298C3',
  R: '#198CE7',
  MATLAB: '#E16737',
  Julia: '#A270BA',
  Nim: '#FFC200',
  Crystal: '#000100',
  Zig: '#EC915C',
  OCaml: '#EF7A08',
  Elm: '#60B5CC',
  PureScript: '#1D222D',
  Racket: '#375EAB',
  Scheme: '#1E4AEC',
  Assembly: '#6E4C13',
  Makefile: '#427819',
  Dockerfile: '#384D54',
  HTML: '#E34C26',
  CSS: '#563D7C',
  SCSS: '#C6538C',
  Less: '#1D365D',
  CoffeeScript: '#244776',
  'Jupyter Notebook': '#DA5B0B',
  Solidity: '#AA6746',
  VHDL: '#ADB2CB',
  Verilog: '#B2B7F8',
  PowerShell: '#012456',
  Groovy: '#4298B8',
  Nix: '#7E7EFF',
  HCL: '#844FBA',
}

const FALLBACK_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#3B82F6', '#EF4444', '#14B8A6', '#F97316', '#84CC16',
]

export function getLanguageColor(name: string): string {
  return LINGUIST_COLORS[name] ?? FALLBACK_COLORS[name.charCodeAt(0) % FALLBACK_COLORS.length]
}

export function aggregateLanguages(langMaps: Record<string, number>[]): LanguageDistribution {
  const totals = new Map<string, number>()

  for (const map of langMaps) {
    for (const [lang, bytes] of Object.entries(map)) {
      totals.set(lang, (totals.get(lang) ?? 0) + bytes)
    }
  }

  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0)
  if (grandTotal === 0) return []

  const sorted = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])

  const top8 = sorted.slice(0, 8)
  const otherBytes = sorted.slice(8).reduce((sum, [, b]) => sum + b, 0)

  const result = top8.map(([name, bytes]) => ({
    name,
    color: getLanguageColor(name),
    percentage: Math.round((bytes / grandTotal) * 1000) / 10,
    bytes,
  }))

  if (otherBytes > 0) {
    result.push({
      name: 'Other',
      color: '#8B8B8B',
      percentage: Math.round((otherBytes / grandTotal) * 1000) / 10,
      bytes: otherBytes,
    })
  }

  return result
}
