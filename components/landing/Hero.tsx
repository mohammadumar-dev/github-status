import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GitBranch, ArrowRight } from 'lucide-react'
import { signIn } from '@/lib/auth'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 px-6 text-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/30 via-transparent to-transparent" />
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Free &amp; open source
        </div>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Make your GitHub profile{' '}
          <span className="text-indigo-400">stand out</span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">
          Dynamic, SVG-based developer analytics cards for your README.
          One URL — auto-updating stats, streaks, heatmaps, and more.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/preview">
              Preview your profile <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/dashboard' })
            }}
          >
            <Button variant="outline" size="lg" className="gap-2" type="submit">
              <GitBranch className="h-4 w-4" /> Sign in with GitHub
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
