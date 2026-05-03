import { Hero } from '@/components/landing/Hero'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { CardShowcase } from '@/components/landing/CardShowcase'
import { UsageCode } from '@/components/landing/UsageCode'
import { GitBranch } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex-1 bg-[#0D1117] text-white">
      <Hero />

      {/* Live demo */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-8">See it in action</h2>
          <div className="rounded-xl border border-white/10 bg-black/30 p-4 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/card?username=torvalds&card=stats"
              alt="Live GitHub stats card"
              className="max-w-full rounded"
            />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Live data for Linus Torvalds — updates automatically
          </p>
        </div>
      </section>

      <FeatureGrid />
      <UsageCode />
      <CardShowcase />

      <footer className="border-t border-white/10 py-10 px-6 text-center text-slate-500 text-sm">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>GitHub Profile Cards — MIT License</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <GitBranch className="h-4 w-4" /> View on GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
