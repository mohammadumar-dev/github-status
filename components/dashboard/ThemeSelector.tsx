'use client'

import { cn } from '@/lib/utils'

const THEMES = [
  { id: 'default', name: 'Default', bg: '#0D1117', accent: '#6366F1' },
  { id: 'light', name: 'Light', bg: '#FFFFFF', accent: '#6366F1' },
  { id: 'radical', name: 'Radical', bg: '#141321', accent: '#FE428E' },
  { id: 'tokyonight', name: 'Tokyo Night', bg: '#1A1B27', accent: '#70A5FD' },
  { id: 'dracula', name: 'Dracula', bg: '#282A36', accent: '#FF79C6' },
]

interface ThemeSelectorProps {
  value: string
  onChange: (theme: string) => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {THEMES.map(theme => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className={cn(
            'relative rounded-lg border-2 p-1.5 transition-all',
            value === theme.id
              ? 'border-indigo-500 shadow-md shadow-indigo-500/25'
              : 'border-white/10 hover:border-white/30',
          )}
          title={theme.name}
        >
          <div
            className="w-14 h-8 rounded"
            style={{ background: theme.bg }}
          >
            <div
              className="absolute bottom-2.5 left-2 right-2 h-1.5 rounded-full"
              style={{ background: theme.accent }}
            />
          </div>
          <span className="block text-[10px] text-slate-400 mt-1 text-center">{theme.name}</span>
        </button>
      ))}
    </div>
  )
}
