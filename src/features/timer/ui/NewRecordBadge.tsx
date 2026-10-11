import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Share2 } from 'lucide-react'
import { Nexi } from '@/shared/ui/nexi'
import { Button } from '@/components/ui/button'
import formatTime from '@/shared/lib/formatTime'
import { Solve } from '@/entities/solve/model/types'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useSession } from '@/shared/model/useSession'
import { useIsMobile } from '@/shared/model/use-mobile'
import { useSharedSolveActions } from '@/features/share-solve/model/useSharedSolveActions'

const CELEBRATION_MS = 3300

interface NewRecordBadgeProps {
  solve: Solve
  improvement: number | null
}

export default function NewRecordBadge({ solve, improvement }: NewRecordBadgeProps) {
  const t = useTranslations('Index')
  const decimals = useSettingsStore((store) => store.settings.timer.decimals)
  const category = useTimerStore((store) => store.selectedCube?.category)
  const { data: session } = useSession()
  const isMobile = useIsMobile()
  const { share, pending } = useSharedSolveActions()
  const [celebrating, setCelebrating] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setCelebrating(false), CELEBRATION_MS)
    return () => clearTimeout(timeout)
  }, [])

  const canShare = !!session?.user?.id && !!category

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="notch-bl-tr flex flex-col gap-3 border border-record/30 bg-record/[0.06] p-3"
      role="status"
    >
      <div className="flex items-center gap-4 pr-2">
        <Nexi state={celebrating ? 'pb' : 'idle'} size={64} aria-hidden className="shrink-0" />
        <div className="flex min-w-0 flex-col items-start gap-1 text-left">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-sm font-semibold text-record">
              {t('HomePage.congratulations', { time: formatTime(solve.time, decimals) })}
            </span>
            {improvement !== null && (
              <span className="font-display text-xl leading-none text-record">
                −{formatTime(improvement, decimals)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{t('HomePage.personal_best')}</span>
        </div>
      </div>
      {canShare && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full text-xs"
          disabled={pending}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => category && share(solve, category, { native: isMobile })}
        >
          <Share2 className="size-3.5" />
          {t('SolvesPage.share')}
        </Button>
      )}
    </motion.div>
  )
}
