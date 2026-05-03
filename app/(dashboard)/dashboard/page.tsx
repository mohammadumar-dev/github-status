import { auth } from '@/lib/auth'
import { cacheManager } from '@/lib/cache/manager'
import { Header } from '@/components/dashboard/Header'
import { CardPreview } from '@/components/dashboard/CardPreview'
import { EmbedCodePanel } from '@/components/dashboard/EmbedCodePanel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const username = session?.user?.githubUsername ?? ''

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const cardUrl = `${appUrl}/api/card?username=${username}`

  let cacheStatus = null
  if (username) {
    cacheStatus = await cacheManager.getCacheStatus(username)
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Your Profile Card</h2>
            <p className="text-sm text-slate-400 mt-1">
              {username ? `Showing stats for @${username}` : 'Sign in with GitHub to see your stats'}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/preview">Customize →</Link>
          </Button>
        </div>

        {username ? (
          <>
            <div className="rounded-xl border border-white/10 bg-black/20 p-6">
              <CardPreview url={`${cardUrl}&card=stats`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Cache Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={cacheStatus?.cached ? 'default' : 'secondary'}>
                    {cacheStatus?.stale ? 'Stale' : cacheStatus?.cached ? 'Fresh' : 'Uncached'}
                  </Badge>
                  {cacheStatus?.age != null && cacheStatus.age > 0 && (
                    <p className="text-xs text-slate-500 mt-1">Updated {cacheStatus.age}s ago</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Cache TTL</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-lg font-mono text-white">
                    {cacheStatus?.expiresAt
                      ? `${Math.max(0, Math.floor((cacheStatus.expiresAt.getTime() - Date.now()) / 1000))}s`
                      : '—'}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Until next refresh</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Username</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-mono text-indigo-300">@{username}</span>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Embed Code</h3>
              <EmbedCodePanel url={cardUrl} username={username} />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-slate-400">Connect your GitHub account to see your profile cards.</p>
          </div>
        )}
      </div>
    </div>
  )
}
