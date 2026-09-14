'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SolveServer } from '@/entities/solve/model/types'
import formatTime from '@/shared/lib/formatTime'
import { CountryFlag } from '@/shared/ui/country-flag/CountryFlag'
import { PODIUM_CHIP, PODIUM_COLOR } from '@/shared/const/podium'
import { cn } from '@/shared/lib/utils'

const VISUAL_ORDER = [1, 0, 2]

export default function LeaderboardPodium({ solves }: { solves: SolveServer[] }) {
  const router = useRouter()
  const top = solves.filter((solve) => solve?.user).slice(0, 3)
  if (top.length < 3) return null

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-3">
      {VISUAL_ORDER.map((place, order) => {
        const solve = top[place]
        const isFirst = place === 0
        return (
          <motion.button
            key={solve._id}
            type="button"
            onClick={() => router.push(`/people/${solve.user._id}`)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 * order, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'algo-card-notch group flex min-w-0 cursor-pointer flex-col items-center gap-1.5 px-2 pb-3 text-center sm:gap-2',
              isFirst ? 'pt-5 sm:pt-7' : 'pt-3 sm:pt-4'
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ backgroundColor: PODIUM_COLOR[place] }}
            />
            <span
              className={cn(
                'chip-notch chip-notch-sm flex size-6 items-center justify-center font-display text-[11px] font-bold',
                PODIUM_CHIP[place]
              )}
            >
              {place + 1}
            </span>
            <Avatar
              className={cn(
                'shrink-0 ring-2 ring-offset-2 ring-offset-background',
                isFirst ? 'size-14 sm:size-16' : 'size-10 sm:size-12'
              )}
              style={{ ['--tw-ring-color' as string]: PODIUM_COLOR[place] }}
            >
              <AvatarImage className="object-cover" src={solve.user.image} alt={solve.user.name} />
              <AvatarFallback className="text-xs font-bold">{solve.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="flex max-w-full items-center gap-1 text-xs font-semibold sm:text-sm">
              {solve.user.country && (
                <CountryFlag code={solve.user.country} className="hidden shrink-0 sm:inline-block" />
              )}
              <span className="truncate transition-colors group-hover:text-primary">{solve.user.name}</span>
            </span>
            <span
              className={cn(
                'font-mono font-bold tabular-nums leading-none',
                isFirst ? 'text-base text-amber-700 sm:text-xl dark:text-amber-400' : 'text-sm sm:text-base'
              )}
            >
              {formatTime(solve.time)}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
