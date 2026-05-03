import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/shared/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GitHub Profile Cards',
    template: '%s | GitHub Profile Cards',
  },
  description:
    'Generate dynamic, SVG-based developer analytics cards for your GitHub README profile.',
  openGraph: {
    title: 'GitHub Profile Cards',
    description: 'Beautiful, embeddable GitHub stats cards for your README.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Profile Cards',
    description: 'Beautiful, embeddable GitHub stats cards for your README.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn('h-full antialiased', inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
