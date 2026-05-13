'use client'

import { Tabs } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import { ProfileHeroBanner } from '@/widgets/people/ui/profile-hero-banner'
import { ProfileStatsBar } from '@/widgets/people/ui/profile-stats-bar'
import { UserDocument } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'
import { useTranslations } from 'next-intl'
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCompareUsersStore } from '@/features/compare-users/model/useCompareUsersStore'
import { FlyingAvatar } from '@/features/compare-users/ui/FlyingAvatar'
import { CheckCircle2, GitCompareIcon } from 'lucide-react'

interface PeopleTabsProps {
  user: UserDocument
  cubes: Array<Cube>
}

const tabs = [PTabs.OVERVIEW, PTabs.CUBES, PTabs.TIMELINE] as const

export function PeopleTabs({ user, cubes }: PeopleTabsProps) {
  const t = useTranslations('Index.PeoplePage.tabs')
  const tProfile = useTranslations('Index.PeoplePage')
  const tCard = useTranslations('Index.PeoplePage.user-card')

  const { data: session } = useSession()
  const isCurrentUser = session?.user?.id === user._id
  const router = useRouter()

  const addUser = useCompareUsersStore((state) => state.addUser)
  const removeUser = useCompareUsersStore((state) => state.removeUser)
  const users = useCompareUsersStore((state) => state.users)
  const isAdded = !!users.find((u) => u._id === user._id)

  const [isFlying, setIsFlying] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const compareRef = useRef<HTMLButtonElement>(null)

  const handleCompareClick = () => {
    if (!isAdded) {
      if (compareRef.current) {
        const rect = compareRef.current.getBoundingClientRect()
        setStartPos({ x: rect.left, y: rect.top })
        setIsFlying(true)
      }
      addUser(user)
    } else {
      removeUser(user._id)
    }
  }

  const { value, set } = usePeopleTab()
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const labels: Record<PTabs, string> = {
    [PTabs.OVERVIEW]: t('overview'),
    [PTabs.CUBES]: t('cubes'),
    [PTabs.TIMELINE]: t('timeline')
  }

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current.get(value)
    const container = containerRef.current
    if (el && container) {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({ left: elRect.left - containerRect.left, width: elRect.width })
    }
  }, [value])

  useEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  return (
    <div className="flex flex-col w-full">
      {isFlying && <FlyingAvatar src={user.image} startPos={startPos} onComplete={() => setIsFlying(false)} />}

      <ProfileHeroBanner user={user} cubes={cubes} />
      <ProfileStatsBar cubes={cubes} />

      <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full">
        {/* Tabs nav + actions row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-3 border-b border-border/40">
          <div
            ref={containerRef}
            role="tablist"
            className="relative inline-flex h-9 w-fit items-center rounded-lg bg-muted/40 p-0.75"
          >
            <motion.div
              className="absolute top-0.75 bottom-0.75 rounded-md bg-background/60 shadow-sm dark:bg-input/20"
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            {tabs.map((tab) => (
              <button
                key={tab}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab, el)
                }}
                role="tab"
                aria-selected={value === tab}
                data-state={value === tab ? 'active' : 'inactive'}
                onClick={() => set(tab)}
                className="relative z-10 inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors text-muted-foreground data-[state=active]:text-foreground"
              >
                {labels[tab]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isCurrentUser && (
              <Button variant="secondary" size="sm" onClick={() => router.push('/account')}>
                {tProfile('edit-profile')}
              </Button>
            )}
            <Button
              ref={compareRef}
              variant={isAdded ? 'secondary' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={handleCompareClick}
            >
              {isAdded ? (
                <CheckCircle2 className="size-4 text-primary animate-in zoom-in duration-300" />
              ) : (
                <GitCompareIcon className="size-4" />
              )}
              {tCard('compare')}
            </Button>
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 md:px-6 py-4">
          <PeopleContent cubes={cubes} />
        </div>
      </Tabs>
    </div>
  )
}
