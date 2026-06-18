import { Button } from '@/components/ui/button'
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
  onDeleteSolve?: () => void
}

export default function QuickActions({
  solve,
  hideCopyButton = false,
  hideMoveToHistory = false,
  hideTransferCollection = false,
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

  const showDropdown =
    !hideCopyButton || !hideMoveToHistory || (tabMode === SolveTab.SESSION && !hideTransferCollection)

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
              onPointerDown={() => {
                handleDeleteSolve()
                onDeleteSolve()
              }}
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
                    <CubeIcon className="mr-2" /> {t('solve-details.move-to-history')}
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
    </TooltipProvider>
  )
}
