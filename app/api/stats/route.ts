import { type NextRequest, NextResponse } from 'next/server'
import { CardParamsSchema } from '@/lib/validators/card-params'
import { cacheManager } from '@/lib/cache/manager'
import { UserNotFoundError, RateLimitError } from '@/lib/github/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawParams = Object.fromEntries(searchParams.entries())
  const pretty = searchParams.get('pretty') === 'true'

  const parsed = CardParamsSchema.safeParse(rawParams)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { username, cache_seconds } = parsed.data

  try {
    const data = await cacheManager.getOrFetch(username, cache_seconds)
    const body = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${cache_seconds}`,
      },
    })
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return NextResponse.json({ error: `User '${username}' not found` }, { status: 404 })
    }
    if (err instanceof RateLimitError) {
      return NextResponse.json({ error: 'GitHub API rate limit exceeded' }, { status: 429 })
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
