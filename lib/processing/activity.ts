import type { GitHubEvent, GitHubEventType } from '@/types/github'
import type { ProcessedActivity } from '@/types/card'

interface EventMeta {
  icon: string
  color: string
  title: (payload: Record<string, unknown>, repoName: string) => string
  subtitle: (payload: Record<string, unknown>) => string
}

const EVENT_META: Partial<Record<GitHubEventType, EventMeta>> = {
  PushEvent: {
    icon: 'commit',
    color: '#6366F1',
    title: (p, repo) => {
      const commits = (p.commits as unknown[])?.length ?? 0
      return `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${repo}`
    },
    subtitle: p => {
      const commits = p.commits as Array<{ message: string }> | undefined
      return commits?.[0]?.message?.split('\n')[0] ?? ''
    },
  },
  PullRequestEvent: {
    icon: 'pr',
    color: '#8B5CF6',
    title: (p, repo) => {
      const action = p.action as string
      return `${capitalize(action)} PR in ${repo}`
    },
    subtitle: p => {
      const pr = p.pull_request as { title?: string } | undefined
      return pr?.title ?? ''
    },
  },
  IssuesEvent: {
    icon: 'issue',
    color: '#F59E0B',
    title: (p, repo) => `${capitalize(p.action as string)} issue in ${repo}`,
    subtitle: p => {
      const issue = p.issue as { title?: string } | undefined
      return issue?.title ?? ''
    },
  },
  CreateEvent: {
    icon: 'code',
    color: '#10B981',
    title: (p, repo) => {
      const ref = p.ref as string | null
      const refType = p.ref_type as string
      return ref ? `Created ${refType} ${ref} in ${repo}` : `Created repository ${repo}`
    },
    subtitle: () => '',
  },
  ForkEvent: {
    icon: 'fork',
    color: '#3B82F6',
    title: (_p, repo) => `Forked ${repo}`,
    subtitle: p => {
      const forkee = p.forkee as { full_name?: string } | undefined
      return forkee?.full_name ?? ''
    },
  },
  WatchEvent: {
    icon: 'star',
    color: '#F59E0B',
    title: (_p, repo) => `Starred ${repo}`,
    subtitle: () => '',
  },
  ReleaseEvent: {
    icon: 'trophy',
    color: '#EC4899',
    title: (_p, repo) => `Published a release in ${repo}`,
    subtitle: p => {
      const release = p.release as { tag_name?: string } | undefined
      return release?.tag_name ?? ''
    },
  },
  IssueCommentEvent: {
    icon: 'issue',
    color: '#F59E0B',
    title: (_p, repo) => `Commented on an issue in ${repo}`,
    subtitle: () => '',
  },
  PullRequestReviewEvent: {
    icon: 'review',
    color: '#8B5CF6',
    title: (_p, repo) => `Reviewed a PR in ${repo}`,
    subtitle: () => '',
  },
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isBot(login: string): boolean {
  return login.includes('[bot]') || login.endsWith('-bot') || login.endsWith('_bot')
}

export function processEvents(events: GitHubEvent[]): ProcessedActivity[] {
  const filtered = events.filter(e => !isBot(e.actor.login))

  // Group consecutive PushEvents to same repo within 1 hour
  const grouped: GitHubEvent[] = []
  for (const event of filtered) {
    const prev = grouped[grouped.length - 1]
    if (
      event.type === 'PushEvent' &&
      prev?.type === 'PushEvent' &&
      prev.repo.name === event.repo.name &&
      Math.abs(new Date(event.created_at).getTime() - new Date(prev.created_at).getTime()) < 3_600_000
    ) {
      const prevCommits = (prev.payload.commits as unknown[]) ?? []
      const newCommits = (event.payload.commits as unknown[]) ?? []
      prev.payload = { ...prev.payload, commits: [...prevCommits, ...newCommits] }
    } else {
      grouped.push({ ...event, payload: { ...event.payload } })
    }
  }

  return grouped.slice(0, 6).map(event => {
    const repoName = event.repo.name
    const shortRepo = repoName.includes('/') ? repoName.split('/')[1] : repoName
    const meta = EVENT_META[event.type]

    return {
      id: event.id,
      iconName: meta?.icon ?? 'clock',
      color: meta?.color ?? '#6B7280',
      title: meta?.title(event.payload, shortRepo) ?? `${event.type} on ${shortRepo}`,
      subtitle: meta?.subtitle(event.payload) ?? '',
      repoName,
      url: `https://github.com/${repoName}`,
      createdAt: event.created_at,
    }
  })
}
