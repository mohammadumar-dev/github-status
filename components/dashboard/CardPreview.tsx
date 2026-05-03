'use client'

import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CopyButton } from '@/components/shared/CopyButton'

interface CardPreviewProps {
  url: string
  width?: number
  height?: number
}

export function CardPreview({ url, width = 495, height = 220 }: CardPreviewProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className="relative group">
      {!loaded && !error && (
        <Skeleton className="rounded-lg" style={{ width, height }} />
      )}
      {error && (
        <div
          className="rounded-lg border border-red-500/30 bg-red-950/20 flex items-center justify-center text-sm text-red-400"
          style={{ width, height }}
        >
          Failed to load card
        </div>
      )}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt="GitHub stats card preview"
          style={{ display: loaded ? 'block' : 'none', width: 'auto', maxWidth: '100%' }}
          onLoad={() => { setLoaded(true); setError(false) }}
          onError={() => { setLoaded(false); setError(true) }}
        />
      )}
      {loaded && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={url} label="Copy URL" />
        </div>
      )}
    </div>
  )
}
