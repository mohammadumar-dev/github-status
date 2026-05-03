import { auth } from '@/lib/auth'
import { Header } from '@/components/dashboard/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Settings" />
      <div className="flex-1 p-6 space-y-6 max-w-2xl">
        <h2 className="text-xl font-bold text-white">Account Settings</h2>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
            <CardDescription>Your connected GitHub account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Name</span>
              <span className="text-sm text-white">{session?.user?.name ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Email</span>
              <span className="text-sm text-white">{session?.user?.email ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">GitHub Username</span>
              <span className="text-sm font-mono text-indigo-300">
                @{session?.user?.githubUsername ?? '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="destructive" size="sm">
              <Link href="/api/auth/signout">Sign out of all sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
