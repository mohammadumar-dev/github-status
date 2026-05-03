'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const CARD_OPTIONS = [
  { id: 'profile', label: 'Profile Header' },
  { id: 'stats', label: 'Developer Stats' },
  { id: 'streak', label: 'Contribution Streak' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'langs', label: 'Languages' },
  { id: 'repos', label: 'Top Repositories' },
  { id: 'commits', label: 'Commit Activity' },
  { id: 'activity', label: 'Recent Activity' },
]

interface CardToggleListProps {
  enabled: string[]
  onChange: (cards: string[]) => void
}

export function CardToggleList({ enabled, onChange }: CardToggleListProps) {
  function toggle(id: string) {
    if (enabled.includes(id)) {
      onChange(enabled.filter(c => c !== id))
    } else {
      onChange([...enabled, id])
    }
  }

  return (
    <div className="space-y-2">
      {CARD_OPTIONS.map(card => (
        <div key={card.id} className="flex items-center justify-between">
          <Label htmlFor={`card-${card.id}`} className="text-sm text-slate-300 cursor-pointer">
            {card.label}
          </Label>
          <Switch
            id={`card-${card.id}`}
            checked={enabled.includes(card.id)}
            onCheckedChange={() => toggle(card.id)}
          />
        </div>
      ))}
    </div>
  )
}
