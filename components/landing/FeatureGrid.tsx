import { LayoutGrid, Palette, RefreshCw, Unlock, GitBranch, SlidersHorizontal } from 'lucide-react'

const FEATURES = [
  {
    icon: LayoutGrid,
    title: '8 Card Types',
    description: 'Profile, stats, streak, heatmap, languages, repos, commits, and activity.',
  },
  {
    icon: Palette,
    title: '5 Themes',
    description: 'Default dark, light, Radical, Tokyo Night, and Dracula — with custom colors.',
  },
  {
    icon: RefreshCw,
    title: 'Auto-updating',
    description: 'Cards are cached and refreshed automatically. Always show fresh data.',
  },
  {
    icon: Unlock,
    title: 'No auth required',
    description: 'Just pass a GitHub username. No account needed to embed cards.',
  },
  {
    icon: GitBranch,
    title: 'Open source',
    description: 'Self-host on Vercel in minutes. Full control over your data.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Custom colors',
    description: 'Override any color via URL params. Make it match your README style.',
  },
]

export function FeatureGrid() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-white mb-12">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(feature => (
            <div
              key={feature.title}
              className="rounded-lg border border-white/10 bg-white/5 p-6 hover:border-indigo-500/50 transition-colors"
            >
              <feature.icon className="h-6 w-6 text-indigo-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
