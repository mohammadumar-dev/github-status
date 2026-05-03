const THEMES = ['default', 'radical', 'tokyonight', 'dracula', 'light']
const THEME_LABELS: Record<string, string> = {
  default: 'Default Dark',
  radical: 'Radical',
  tokyonight: 'Tokyo Night',
  dracula: 'Dracula',
  light: 'Light',
}

interface CardShowcaseProps {
  username?: string
}

export function CardShowcase({ username = 'torvalds' }: CardShowcaseProps) {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-white mb-4">5 beautiful themes</h2>
        <p className="text-center text-slate-400 mb-12">
          Choose from pre-built themes or customize every color with URL parameters.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map(theme => (
            <div key={theme} className="rounded-lg overflow-hidden border border-white/10">
              <div className="p-2 bg-black/30">
                <img
                  src={`/api/card?username=${username}&theme=${theme}&card=stats`}
                  alt={`${THEME_LABELS[theme]} theme preview`}
                  className="w-full rounded"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2 border-t border-white/10">
                <span className="text-xs text-slate-400 font-mono">{theme}</span>
                <span className="ml-2 text-xs text-slate-500">{THEME_LABELS[theme]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
