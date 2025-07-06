import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Solve } from "@/interfaces/Solve";
import { useDialogSolve } from "@/store/DialogSolve";
import { useTimerStore } from "@/store/timerStore";
import { useSolveActions } from "@/hooks/useSolveActions";
import { BookmarkFilledIcon, BookmarkIcon, CopyIcon, Cross1Icon, CubeIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRightLeftIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { STATES } from "@/constants/states";
import { DisplaySolvesTabs } from "@/enums/DisplaySolvesTabs";

export default function MenuSolveOptions({
  solve,
  onDeleteSolve = () => {
  },
  caseOfUse
}: {
  solve: Solve | null;
  onDeleteSolve?: () => void;
  caseOfUse: "last-solve" | "modal-solve";
}) {
  const t = useTranslations("Index");
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const lastSolve = useTimerStore((state) => state.lastSolve);
  const dialog = useDialogSolve();
  const { handleDeleteSolve, handlePenaltyPlus2, handleDNF, handleBookmarkSolve, handleClipboardSolve, handleMoveToHistory } = useSolveActions();
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
        title: t("SolvesPage.toast.success-copy"),
        description: t("SolvesPage.toast.success-copy-description")
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
        className="flex flex-wrap items-center justify-center py-5 gap-2"
        id="quick-action-buttons"
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} onPointerDown={localHandleDeleteSolve}>
                <Cross1Icon/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.delete")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {caseOfUse === "last-solve" ? (
                <Button
                  variant={"ghost"}
                  className={`font-light text-md ${lastSolve?.plus2 ? "text-red-600 font-bold hover:text-red-600" : ""}`}
                  onPointerDown={localHandlePenaltyPlus2}
                >
                  +2
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  className={`font-light text-md ${dialog.solve?.plus2 ? "text-red-600 font-bold hover:text-red-600" : ""}`}
                  onPointerDown={localHandlePenaltyPlus2}
                >
                  +2
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.plus-two")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {caseOfUse === "last-solve" ? (
                <Button
                  variant={"ghost"}
                  className={`font-light text-md ${lastSolve?.dnf ? "text-red-600 font-bold hover:text-red-600" : ""}`}
                  onPointerDown={localHandleDNF}
                >
                  DNF
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  className={`font-light text-md ${dialog.solve?.dnf ? "text-red-600 font-bold hover:text-red-600" : ""}`}
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
              {caseOfUse === "last-solve" ? (
                <Button variant={"ghost"} onPointerDown={localHandleBookmarkSolve}>
                  {!lastSolve?.bookmark ? (
                    <BookmarkIcon/>
                  ) : (
                    <BookmarkFilledIcon/>
                  )}
                </Button>
              ) : (
                <Button variant={"ghost"} onPointerDown={localHandleBookmarkSolve}>
                  {!dialog.solve?.bookmark ? (
                    <BookmarkIcon/>
                  ) : (
                    <BookmarkFilledIcon/>
                  )}
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.bookmark")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} onPointerDown={localHandleClipboardSolve}>
                <CopyIcon/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.copy")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} onPointerDown={localHandleMoveToHistory}>
                <CubeIcon/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Move to History</p>
            </TooltipContent>
          </Tooltip>
          {tabMode === DisplaySolvesTabs.SESSION && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} onPointerDown={handleMoveCollection}>
                  <ArrowRightLeftIcon size={12}/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transfer Collection</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </>
  );
}
