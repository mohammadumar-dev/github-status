'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Eye, Settings, LogOut, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/preview', label: 'Preview & Customize', icon: Eye },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  user?: { name?: string | null; image?: string | null; email?: string | null }
  onSignOut?: () => void
}

export function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-col border-r border-white/10 bg-black/20 px-3 py-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <GitBranch className="h-5 w-5 text-indigo-400" />
        <span className="font-semibold text-white text-sm">Profile Cards</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-indigo-600/20 text-indigo-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              {user.name?.charAt(0) ?? user.email?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.name ?? 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email ?? ''}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-slate-400 hover:text-white"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      )}
    </aside>
  )
}
