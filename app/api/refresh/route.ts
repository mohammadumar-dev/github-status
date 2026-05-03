import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cacheManager } from '@/lib/cache/manager'
import { z } from 'zod'

const RefreshSchema = z.object({
  username: z.string().min(1).max(39).regex(/^[a-zA-Z0-9-]+$/),
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = RefreshSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
  }

  const { username } = parsed.data

  await cacheManager.invalidate(username)

  const nextRefreshAt = new Date(Date.now() + 3_600_000).toISOString()

  return NextResponse.json({
    success: true,
    message: `Cache invalidated for ${username}`,
    nextRefreshAt,
  })
}
