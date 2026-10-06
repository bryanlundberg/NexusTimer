'use client'

import { useMemo, type ElementType } from 'react'
import { useTranslations } from 'next-intl'
import { PlusIcon, type LucideIcon } from 'lucide-react'
import {
  TimerNavIcon,
  SolvesNavIcon,
  StatsNavIcon,
  CubeNavIcon,
  SettingsNavIcon,
  TrainerNavIcon,
  AlgorithmsNavIcon,
  PeopleNavIcon,
  FriendsNavIcon,
  MessagesNavIcon,
  LeaderboardsNavIcon,
  FreePlayNavIcon
} from '@/components/ui/nav-icons'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { ALGORITHM_SET_CATALOG } from '@nexustimer/algorithms/sets'
import { formatBadgeCount } from '@/shared/lib/badge-count'
import { useFriends } from '@/entities/friendship/model/useFriends'
import { useInbox } from '@/entities/chat/model/useInbox'

export const SECTION_ACCENT = {
  platform: 'var(--cube-blue)',
  training: 'var(--cube-green)',
  community: 'var(--cube-orange)'
} as const

export type SectionKey = keyof typeof SECTION_ACCENT

export const SECTION_KEYS = Object.keys(SECTION_ACCENT) as SectionKey[]

export interface SidebarNavItem {
  title: string
  url: string
  icon: ElementType
  badge?: string
  action?: { icon: LucideIcon; label: string; onClick: () => void }
  items?: { title: string; url: string }[]
}

export interface SidebarNavSection {
  key: SectionKey
  label: string
  accent: string
  items: SidebarNavItem[]
}

export function useSidebarNav(): SidebarNavSection[] {
  const t = useTranslations('Index')
  const { handleCreate } = useCubeActions()
  const { data: friends } = useFriends()
  const { data: inbox } = useInbox()
  const incomingRequests = friends?.incoming?.length ?? 0
  const unreadMessages = inbox?.totalUnread ?? 0

  return useMemo(
    () => [
      {
        key: 'platform',
        label: t('NavMain.platform'),
        accent: SECTION_ACCENT.platform,
        items: [
          { title: t('NavMain.timer'), url: '/app', icon: TimerNavIcon },
          { title: t('NavMain.solves'), url: '/solves', icon: SolvesNavIcon },
          { title: t('NavMain.statistics'), url: '/stats', icon: StatsNavIcon },
          {
            title: t('NavMain.cubes'),
            url: '/cubes',
            icon: CubeNavIcon,
            action: { icon: PlusIcon, label: t('CubesPage.new-collection'), onClick: handleCreate }
          },
          { title: t('NavMain.settings'), url: '/options', icon: SettingsNavIcon }
        ]
      },
      {
        key: 'training',
        label: t('NavMain.training'),
        accent: SECTION_ACCENT.training,
        items: [
          { title: t('NavMain.trainer'), url: '/algorithms/trainer', icon: TrainerNavIcon },
          {
            title: t('AlgorithmsPage.title'),
            url: '/algorithms',
            icon: AlgorithmsNavIcon,
            items: ALGORITHM_SET_CATALOG.map((set) => ({
              title: set.title.toUpperCase(),
              url: `/algorithms/${set.slug.toLowerCase()}`
            }))
          }
        ]
      },
      {
        key: 'community',
        label: t('NavMain.community'),
        accent: SECTION_ACCENT.community,
        items: [
          { title: t('NavMain.people'), url: '/people', icon: PeopleNavIcon },
          {
            title: t('NavMain.friends'),
            url: '/friends',
            icon: FriendsNavIcon,
            badge: incomingRequests > 0 ? formatBadgeCount(incomingRequests) : undefined
          },
          {
            title: t('NavMain.messages'),
            url: '/messages',
            icon: MessagesNavIcon,
            badge: unreadMessages > 0 ? formatBadgeCount(unreadMessages) : undefined
          },
          { title: t('NavMain.leaderboards'), url: '/leaderboards', icon: LeaderboardsNavIcon },
          { title: t('NavMain.free-play'), url: '/free-play', icon: FreePlayNavIcon }
        ]
      }
    ],
    [t, handleCreate, incomingRequests, unreadMessages]
  )
}
