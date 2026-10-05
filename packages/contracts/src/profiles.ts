import type { CubingMethod, Layers } from './profile'
import type { UserStatsSummary } from './user-stats'

export const USERS_PAGE_SIZE = 25

export interface PublicProfile {
  _id: string
  name: string
  image: string
  bio?: string
  pronoun?: string
  country?: string
  goal?: string
  method?: CubingMethod
  mainColors?: Layers[]
  links?: string[]
  wcaId?: string
  wcaVerifiedAt?: number
  backup?: { url?: string; updatedAt?: number }
  createdAt: string
  updatedAt: string
}

export interface UserProfileResponse extends PublicProfile {
  grantedAchievements?: string[]
  statsHidden?: true
}

export type UsersListEntry = PublicProfile & { statsHidden?: true }

export interface UsersListResponse {
  events: UsersListEntry[]
  page: number
  pages: number
  docs: number
}

export interface LearnedMethodSummary {
  methodSlug: string
  count: number
  caseIds: string[]
}

export interface LearnedSummary {
  total: number
  methods: LearnedMethodSummary[]
}

export type UserLearnedResponse = LearnedSummary & { hidden?: true }

export type UserStatsResponse = { stats: UserStatsSummary | null; hidden?: true }
