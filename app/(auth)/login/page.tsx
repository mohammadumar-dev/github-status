import { Button } from '@/components/ui/button'
import { GitBranch } from 'lucide-react'
import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-slate-400">
            Connect your GitHub account to access your dashboard.
          </p>
        </div>
        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/dashboard' })
          }}
        >
          <Button className="w-full gap-2" size="lg" type="submit">
            <GitBranch className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </form>
        <p className="mt-6 text-xs text-slate-500">
          By signing in you agree to our terms. No credit card required.
        </p>
      </div>
    </div>
  )
}
