import * as z from 'zod'

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20
export const USERNAME_PATTERN = /^[a-z0-9_]+(\.[a-z0-9_]+)*$/
export const USERNAME_CHANGE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000

export const RESERVED_USERNAMES: ReadonlySet<string> = new Set([
  'about',
  'about_us',
  'account',
  'admin',
  'administrator',
  'algorithms',
  'api',
  'app',
  'auth',
  'contact',
  'cubes',
  'edge',
  'free_play',
  'friends',
  'help',
  'leaderboards',
  'login',
  'logout',
  'me',
  'messages',
  'mod',
  'moderator',
  'nexi',
  'nexus',
  'nexustimer',
  'null',
  'official',
  'options',
  'people',
  'privacy',
  'root',
  'settings',
  'signin',
  'signup',
  'solves',
  'staff',
  'stats',
  'support',
  'system',
  'team',
  'terms',
  'timer',
  'trainer',
  'undefined',
  'wca',
  'www'
])

export const USERNAME_ISSUES = ['too_short', 'too_long', 'invalid_format', 'reserved'] as const
export type UsernameIssue = (typeof USERNAME_ISSUES)[number]

export function normalizeUsername(input: string) {
  return input.trim().toLowerCase()
}

export function usernameIssue(username: string): UsernameIssue | null {
  if (username.length < USERNAME_MIN_LENGTH) return 'too_short'
  if (username.length > USERNAME_MAX_LENGTH) return 'too_long'
  if (!USERNAME_PATTERN.test(username)) return 'invalid_format'
  if (RESERVED_USERNAMES.has(username)) return 'reserved'
  return null
}

export const usernameSchema = z
  .string()
  .transform(normalizeUsername)
  .superRefine((value, ctx) => {
    const issue = usernameIssue(value)
    if (issue) ctx.addIssue({ code: 'custom', message: issue })
  })
