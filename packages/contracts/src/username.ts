import * as z from 'zod'
import { PAYLOAD_SUFFIX, SEGMENT_FILE_PREFIX } from './edge'

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20
export const USERNAME_PATTERN = /^[a-z0-9_]+(\.[a-z0-9_]+)*$/

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
  'avatar',
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
  'username',
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
  if (username.startsWith(SEGMENT_FILE_PREFIX) || username.endsWith(PAYLOAD_SUFFIX)) return 'reserved'
  return null
}

export const usernameSchema = z
  .string()
  .transform(normalizeUsername)
  .superRefine((value, ctx) => {
    const issue = usernameIssue(value)
    if (issue) ctx.addIssue({ code: 'custom', message: issue })
  })

export function profilePath(id: string, username?: string | null) {
  return `/people/${username || id}`
}

export const changeUsernameSchema = z.object({ username: usernameSchema }).strict()
export type ChangeUsernameInput = z.infer<typeof changeUsernameSchema>
export type ChangeUsernameResponse = { username: string; usernameChangedAt: number | null }

export const USERNAME_CHANGE_ERRORS = ['taken', 'locked'] as const
export type UsernameChangeError = (typeof USERNAME_CHANGE_ERRORS)[number]

export type UsernameAvailability = { available: boolean; issue: UsernameIssue | 'taken' | null }
