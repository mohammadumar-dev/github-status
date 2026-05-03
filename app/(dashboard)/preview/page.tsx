'use client'

import { useState, useCallback, useEffect } from 'react'
import { debounce } from '@/lib/utils'
import { CardPreview } from '@/components/dashboard/CardPreview'
import { EmbedCodePanel } from '@/components/dashboard/EmbedCodePanel'
import { ThemeSelector } from '@/components/dashboard/ThemeSelector'
import { CardToggleList } from '@/components/dashboard/CardToggleList'
import { ColorCustomizer } from '@/components/dashboard/ColorCustomizer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/dashboard/Header'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ColorOverrides {
  accent_color?: string
  bg_color?: string
  text_color?: string
  title_color?: string
  border_color?: string
  icon_color?: string
}

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
const DEFAULT_CARDS = ['profile', 'stats', 'streak', 'heatmap', 'langs', 'repos', 'commits', 'activity']

function buildCardUrl(
  username: string,
  theme: string,
  cards: string[],
  colors: ColorOverrides,
): string {
  if (!username) return ''
  const params = new URLSearchParams()
  params.set('username', username)
  params.set('theme', theme)
  if (cards.length > 0 && cards.length < DEFAULT_CARDS.length) {
    params.set('card', cards.join(','))
  }
  Object.entries(colors).forEach(([key, val]) => {
    if (val) params.set(key, val)
  })
  return `${APP_URL}/api/card?${params.toString()}`
}

export default function PreviewPage() {
  const [username, setUsername] = useState('')
  const [theme, setTheme] = useState('default')
  const [enabledCards, setEnabledCards] = useState<string[]>(DEFAULT_CARDS)
  const [colors, setColors] = useState<ColorOverrides>({})
  const [previewUrl, setPreviewUrl] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePreview = useCallback(
    debounce((user: string, t: string, cards: string[], c: ColorOverrides) => {
      setPreviewUrl(buildCardUrl(user, t, cards, c))
      setIsUpdating(false)
    }, 500),
    [],
  )

  useEffect(() => {
    if (username.length > 0) {
      setIsUpdating(true)
      updatePreview(username, theme, enabledCards, colors)
    }
  }, [username, theme, enabledCards, colors, updatePreview])

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title="Preview & Customize" />
      <div className="flex flex-1 overflow-hidden">
        {/* Controls Panel */}
        <div className="w-80 flex-shrink-0 border-r border-white/10 bg-black/20 overflow-y-auto p-5 space-y-6">
          <div>
            <Label htmlFor="username-input" className="text-xs text-slate-400 mb-1.5 block">
              GitHub Username
            </Label>
            <Input
              id="username-input"
              placeholder="e.g. torvalds"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 39))}
              className="font-mono bg-black/30 border-white/10 text-white placeholder:text-slate-600"
            />
          </div>

          <Separator className="border-white/10" />

          <div>
            <Label className="text-xs text-slate-400 mb-3 block">Theme</Label>
            <ThemeSelector value={theme} onChange={setTheme} />
          </div>

          <Separator className="border-white/10" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs text-slate-400">Cards</Label>
            </div>
            <CardToggleList enabled={enabledCards} onChange={setEnabledCards} />
          </div>

          <Separator className="border-white/10" />

          <div>
            <Label className="text-xs text-slate-400 mb-3 block">Colors</Label>
            <ColorCustomizer
              value={colors}
              onChange={setColors}
              onReset={() => setColors({})}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col overflow-auto p-6 space-y-6">
          <div className="flex-1 min-h-0">
            {!username ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                Enter a GitHub username to preview your card
              </div>
            ) : (
              <div className="relative">
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl z-10">
                    <LoadingSpinner />
                  </div>
                )}
                <CardPreview url={previewUrl} />
              </div>
            )}
          </div>

          {username && previewUrl && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Embed Code</h3>
              <EmbedCodePanel url={previewUrl} username={username} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
