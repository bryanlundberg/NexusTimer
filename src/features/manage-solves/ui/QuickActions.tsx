import { useState } from 'react'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CopyIcon, CubeIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { ArrowRightLeftIcon, Bookmark, MoreHorizontal, Trash } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useQuickActions from '@/features/manage-solves/model/useQuickActions'
import { Solve } from '@/entities/solve/model/types'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { cn } from '@/shared/lib/utils'

interface QuickActionsProps {
  solve: Solve | null
  hideCopyButton?: boolean
  hideMoveToHistory?: boolean
  hideTransferCollection?: boolean
  variant?: 'default' | 'modal'
  onDeleteSolve?: () => void
}

export default function QuickActions({
  solve,
  hideCopyButton = false,
  hideMoveToHistory = false,
  hideTransferCollection = false,
  variant = 'default',
  onDeleteSolve = () => {}
}: QuickActionsProps) {
  const t = useTranslations('Index')
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })
  const {
    handleTogglePlus2,
    handleDeleteSolve,
    handleToggleBookmark,
    handleToggleDNF,
    handleMoveToHistorial,
    handleTransferCollection,
    handleClipboard
  } = useQuickActions(solve!)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleConfirmDelete = () => {
    handleDeleteSolve()
    onDeleteSolve()
    setConfirmDeleteOpen(false)
  }

  const showDropdown =
    !hideCopyButton || !hideMoveToHistory || (tabMode === SolveTab.SESSION && !hideTransferCollection)

  const isOk = !solve?.plus2 && !solve?.dnf

  const deleteDialog = (
    <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('solve-details.delete-confirm-title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('solve-details.delete-confirm-desc')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Inputs.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>{t('tooltips.delete')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  const moreDropdown = showDropdown && (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 min-w-9 sm:h-8 sm:min-w-0 text-muted-foreground"
          aria-label={t('tooltips.more-actions')}
          data-testid="more-actions-button"
        >
          <MoreHorizontal className="size-4 sm:size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!hideCopyButton && (
          <DropdownMenuItem
            data-testid="copy-solve-button"
            onSelect={(e) => {
              e.preventDefault()
              handleClipboard()
            }}
          >
            <CopyIcon className="mr-2" /> {t('tooltips.copy')}
          </DropdownMenuItem>
        )}
        {!hideMoveToHistory && (
          <DropdownMenuItem
            data-testid="move-to-history-button"
            onSelect={(e) => {
              e.preventDefault()
              handleMoveToHistorial()
            }}
          >
            <CubeIcon className="mr-2" />{' '}
            {t(tabMode === SolveTab.SESSION ? 'solve-details.move-to-history' : 'solve-details.move-to-session')}
          </DropdownMenuItem>
        )}
        {tabMode === SolveTab.SESSION && !hideTransferCollection && (
          <DropdownMenuItem
            data-testid="transfer-collection-button"
            onSelect={(e) => {
              e.preventDefault()
              handleTransferCollection()
            }}
          >
            <ArrowRightLeftIcon size={12} className="mr-2" /> {t('solve-details.transfer-collection')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (variant === 'modal') {
    return (
      <TooltipProvider delayDuration={100}>
        <div
          className="flex items-center justify-between gap-2"
          id="quick-action-buttons"
          data-testid="quick-action-buttons"
        >
          {/* Penalty segmented control */}
          <div className="inline-flex items-center rounded-lg border overflow-hidden text-xs font-medium">
            <button
              type="button"
              onPointerDown={() => {
                if (solve?.plus2) handleTogglePlus2()
                else if (solve?.dnf) handleToggleDNF()
              }}
              className={cn(
                'px-3 py-1.5 transition-colors',
                isOk ? 'bg-emerald-500/15 text-emerald-500' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              OK
            </button>
            <button
              type="button"
              data-testid="plus-two-button"
              onPointerDown={() => {
                if (!solve?.plus2) handleTogglePlus2()
              }}
              className={cn(
                'px-3 py-1.5 border-l transition-colors',
                solve?.plus2 ? 'bg-destructive/15 text-destructive' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              +2
            </button>
            <button
              type="button"
              data-testid="dnf-button"
              onPointerDown={() => {
                if (!solve?.dnf) handleToggleDNF()
              }}
              className={cn(
                'px-3 py-1.5 border-l transition-colors',
                solve?.dnf ? 'bg-destructive/15 text-destructive' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              DNF
            </button>
          </div>

          {/* Icon cluster */}
          <div className="flex items-center gap-0.5 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="bookmark-button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-9 min-w-9 sm:h-8 sm:min-w-0',
                    solve?.bookmark ? 'text-yellow-400 hover:text-yellow-400' : 'text-muted-foreground'
                  )}
                  onPointerDown={handleToggleBookmark}
                >
                  <Bookmark className="size-4 sm:size-3.5" fill={solve?.bookmark ? 'currentColor' : 'none'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('tooltips.bookmark')}</p>
              </TooltipContent>
            </Tooltip>

            {moreDropdown}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  data-testid="delete-solve-button"
                  variant="ghost"
                  size="sm"
                  className="h-9 min-w-9 sm:h-8 sm:min-w-0 text-muted-foreground hover:text-destructive"
                  onPointerDown={() => setConfirmDeleteOpen(true)}
                >
                  <Trash className="size-4 sm:size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('tooltips.delete')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {deleteDialog}
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className="flex items-center justify-center gap-1"
        id="quick-action-buttons"
        data-testid="quick-action-buttons"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="delete-solve-button"
              variant="ghost"
              size="sm"
              className="gap-1.5 h-12 min-w-12 sm:h-8 sm:min-w-0 text-muted-foreground hover:text-destructive"
              onPointerDown={() => setConfirmDeleteOpen(true)}
            >
              <Trash className="size-5 sm:size-3.5" />
              <span className="hidden sm:inline text-xs">{t('tooltips.delete')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>{t('tooltips.delete')}</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-border mx-0.5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="plus-two-button"
              variant="ghost"
              size="sm"
              className={cn(
                'gap-1.5 h-12 min-w-12 sm:h-8 sm:min-w-0 text-base sm:text-xs font-medium',
                solve?.plus2 ? 'text-destructive hover:text-destructive' : 'text-muted-foreground'
              )}
              onPointerDown={handleTogglePlus2}
            >
              <span className="sm:hidden">+2</span>
              <span className="hidden sm:inline">{t('tooltips.plus-two')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>{t('tooltips.plus-two')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="dnf-button"
              variant="ghost"
              size="sm"
              className={cn(
                'gap-1.5 h-12 min-w-12 sm:h-8 sm:min-w-0 text-base sm:text-xs font-medium',
                solve?.dnf ? 'text-destructive hover:text-destructive' : 'text-muted-foreground'
              )}
              onPointerDown={handleToggleDNF}
            >
              <span>DNF</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tooltips.dnf')}</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-border mx-0.5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="bookmark-button"
              variant="ghost"
              size="sm"
              className={cn(
                'gap-1.5 h-12 min-w-12 sm:h-8 sm:min-w-0',
                solve?.bookmark ? 'text-yellow-400 hover:text-yellow-400' : 'text-muted-foreground'
              )}
              onPointerDown={handleToggleBookmark}
            >
              <Bookmark className="size-5 sm:size-3.5" fill={solve?.bookmark ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline text-xs">{t('tooltips.bookmark')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p>{t('tooltips.bookmark')}</p>
          </TooltipContent>
        </Tooltip>

        {showDropdown && (
          <>
            <div className="w-px h-4 bg-border mx-0.5" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 min-w-12 sm:h-8 sm:min-w-0 text-muted-foreground"
                  aria-label={t('tooltips.more-actions')}
                  data-testid="more-actions-button"
                >
                  <MoreHorizontal className="size-5 sm:size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!hideCopyButton && (
                  <DropdownMenuItem
                    data-testid="copy-solve-button"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleClipboard()
                    }}
                  >
                    <CopyIcon className="mr-2" /> {t('tooltips.copy')}
                  </DropdownMenuItem>
                )}
                {!hideMoveToHistory && (
                  <DropdownMenuItem
                    data-testid="move-to-history-button"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleMoveToHistorial()
                    }}
                  >
                    <CubeIcon className="mr-2" />{' '}
                    {t(
                      tabMode === SolveTab.SESSION ? 'solve-details.move-to-history' : 'solve-details.move-to-session'
                    )}
                  </DropdownMenuItem>
                )}
                {tabMode === SolveTab.SESSION && !hideTransferCollection && (
                  <DropdownMenuItem
                    data-testid="transfer-collection-button"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleTransferCollection()
                    }}
                  >
                    <ArrowRightLeftIcon size={12} className="mr-2" /> {t('solve-details.transfer-collection')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('solve-details.delete-confirm-title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('solve-details.delete-confirm-desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Inputs.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>{t('tooltips.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
