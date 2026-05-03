import { type NextRequest, NextResponse } from 'next/server'
import { CardParamsSchema } from '@/lib/validators/card-params'
import { cacheManager } from '@/lib/cache/manager'
import { composeCards, makeErrorSvg } from '@/lib/svg/composer'
import { prisma } from '@/lib/prisma'
import { UserNotFoundError, RateLimitError } from '@/lib/github/client'
import { createHash } from 'crypto'

const RATE_LIMIT = Number(process.env.RATE_LIMIT_REQUESTS_PER_HOUR ?? 50)

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawParams = Object.fromEntries(searchParams.entries())

  // Validate params
  const parsed = CardParamsSchema.safeParse(rawParams)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Invalid parameters'
    return svgResponse(makeErrorSvg(msg), 60)
  }

  const params = parsed.data
  const { username } = params

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const oneHourAgo = new Date(Date.now() - 3_600_000)

  try {
    const [recentCount] = await Promise.all([
      prisma.rateLimitLog.count({
        where: {
          OR: [
            { username, createdAt: { gte: oneHourAgo } },
            { ip, createdAt: { gte: oneHourAgo } },
          ],
        },
      }),
      // Clean up old rate limit logs (fire-and-forget)
      prisma.rateLimitLog.deleteMany({
        where: { createdAt: { lt: oneHourAgo } },
      }).catch(() => null),
    ])

    if (recentCount >= RATE_LIMIT) {
      return svgResponse(makeErrorSvg(`Rate limit exceeded. Try again later.`), 300)
    }

    // Log this request
    await prisma.rateLimitLog.create({
      data: { username, ip, endpoint: '/api/card' },
    })
  } catch {
    // DB unavailable — proceed without rate limiting
  }

  // Fetch / cache data
  let data
  const fetchStart = Date.now()
  let cacheHit = false

  try {
    const cached = await cacheManager.get(username)
    if (cached) {
      data = cached
      cacheHit = true
    } else {
      data = await cacheManager.getOrFetch(username, params.cache_seconds)
    }
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return svgResponse(makeErrorSvg(`User '${username}' not found on GitHub`), 300)
    }
    if (err instanceof RateLimitError) {
      return svgResponse(makeErrorSvg('GitHub API rate limit reached. Try later.'), 300)
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return svgResponse(makeErrorSvg(`Failed to fetch data: ${message}`), 60)
  }

  // Compose SVG
  let svg: string
  let cacheSeconds: number
  try {
    const result = composeCards(username, params, data)
    svg = result.svg
    cacheSeconds = result.cacheSeconds
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Render error'
    return svgResponse(makeErrorSvg(`Card render failed: ${message}`), 60)
  }

  const etag = `"${createHash('sha1').update(svg).digest('hex').slice(0, 16)}"`
  const cacheAge = cacheHit ? Math.floor((Date.now() - fetchStart) / 1000) : 0

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${cacheSeconds}, stale-while-revalidate=86400`,
      ETag: etag,
      'X-Cache': cacheHit ? 'HIT' : 'MISS',
      'X-Cache-Age': String(cacheAge),
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function svgResponse(svg: string, maxAge: number): NextResponse {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `public, max-age=${maxAge}`,
      'Access-Control-Allow-Origin': '*',
    },
  })
}
