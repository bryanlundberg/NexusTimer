'use client'

import { PlayIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import type { LeaderboardSolve } from '@nexustimer/contracts'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useLeaderboardRow from '@/features/leaderboards-table/model/useLeaderboardRow'

export default function LeaderboardPodiumReplayButton({ solve }: { solve: LeaderboardSolve }) {
  const t = useTranslations('Index.LeaderboardsPage.table')
  const { openModal } = useLeaderboardRow(solve)

  if (!solve.replay?.moves?.length) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={t('watch-replay')}
          onClick={openModal}
          className="absolute right-1 top-1.5 inline-flex size-7 cursor-pointer items-center justify-center text-primary outline-none transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:size-10"
        >
          <PlayIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{t('watch-replay')}</TooltipContent>
    </Tooltip>
  )
}
