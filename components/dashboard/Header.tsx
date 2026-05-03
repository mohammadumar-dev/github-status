'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-black/10 px-6 py-3">
      <h1 className="text-sm font-medium text-white">{title ?? 'Dashboard'}</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {mounted && theme === 'dark' ? (
          <Sun className="h-4 w-4 text-slate-400" />
        ) : (
          <Moon className="h-4 w-4 text-slate-400" />
        )}
      </Button>
    </header>
  )
}
