declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase / PostgreSQL
    DATABASE_URL: string
    DIRECT_URL: string

    // GitHub OAuth
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string

    // GitHub API Token
    GITHUB_TOKEN: string

    // NextAuth
    AUTH_SECRET: string
    NEXTAUTH_URL: string

    // App config
    NEXT_PUBLIC_APP_URL: string
    CACHE_TTL_SECONDS?: string
    MAX_REPOS_TO_SCAN?: string
    RATE_LIMIT_REQUESTS_PER_HOUR?: string

    // Standard Next.js
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
