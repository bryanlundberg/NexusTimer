'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'
import { ArrowRightLeft, Trash, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!selectionMode) return null

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

  const handleDelete = async () => {
    const ids = Array.from(selectedIds)
    await deleteSelected(ids)
    toast.success(t('SolvesPage.selection.deleted-toast', { count: ids.length }), { duration: 1500 })
    setConfirmOpen(false)
    exit()
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-3">
      <div className="animate-in slide-in-from-bottom-4 fade-in-0 mx-auto flex max-w-2xl items-center gap-2 rounded-xl bg-foreground p-2 text-background shadow-xl ring-1 ring-foreground/10 duration-300 ease-out">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('SolvesPage.selection.cancel')}
          onClick={exit}
          className="text-background hover:bg-background/15 hover:text-background dark:hover:bg-background/15"
        >
          <X className="size-4" />
        </Button>

        <span className="min-w-0 flex-1 truncate text-sm font-medium tabular-nums">
          {t('SolvesPage.selection.selected', { count })}
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 bg-background text-foreground hover:bg-background/85 hover:text-foreground dark:hover:bg-background/85"
          disabled={count === 0}
          onClick={handleMove}
          data-testid={isSession ? 'bulk-move-to-history-button' : 'bulk-move-to-session-button'}
        >
          <ArrowRightLeft className="size-3.5" />
          <span className="hidden text-xs sm:inline">
            {t(isSession ? 'SolvesPage.selection.move-to-history' : 'SolvesPage.selection.move-to-session')}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 bg-red-500 text-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600"
          disabled={count === 0}
          onClick={() => setConfirmOpen(true)}
          data-testid="bulk-delete-button"
        >
          <Trash className="size-3.5" />
          <span className="hidden text-xs sm:inline">{t('SolvesPage.selection.delete')}</span>
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
