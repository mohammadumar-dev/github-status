import ky, { type KyInstance, type AfterResponseState } from 'ky'

export class RateLimitError extends Error {
  constructor(public reset: number) {
    super(`GitHub API rate limit exceeded. Resets at ${new Date(reset * 1000).toISOString()}`)
    this.name = 'RateLimitError'
  }
}

export class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`GitHub user '${username}' not found`)
    this.name = 'UserNotFoundError'
  }
}

export const githubRest: KyInstance = ky.create({
  baseUrl: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
  retry: {
    limit: 3,
    methods: ['get'],
    statusCodes: [429, 500, 502, 503, 504],
    backoffLimit: 2000,
  },
  hooks: {
    afterResponse: [
      async ({ request, response }: AfterResponseState): Promise<Response | void> => {
        if (response.status === 403 || response.status === 429) {
          const resetHeader = response.headers.get('x-ratelimit-reset')
          const reset = resetHeader ? parseInt(resetHeader, 10) : Math.floor(Date.now() / 1000) + 3600
          throw new RateLimitError(reset)
        }
        if (response.status === 404) {
          const url = new URL(request.url)
          const parts = url.pathname.split('/')
          const username = parts[parts.indexOf('users') + 1] ?? 'unknown'
          throw new UserNotFoundError(username)
        }
        return response
      },
    ],
  },
})

export async function githubGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await ky.post('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    json: { query, variables },
    retry: { limit: 3 },
  }).json<{ data: T; errors?: Array<{ message: string }> }>()

  if (response.errors && response.errors.length > 0) {
    throw new Error(`GraphQL errors: ${response.errors.map(e => e.message).join(', ')}`)
  }

  return response.data
}
