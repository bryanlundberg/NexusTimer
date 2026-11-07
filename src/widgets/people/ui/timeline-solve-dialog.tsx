'use client'

import { useState } from 'react'
import { CalendarIcon, ClockIcon, CopyIcon } from '@radix-ui/react-icons'
import { Box } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import dayjs from '@/shared/lib/dayjs'
import formatTime from '@/shared/lib/formatTime'
import { cn } from '@/shared/lib/utils'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import Segmented from '@/shared/ui/segmented/Segmented'
import type { RecentSolve } from '@/entities/user-stats/model/types'

interface TimelineSolveDialogProps {
  solve: RecentSolve
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimelineSolveDialog({ solve, open, onOpenChange }: TimelineSolveDialogProps) {
  const locale = useLocale()
  const t = useTranslations('Index')
  const [visualization, setVisualization] = useState<'2D' | '3D'>('2D')

  const date = dayjs(solve.startTime).locale(locale)

  const handleCopyScramble = async () => {
    try {
      await navigator.clipboard.writeText(solve.scramble)
      toast.success(t('SharedSolves.scramble-copied'))
    } catch {
      toast.error(t('SharedSolves.errors.generic'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="items-center px-4 pt-4 pb-3 text-center sm:px-5">
          <div className="flex items-baseline justify-center gap-2">
            <DialogTitle className="font-mono text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
              {solve.dnf ? 'DNF' : formatTime(solve.time)}
              {solve.plus2 && !solve.dnf && <span className="align-top text-base text-destructive">+</span>}
            </DialogTitle>
            <Badge variant="secondary" className="text-[10px]">
              {solve.category}
            </Badge>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {date.format('ll')} · {date.format('HH:mm')}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {date.fromNow()}
            </span>
            <span className="text-border">·</span>
            <span className="flex min-w-0 items-center gap-1">
              <Box className="size-3 shrink-0" />
              <span className="truncate">{solve.cubeName}</span>
            </span>
          </div>
        </DialogHeader>

        <div className="px-4 pb-4 sm:px-5">
          <div className="relative mb-1.5 px-8">
            <DialogDescription className="text-center font-mono text-xs leading-relaxed break-words text-muted-foreground select-all">
              {solve.scramble}
            </DialogDescription>
            <button
              type="button"
              aria-label={t('tooltips.copy')}
              title={t('tooltips.copy')}
              onClick={handleCopyScramble}
              className="absolute top-0 right-0 cursor-pointer p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <CopyIcon className="size-3.5" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <div data-vaul-no-drag className="surface surface-well flex w-full justify-center p-3">
              <ScrambleDisplay
                show
                scramble={solve.scramble}
                event={solve.category}
                visualization={visualization}
                className={cn(
                  'flex items-center justify-center',
                  visualization === '2D' ? 'h-26 w-36 sm:h-32 sm:w-44' : 'size-26 sm:size-32'
                )}
              />
            </div>
            <Segmented
              value={visualization}
              onChange={setVisualization}
              layoutId="timeline-solve-visualization"
              options={[
                { value: '2D', label: '2D' },
                { value: '3D', label: '3D' }
              ]}
              className="text-xs [&>button]:px-4 [&>button]:py-1"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
