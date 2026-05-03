import { CopyButton } from '@/components/shared/CopyButton'

const EXAMPLE_URL = 'https://github-profile-cards.vercel.app/api/card?username=torvalds'
const MARKDOWN = `![GitHub Stats](${EXAMPLE_URL})`
const HTML = `<img src="${EXAMPLE_URL}" alt="GitHub Stats" />`

export function UsageCode() {
  return (
    <section className="py-20 px-6 bg-white/[0.02]">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Add to your README in 10 seconds</h2>
        <p className="text-slate-400 mb-10">
          Just one line of Markdown. No API key, no JavaScript, no setup.
        </p>
        <div className="rounded-lg border border-white/10 bg-black/50 text-left overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <span className="text-xs text-slate-500 font-mono">README.md</span>
            <CopyButton text={MARKDOWN} label="Copy Markdown" />
          </div>
          <pre className="p-4 text-sm text-indigo-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {MARKDOWN}
          </pre>
        </div>
        <div className="mt-4 rounded-lg border border-white/10 bg-black/50 text-left overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <span className="text-xs text-slate-500 font-mono">HTML</span>
            <CopyButton text={HTML} label="Copy HTML" />
          </div>
          <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {HTML}
          </pre>
        </div>
      </div>
    </section>
  )
}
