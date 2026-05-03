# GitHub Profile Intelligence Cards

Dynamic, SVG-based developer analytics cards embeddable in GitHub README profiles.

## Quick Start

```bash
git clone <repo>
cd git-stats
npm install

# Copy env and fill in your values
cp .env.example .env.local

# Push schema to database
npm run db:push

# Start development
npm run dev
```

## API Reference

### `GET /api/card`

Returns `image/svg+xml`. Embed with:

```markdown
![GitHub Stats](https://your-app.vercel.app/api/card?username=torvalds)
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | string | **required** | GitHub username |
| `theme` | enum | `default` | Theme: `default`, `light`, `radical`, `tokyonight`, `dracula` |
| `card` | string | `all` | Card(s) to show. Single name, comma-separated, or `all` |
| `bg_color` | hex | — | Background color override (no `#`) |
| `title_color` | hex | — | Title text color override |
| `text_color` | hex | — | Body text color override |
| `icon_color` | hex | — | Icon color override |
| `border_color` | hex | — | Border color override |
| `accent_color` | hex | — | Accent color override |
| `hide_border` | bool | `false` | Hide card border |
| `hide_rank` | bool | `false` | Hide rank badge on stats card |
| `show_icons` | bool | `true` | Show icons |
| `cache_seconds` | int | `3600` | Cache TTL (300–86400) |
| `top_repos` | int | `3` | Number of repos to show (1–6) |
| `animate` | bool | `false` | Enable animations |

#### Card Names

| Name | Description | Size |
|------|-------------|------|
| `all` | Full composite dashboard | 820px |
| `profile` | Profile header with stats | 495px |
| `stats` | Developer stats + rank badge | 495px |
| `streak` | Contribution streak | 495px |
| `heatmap` | 52-week contribution heatmap | 730px |
| `langs` | Most used languages | 300px |
| `repos` | Top repositories | 495px |
| `commits` | Commit activity chart | 495px |
| `activity` | Recent activity timeline | 300px |

#### Example URLs

```
# Just stats card with Tokyo Night theme
/api/card?username=torvalds&card=stats&theme=tokyonight

# Custom accent color
/api/card?username=torvalds&accent_color=FF79C6

# Multiple specific cards
/api/card?username=torvalds&card=profile,stats,streak

# Hide border, custom colors
/api/card?username=torvalds&hide_border=true&bg_color=0D1117&accent_color=6366F1
```

### `GET /api/stats`

Returns the raw JSON data for a username. Same query params as `/api/card`.

### `POST /api/refresh`

Requires authentication. Invalidates cache for a username.

```json
{ "username": "torvalds" }
```

### `GET /api/themes`

Returns all available theme configurations as JSON.

## Architecture

```
Browser / GitHub README img tag
        |
        | GET /api/card?username=X
        v
Next.js 16 Route Handler
  -> Zod Params -> Rate Limiter -> CacheManager
                                      |
                             Cache Hit?  No -> GitHub API Fetcher
                                              (REST + GraphQL)
                                                    |
                                              Processing Layer
                                              (streak/langs/stats)
                                                    |
                                              Supabase/Postgres
                                         GithubProfileCache table
                                                    |
                                         SVG Composer (8 cards)
        |
        | image/svg+xml
        v
  GitHub README
```

## Self-Hosting on Vercel

1. Fork this repo
2. Create a [Supabase](https://supabase.com) project and copy connection strings
3. Create a [GitHub OAuth App](https://github.com/settings/developers)
4. Generate a GitHub Personal Access Token with `read:user`, `read:org`, `repo` scopes
5. Deploy to Vercel with these environment variables:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_TOKEN=ghp_...
AUTH_SECRET=<openssl rand -hex 32>
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

6. Run `npm run db:push` after deployment to create the database schema

## Contributing

1. Fork and clone
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in values
4. `npm run dev`
5. Submit a PR

## License

MIT
