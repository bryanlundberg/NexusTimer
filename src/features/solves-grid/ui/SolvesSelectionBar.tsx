'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'
import { ArrowRightLeft, Share2, Trash, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export default function SolvesSelectionBar() {
  const t = useTranslations('Index')
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })
  const tab = tabMode === SolveTab.SESSION ? SolveTab.SESSION : SolveTab.ALL
  const isSession = tab === SolveTab.SESSION
  const { selectionMode, selectedIds, exit } = useSolvesSelection()
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3">
      <div
        onTransitionEnd={(e) => {
          if (e.propertyName === 'translate' && !selectionMode) setShouldRender(false)
        }}
        className={cn(
          'notch-bl pointer-events-auto mx-auto flex max-w-2xl items-center gap-1 sm:gap-2 bg-foreground p-2 text-background shadow-xl transition-[translate,opacity]',
          visible
            ? 'translate-y-0 opacity-100 duration-400 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]'
            : 'translate-y-[calc(100%+16px)] opacity-0 duration-200 ease-in'
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('SolvesPage.selection.cancel')}
          onClick={exit}
          className="shrink-0 text-background hover:bg-background/15 hover:text-background dark:hover:bg-background/15"
        >
          <X className="size-4" />
        </Button>

        <span className="min-w-0 flex-1 truncate text-sm font-medium tabular-nums">
          {t('SolvesPage.selection.selected', { count })}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-red-500 hover:bg-red-500/15 hover:text-red-500 dark:hover:bg-red-500/15"
          disabled={count === 0}
          onClick={() => setConfirmOpen(true)}
          data-testid="bulk-delete-button"
        >
          <Trash className="size-3.5" />
          <span className="hidden text-xs sm:inline">{t('SolvesPage.selection.delete')}</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={count === 0}
          onClick={handleShare}
          data-testid="bulk-share-button"
        >
          <Share2 className="size-3.5" />
          <span className="hidden text-xs sm:inline">{t('SolvesPage.share')}</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={count === 0}
          onClick={handleMove}
          data-testid={isSession ? 'bulk-move-to-history-button' : 'bulk-move-to-session-button'}
        >
          <ArrowRightLeft className="size-3.5" />
          <span className="hidden text-xs sm:inline">
            {t(isSession ? 'SolvesPage.selection.move-to-history' : 'SolvesPage.selection.move-to-session')}
          </span>
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('SolvesPage.selection.delete-confirm-title', { count })}</AlertDialogTitle>
            <AlertDialogDescription>{t('SolvesPage.selection.delete-confirm-desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Inputs.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('SolvesPage.selection.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
