import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CopyIcon, CubeIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import { ArrowRightLeftIcon, Bookmark, MoreHorizontal, Trash } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { IconButton } from '@/components/ui/shadcn-io/icon-button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useQuickActions from '@/features/manage-solves/model/useQuickActions'
import { Solve } from '@/entities/solve/model/types'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'

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

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2" id="quick-action-buttons">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                onPointerDown={() => {
                  handleDeleteSolve(tabMode === SolveTab.SESSION ? SolveTab.SESSION : SolveTab.ALL)
                  onDeleteSolve()
                }}
              >
                <Trash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tooltips.delete')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                className={`font-light text-md ${solve?.plus2 ? 'text-red-600 font-bold hover:text-red-600' : ''}`}
                onPointerDown={() => handleTogglePlus2(tabMode === SolveTab.SESSION ? SolveTab.SESSION : SolveTab.ALL)}
              >
                +2
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tooltips.plus-two')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                className={`font-light text-md ${solve?.dnf ? 'text-red-600 font-bold hover:text-red-600' : ''}`}
                onPointerDown={() => handleToggleDNF(tabMode === SolveTab.SESSION ? SolveTab.SESSION : SolveTab.ALL)}
              >
                DNF
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Did Not Finish</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                icon={Bookmark}
                active={solve?.bookmark}
                aria-label="Bookmark"
                onPointerDown={() =>
                  handleToggleBookmark(tabMode === SolveTab.SESSION ? SolveTab.SESSION : SolveTab.ALL)
                }
                color={[251, 191, 36]}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tooltips.bookmark')}</p>
            </TooltipContent>
          </Tooltip>
          {(!hideCopyButton || !hideMoveToHistory || (tabMode === SolveTab.SESSION && !hideTransferCollection)) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} aria-label="More actions">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!hideCopyButton && (
                  <DropdownMenuItem
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
                    onSelect={(e) => {
                      e.preventDefault()
                      handleMoveToHistorial()
                    }}
                  >
                    <CubeIcon className="mr-2" /> Move to History
                  </DropdownMenuItem>
                )}
                {tabMode === SolveTab.SESSION && !hideTransferCollection && (
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      handleTransferCollection()
                    }}
                  >
                    <ArrowRightLeftIcon size={12} className="mr-2" /> Transfer Collection
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TooltipProvider>
      </div>
    </>
  )
}
