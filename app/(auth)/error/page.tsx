import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'Access was denied. You may not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An unexpected authentication error occurred.',
  }

  const message = errorMessages[error ?? 'Default'] ?? errorMessages['Default']

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-red-500/30 bg-red-950/20 p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <Button asChild variant="outline">
          <Link href="/login">Try again</Link>
        </Button>
      </div>
    </div>
  )
}
