'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Palette } from 'lucide-react'

interface ColorOverrides {
  accent_color?: string
  bg_color?: string
  text_color?: string
  title_color?: string
  border_color?: string
  icon_color?: string
}

interface ColorCustomizerProps {
  value: ColorOverrides
  onChange: (overrides: ColorOverrides) => void
  onReset: () => void
}

const COLOR_FIELDS: Array<{ key: keyof ColorOverrides; label: string }> = [
  { key: 'accent_color', label: 'Accent' },
  { key: 'bg_color', label: 'Background' },
  { key: 'text_color', label: 'Text' },
  { key: 'title_color', label: 'Title' },
  { key: 'border_color', label: 'Border' },
  { key: 'icon_color', label: 'Icons' },
]

export function ColorCustomizer({ value, onChange, onReset }: ColorCustomizerProps) {
  function handleChange(key: keyof ColorOverrides, hex: string) {
    const cleaned = hex.replace('#', '')
    onChange({ ...value, [key]: cleaned || undefined })
  }

  const activeCount = Object.values(value).filter(Boolean).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Custom Colors
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] text-white leading-none">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 bg-[#161B22] border-white/10" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Color Overrides</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-slate-400 hover:text-white"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
          {COLOR_FIELDS.map(field => (
            <div key={field.key} className="flex items-center justify-between gap-3">
              <Label className="text-xs text-slate-400 flex-1">{field.label}</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded border border-white/20 overflow-hidden cursor-pointer"
                  style={{ background: value[field.key] ? `#${value[field.key]}` : 'transparent' }}
                >
                  <input
                    type="color"
                    value={value[field.key] ? `#${value[field.key]}` : '#6366F1'}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono w-14">
                  {value[field.key] ? `#${value[field.key]}` : 'default'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
