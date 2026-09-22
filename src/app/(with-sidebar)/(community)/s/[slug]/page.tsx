'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { CalendarIcon, CopyIcon, Layers, Link2Off, RotateCw, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { QaMoreIcon } from '@/components/ui/quick-action-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import ScrambleDisplay from '@/shared/ui/scramble-display/ui/ScrambleDisplay'
import PeopleSkeleton from '@/shared/ui/skeletons/people-skeleton'
import formatTime from '@/shared/lib/formatTime'
import { formatTps } from '@/shared/lib/formatTps'
import dayjs from '@/shared/lib/dayjs'
import { tryAnalyzeSolution } from '@/shared/lib/tryAnalyzeSolution'
import { cn } from '@/shared/lib/utils'
import { useSharedSolve } from '@/entities/shared-solve/model/useSharedSolve'
import { SolveBreakdown } from '@/features/manage-solves/ui/SolveBreakdown'
import { phaseMarkers } from '@/features/replay-solve-details/model/useReplaySolveDetails'
import { Stat } from '@/features/replay-solve-details/ui/Stat'
import { useSharedSolveActions } from '@/features/share-solve/model/useSharedSolveActions'
import { PeopleTabs } from '@/widgets/people/model/types'
import EmptyTabContent from '@/widgets/people/ui/empty-tab-content'

const RealtimeReplayPlayer = dynamic(
  () => import('@/features/solve-replay/ui/RealtimeReplayPlayer').then((m) => m.RealtimeReplayPlayer),
  { ssr: false }
)

export default function SharedSolvePage() {
  const { slug } = useParams<{ slug: string }>() ?? { slug: '' }
  const t = useTranslations('Index.SharedSolves')
  const tNav = useTranslations('Index.NavMain')
  const tTooltips = useTranslations('Index.tooltips')
  const locale = useLocale()
  const { data: solve, isLoading } = useSharedSolve(slug)
  const { unshare, pending } = useSharedSolveActions()
  const router = useRouter()

  const [visualization, setVisualization] = useState<'2D' | '3D'>('2D')

  if (isLoading) return <PeopleSkeleton />

  if (!solve) {
    return (
      <div className="flex flex-col">
        <CoreHeader breadcrumbs={[{ label: tNav('people'), href: '/people' }]} />
        <EmptyTabContent message={t('not-found')} />
      </div>
    )
  }

  const replay = solve.replay?.moves.length ? solve.replay : null
  const analysis = replay ? tryAnalyzeSolution(replay.moves) : null
  const markers = phaseMarkers(analysis)
  const tps = analysis?.tps != null ? formatTps(analysis.tps) : null
  const profileHref = `/people/${solve.author._id}`
  const solvedDate = dayjs(solve.solvedAt).locale(locale)

  const handleUnshare = async () => {
    if (await unshare(solve.slug)) router.replace(`${profileHref}?tab=${PeopleTabs.SHARED}`)
  }

  const handleCopyScramble = async () => {
    try {
      await navigator.clipboard.writeText(solve.scramble)
      toast.success(t('scramble-copied'))
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  return (
    <ScrollArea className="max-h-dvh overflow-auto">
      <CoreHeader
        breadcrumbs={[
          { label: tNav('people'), href: '/people' },
          { label: solve.author.name, href: profileHref },
          { label: t('breadcrumb'), href: `/s/${solve.slug}` }
        ]}
        accentStripe
      />

      <PageBody variant="hero" className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pb-12">
        <div className="flex items-center justify-between gap-3">
          <Link href={profileHref} className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={solve.author.image} alt={solve.author.name} />
              <AvatarFallback>{solve.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold hover:underline">{solve.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {t('shared-ago', { ago: dayjs(solve.sharedAt).locale(locale).fromNow() })}
              </span>
            </div>
          </Link>

          {solve.isOwner && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 min-w-9 text-muted-foreground"
                  aria-label={tTooltips('more-actions')}
                  data-testid="shared-solve-more-button"
                >
                  <QaMoreIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  data-testid="shared-solve-unshare-button"
                  disabled={pending}
                  onSelect={handleUnshare}
                  className="text-destructive focus:text-destructive"
                >
                  <Link2Off className="mr-2 size-3" /> {t('unshare')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <section className="flex flex-col items-center gap-3 text-center">
          <CategoryBadge category={solve.puzzle} />
          <h1 className="font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-7xl">
            {solve.dnf ? 'DNF' : formatTime(solve.time)}
            {solve.plus2 && !solve.dnf && <span className="align-top text-2xl text-destructive">+2</span>}
          </h1>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            {solvedDate.format('ll')} · {solvedDate.format('HH:mm')}
          </span>
        </section>

        {analysis && (
          <section className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat icon={<RotateCw className="size-3" />} label={t('moves')} value={analysis.moves.length} />
              <Stat icon={<Zap className="size-3" />} label={t('tps')} value={tps ?? '—'} />
              <Stat icon={<Layers className="size-3" />} label={t('method')} value={analysis.method ?? '—'} />
            </div>
            <SolveBreakdown analysis={analysis} totalMs={solve.time} />
          </section>
        )}

        {replay && (
          <section className="flex justify-center">
            <RealtimeReplayPlayer replay={replay} markers={markers} />
          </section>
        )}

        <section className="flex flex-col items-center gap-3">
          <div className="relative w-full px-8">
            <p className="select-all break-words text-center font-mono text-sm leading-relaxed text-muted-foreground">
              {solve.scramble}
            </p>
            <button
              type="button"
              aria-label={t('copy-scramble')}
              onClick={handleCopyScramble}
              className="absolute right-0 top-0 rounded-none border p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <CopyIcon className="size-3.5" />
            </button>
          </div>
          {!replay && (
            <>
              <div className="notch-bl-tr [--nblt:12px] bg-muted/40 p-3">
                <ScrambleDisplay
                  show
                  scramble={solve.scramble}
                  event={solve.puzzle}
                  visualization={visualization}
                  className={cn(
                    'flex items-center justify-center',
                    visualization === '2D' ? 'h-32 w-44 sm:h-36 sm:w-52' : 'size-36 sm:size-40'
                  )}
                />
              </div>
              <div className="inline-flex overflow-hidden rounded-none border text-[10px] font-medium">
                {(['2D', '3D'] as const).map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisualization(v)}
                    className={cn(
                      'px-4 py-1 transition-colors',
                      i > 0 && 'border-l',
                      visualization === v ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      </PageBody>
    </ScrollArea>
  )
}
