import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Solve } from '@/interfaces/Solve';
import { useDialogSolve } from '@/store/DialogSolve';
import { useTimerStore } from '@/store/timerStore';
import { useSolveActions } from '@/hooks/useSolveActions';
import { CopyIcon, CubeIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ArrowRightLeftIcon, Bookmark, MoreHorizontal, Trash } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { STATES } from '@/constants/states';
import { DisplaySolvesTabs } from '@/enums/DisplaySolvesTabs';
import { IconButton } from '@/components/ui/shadcn-io/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function MenuSolveOptions({
  solve,
  onDeleteSolve = () => {
  },
  caseOfUse,
  hideCopyButton = false,
  hideMoveToHistory = false,
  hideTransferCollection = false
}: {
  solve: Solve | null;
  onDeleteSolve?: () => void;
  caseOfUse: 'last-solve' | 'modal-solve';
  hideCopyButton?: boolean;
  hideMoveToHistory?: boolean;
  hideTransferCollection?: boolean;
}) {
  const t = useTranslations('Index');
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const lastSolve = useTimerStore((state) => state.lastSolve);
  const dialog = useDialogSolve();
  const {
    handleDeleteSolve,
    handlePenaltyPlus2,
    handleDNF,
    handleBookmarkSolve,
    handleClipboardSolve,
    handleMoveToHistory
  } = useSolveActions();
  const router = useRouter();
  const [tabMode,] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, { defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE });

  if (!selectedCube) return null;

  const localHandleDeleteSolve = () => {
    if (solve) handleDeleteSolve(solve, caseOfUse, onDeleteSolve);
  };

  const localHandlePenaltyPlus2 = () => {
    if (solve) handlePenaltyPlus2(solve, caseOfUse);
  };

  const localHandleDNF = () => {
    if (solve) handleDNF(solve, caseOfUse);
  };

  const localHandleBookmarkSolve = () => {
    if (solve) handleBookmarkSolve(solve, caseOfUse);
  };

  const localHandleClipboardSolve = () => {
    if (solve) {
      handleClipboardSolve(solve, {
        title: t('SolvesPage.toast.success-copy'),
        description: t('SolvesPage.toast.success-copy-description')
      });
    }
  };

  const localHandleMoveToHistory = () => {
    if (solve) handleMoveToHistory(solve, caseOfUse);
  };

  const handleMoveCollection = () => {
    router.push(`/transfer-solves?source-collection=${selectedCube.id}`)
  }

  return (
    <>
      {/* options */}
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        id="quick-action-buttons"
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={'ghost'} onPointerDown={localHandleDeleteSolve}>
                <Trash/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tooltips.delete')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {caseOfUse === 'last-solve' ? (
                <Button
                  variant={'ghost'}
                  className={`font-light text-md ${lastSolve?.plus2 ? 'text-red-600 font-bold hover:text-red-600' : ''}`}
                  onPointerDown={localHandlePenaltyPlus2}
                >
                  +2
                </Button>
              ) : (
                <Button
                  variant={'ghost'}
                  className={`font-light text-md ${dialog.solve?.plus2 ? 'text-red-600 font-bold hover:text-red-600' : ''}`}
                  onPointerDown={localHandlePenaltyPlus2}
                >
                  +2
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tooltips.plus-two')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {caseOfUse === 'last-solve' ? (
                <Button
                  variant={'ghost'}
                  className={`font-light text-md ${lastSolve?.dnf ? 'text-red-600 font-bold hover:text-red-600' : ''}`}
                  onPointerDown={localHandleDNF}
                >
                  DNF
                </Button>
              ) : (
                <Button
                  variant={'ghost'}
                  className={`font-light text-md ${dialog.solve?.dnf ? 'text-red-600 font-bold hover:text-red-600' : ''}`}
                  onPointerDown={localHandleDNF}
                >
                  DNF
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Did Not Finish</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {caseOfUse === 'last-solve' ? (
                <IconButton
                  icon={Bookmark}
                  active={lastSolve?.bookmark}
                  aria-label="Bookmark"
                  onPointerDown={localHandleBookmarkSolve}
                  color={[251, 191, 36]}
                />
              ) : (
                <IconButton
                  icon={Bookmark}
                  active={dialog.solve?.bookmark}
                  aria-label="Bookmark"
                  onPointerDown={localHandleBookmarkSolve}
                  color={[251, 191, 36]}
                />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tooltips.bookmark')}</p>
            </TooltipContent>
          </Tooltip>
          {(!hideCopyButton || !hideMoveToHistory || (tabMode === DisplaySolvesTabs.SESSION && !hideTransferCollection)) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} aria-label="More actions">
                  <MoreHorizontal/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!hideCopyButton && (
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      localHandleClipboardSolve();
                    }}
                  >
                    <CopyIcon className="mr-2"/> {t('tooltips.copy')}
                  </DropdownMenuItem>
                )}
                {!hideMoveToHistory && (
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      localHandleMoveToHistory();
                    }}
                  >
                    <CubeIcon className="mr-2"/> Move to History
                  </DropdownMenuItem>
                )}
                {tabMode === DisplaySolvesTabs.SESSION && !hideTransferCollection && (
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleMoveCollection();
                    }}
                  >
                    <ArrowRightLeftIcon size={12} className="mr-2"/> Transfer Collection
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </TooltipProvider>
      </div>
    </>
  );
}
