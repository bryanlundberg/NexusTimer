import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePeopleTab } from '@/features/people-tab/model/usePeopleTab'
import { PeopleTabs as PTabs } from '@/widgets/people/model/types'
import { PeopleContent } from '@/widgets/people/ui/PeopleContent'
import UserInfo from '@/entities/user/ui/user-info'
import { UserDocument } from '@/entities/user/model/user'
import { Cube } from '@/entities/cube/model/types'
import { useTranslations } from 'next-intl'
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface PeopleTabsProps {
  user: UserDocument
  cubes: Array<Cube>
}

const tabs = [PTabs.OVERVIEW, PTabs.CUBES, PTabs.LAST_ACTIVITY] as const

export function PeopleTabs({ user, cubes }: PeopleTabsProps) {
  const t = useTranslations('Index.PeoplePage.tabs')
  const { value, set } = usePeopleTab()
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const labels: Record<PTabs, string> = {
    [PTabs.OVERVIEW]: t('overview'),
    [PTabs.CUBES]: t('cubes'),
    [PTabs.LAST_ACTIVITY]: t('last-activity')
  }

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current.get(value)
    const container = containerRef.current
    if (el && container) {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({
        left: elRect.left - containerRect.left,
        width: elRect.width
      })
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
      <div className="flex flex-col md:flex-row px-2 relative">
        <UserInfo user={user} />
        <div className="flex flex-col grow">
          <Tabs value={value} onValueChange={(e) => set(e as PTabs)} className="w-full">
            {/* Custom TabsList with sliding indicator */}
            <div
              ref={containerRef}
              role="tablist"
              className="relative inline-flex h-9 w-fit items-center rounded-lg bg-muted p-[3px]"
            >
              <motion.div
                className="absolute top-[3px] bottom-[3px] rounded-md bg-background shadow-sm dark:bg-input/30"
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
            <PeopleContent cubes={cubes} />
          </Tabs>
        </div>
      </div>
    </div>
  )
}
