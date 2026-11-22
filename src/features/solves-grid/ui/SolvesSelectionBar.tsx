'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'
import { ArrowRightLeft, ListChecks, Share2, Trash, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { createShareMessage } from '@/features/deep-statistics/lib/createShareMessage'
import dayjs from '@/shared/lib/dayjs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { useSolvesSelection } from '@/features/solves-grid/model/SolvesSelectionContext'
import useSolvesBulkActions from '@/features/solves-grid/model/useSolvesBulkActions'

interface SolvesSelectionBarProps {
  allIds: Array<string>
}

export default function SolvesSelectionBar({ allIds }: SolvesSelectionBarProps) {
  const t = useTranslations('Index')
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })
  const tab = tabMode === SolveTab.SESSION ? SolveTab.SESSION : SolveTab.ALL
  const isSession = tab === SolveTab.SESSION
  const { selectionMode, selectedIds, selectAll, exit } = useSolvesSelection()
  const { deleteSelected, moveSelectedToHistory } = useSolvesBulkActions(tab)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const locale = useLocale()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(selectionMode)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (selectionMode) {
      setShouldRender(true)
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
  }, [selectionMode])

  if (!shouldRender) return null

  const count = selectedIds.size
  const allSelected = allIds.length > 0 && count === allIds.length

  const handleMove = async () => {
    const ids = Array.from(selectedIds)
    await moveSelectedToHistory(ids)
    toast.success(
      t(isSession ? 'SolvesPage.selection.moved-toast' : 'SolvesPage.selection.moved-to-session-toast', {
        count: ids.length
      }),
      { duration: 1500 }
    )
    exit()
  }

  const handleShare = () => {
    if (!selectedCube) {
      toast(t('SolvesPage.toast.unable-action'), {
        description: t('SolvesPage.toast.warning-select-cube')
      })
      return
    }

    const source = isSession ? selectedCube.solves.session : selectedCube.solves.all
    const selectedSolves = source.filter((solve) => selectedIds.has(solve.id))

    const message = createShareMessage({
      type: 'all',
      solves: selectedSolves,
      translations: {
        statsTitle: t('SolvesPage.share-clipboard.header'),
        listOfTimes: t('SolvesPage.share-clipboard.list-of-times'),
        date: dayjs().locale(locale).format('L')
      }
    })

    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(message)
    }

    toast(t('SolvesPage.toast.success-copy'), {
      description: t('SolvesPage.toast.success-copy-description')
    })

    exit()
  }

  const handleDelete = async () => {
    const ids = Array.from(selectedIds)
    await deleteSelected(ids)
    toast.success(t('SolvesPage.selection.deleted-toast', { count: ids.length }), { duration: 1500 })
    setConfirmOpen(false)
    exit()
  }

  return (
    <div className="@container pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 drop-shadow-[0_8px_24px_rgb(0_0_0/0.35)]">
      <div
        onTransitionEnd={(e) => {
          if (e.propertyName === 'translate' && !selectionMode) setShouldRender(false)
        }}
        className={cn(
          'dialog-shell pointer-events-auto relative mx-auto flex max-w-2xl flex-wrap items-center gap-1 gap-y-2 p-2 text-foreground transition-[translate,opacity] @4xl:max-w-4xl @4xl:flex-nowrap @4xl:gap-2',
          visible
            ? 'translate-y-0 opacity-100 duration-400 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]'
            : 'translate-y-[calc(100%+16px)] opacity-0 duration-200 ease-in'
        )}
      >
        <div className="grid w-full grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-2 @4xl:w-auto @4xl:min-w-0 @4xl:flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={exit}
            className="justify-self-start gap-1.5 bg-muted pointer-coarse:h-10 hover:bg-muted/70 dark:bg-muted/50 dark:hover:bg-muted/70"
          >
            <X className="size-3.5" />
            <span className="text-xs">{t('SolvesPage.selection.cancel')}</span>
          </Button>

          <span className="truncate text-center text-sm font-medium tabular-nums">
            {t('SolvesPage.selection.selected', { count })}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="justify-self-end gap-1.5 bg-muted pointer-coarse:h-10 hover:bg-muted/70 dark:bg-muted/50 dark:hover:bg-muted/70"
            disabled={allSelected}
            onClick={() => selectAll(allIds)}
            data-testid="bulk-select-all-button"
          >
            <ListChecks className="size-3.5" />
            <span className="text-xs">{t('SolvesPage.selection.select-all')}</span>
          </Button>
        </div>

        <div className="grid w-full grid-cols-3 gap-1 @4xl:flex @4xl:w-auto @4xl:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="min-w-0 gap-1.5 bg-destructive/15 pointer-coarse:h-10 text-destructive hover:bg-destructive/25 hover:text-destructive dark:hover:bg-destructive/25"
            disabled={count === 0}
            onClick={() => setConfirmOpen(true)}
            data-testid="bulk-delete-button"
          >
            <Trash className="size-3.5" />
            <span className="truncate text-xs">{t('SolvesPage.selection.delete')}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="min-w-0 gap-1.5 bg-muted pointer-coarse:h-10 hover:bg-muted/70 dark:bg-muted/50 dark:hover:bg-muted/70"
            disabled={count === 0}
            onClick={handleShare}
            data-testid="bulk-share-button"
          >
            <Share2 className="size-3.5" />
            <span className="truncate text-xs">{t('SolvesPage.share')}</span>
          </Button>

          <Button
            size="sm"
            className="btn-notch-br min-w-0 gap-1.5 font-semibold pointer-coarse:h-10 @4xl:ms-1"
            disabled={count === 0}
            onClick={handleMove}
            data-testid={isSession ? 'bulk-move-to-history-button' : 'bulk-move-to-session-button'}
          >
            <ArrowRightLeft className="size-3.5" />
            <span className="truncate text-xs">
              {t(isSession ? 'SolvesPage.selection.move-to-history' : 'SolvesPage.selection.move-to-session')}
            </span>
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('SolvesPage.selection.delete-confirm-title', { count })}</AlertDialogTitle>
            <AlertDialogDescription>{t('SolvesPage.selection.delete-confirm-desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Inputs.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: 'destructive' })}>
              {t('SolvesPage.selection.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
