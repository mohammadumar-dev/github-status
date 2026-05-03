'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CopyButton } from '@/components/shared/CopyButton'

interface EmbedCodePanelProps {
  url: string
  username: string
}

export function EmbedCodePanel({ url, username }: EmbedCodePanelProps) {
  const markdown = `![${username}'s GitHub Stats](${url})`
  const html = `<img src="${url}" alt="${username}'s GitHub Stats" />`

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 overflow-hidden">
      <Tabs defaultValue="markdown">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <TabsList className="h-7 bg-transparent p-0 gap-1">
            <TabsTrigger value="markdown" className="h-6 text-xs px-2">Markdown</TabsTrigger>
            <TabsTrigger value="html" className="h-6 text-xs px-2">HTML</TabsTrigger>
            <TabsTrigger value="url" className="h-6 text-xs px-2">URL</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="markdown" className="m-0">
          <div className="flex items-start justify-between p-3 gap-2">
            <pre className="text-xs text-indigo-300 font-mono whitespace-pre-wrap break-all flex-1">{markdown}</pre>
            <CopyButton text={markdown} />
          </div>
        </TabsContent>
        <TabsContent value="html" className="m-0">
          <div className="flex items-start justify-between p-3 gap-2">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-all flex-1">{html}</pre>
            <CopyButton text={html} />
          </div>
        </TabsContent>
        <TabsContent value="url" className="m-0">
          <div className="flex items-start justify-between p-3 gap-2">
            <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-all flex-1">{url}</pre>
            <CopyButton text={url} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
