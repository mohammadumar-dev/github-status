import { z } from 'zod'

export const CardParamsSchema = z.object({
  username: z.string().min(1).max(39).regex(/^[a-zA-Z0-9-]+$/, 'Invalid GitHub username'),
  theme: z.enum(['default', 'light', 'radical', 'tokyonight', 'dracula']).default('default'),
  card: z.string().default('all'),
  bg_color: z.string().regex(/^[0-9A-Fa-f]{3,8}$/).optional(),
  title_color: z.string().regex(/^[0-9A-Fa-f]{3,8}$/).optional(),
  text_color: z.string().regex(/^[0-9A-Fa-f]{3,8}$/).optional(),
  icon_color: z.string().regex(/^[0-9A-Fa-f]{3,8}$/).optional(),
  border_color: z.string().regex(/^[0-9A-Fa-f]{3,8}$/).optional(),
  accent_color: z.string().regex(/^[0-9A-Fa-f]{3,8}$/).optional(),
  hide_border: z.coerce.boolean().default(false),
  hide_rank: z.coerce.boolean().default(false),
  show_icons: z.coerce.boolean().default(true),
  locale: z.string().length(2).default('en'),
  cache_seconds: z.coerce.number().min(300).max(86400).default(3600),
  top_repos: z.coerce.number().min(1).max(6).default(3),
  animate: z.coerce.boolean().default(false),
})

export type CardQueryParams = z.infer<typeof CardParamsSchema>
