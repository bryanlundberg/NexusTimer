import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllCubes, getCubeById } from "@/db/dbOperations";
import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import updateSolve from "@/lib/updateSolve";
import { useDialogSolve } from "@/store/DialogSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  CopyIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function MenuSolveOptions({
  solve,
  onDeleteSolve = () => {},
  caseOfUse,
}: {
  solve: Solve | null;
  onDeleteSolve?: () => void;
  caseOfUse: "last-solve" | "modal-solve";
}) {
  const t = useTranslations("Index");
  const { selectedCube, setCubes, setSelectedCube, lastSolve, setLastSolve } =
    useTimerStore();
  const dialog = useDialogSolve();

  if (!selectedCube) return null;

  const handleDeleteSolve = async () => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "DELETE",
      });

      if (caseOfUse === "last-solve") {
        if (lastSolve?.id === dialog.solve?.id) {
          dialog.handleSetSolveInDialog({ solve: null });
        }
        setLastSolve(null);
      }

      if (caseOfUse === "modal-solve") {
        if (lastSolve?.id === dialog.solve?.id) {
          setLastSolve(null);
        }
        dialog.handleSetSolveInDialog({ solve: null });
      }

      const lastCubes = await getAllCubes();
      setCubes([...lastCubes]);

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      toast("", {
        description: "Deleted solve",
        duration: 1000,
      });

      onDeleteSolve();
    }
  };

  const handlePenaltyPlus2 = async () => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "+2",
      });
      const lastCubes = await getAllCubes();
      setCubes([...lastCubes]);

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      if (lastCube) {
        const solvesGlobal = [
          ...lastCube.solves.session,
          ...lastCube.solves.all,
        ];

        const updatedSolve = solvesGlobal.find((i) => i.id === solve.id);

        if (updatedSolve && lastSolve && updatedSolve.id === lastSolve.id) {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
          setLastSolve({ ...updatedSolve });
        } else if (updatedSolve && caseOfUse === "modal-solve") {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
        } else if (updatedSolve && caseOfUse === "last-solve") {
          setLastSolve({ ...updatedSolve });
        }
      }

      toast("", {
        description: "Penalty status updated.",
        duration: 1000,
      });
    }
  };

  const handleBookmarkSolve = async () => {
    if (solve && selectedCube) {
      await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "BOOKMARK",
      });

      const lastCubes = await getAllCubes();
      setCubes([...lastCubes]);

      const lastCube = await getCubeById(selectedCube.id);
      if (lastCube) {
        setSelectedCube({ ...lastCube });
      }

      if (lastCube) {
        const solvesGlobal = [
          ...lastCube.solves.session,
          ...lastCube.solves.all,
        ];

        const updatedSolve = solvesGlobal.find((i) => i.id === solve.id);

        if (updatedSolve && lastSolve && updatedSolve.id === lastSolve.id) {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
          setLastSolve({ ...updatedSolve });
        } else if (updatedSolve && caseOfUse === "modal-solve") {
          dialog.handleSetSolveInDialog({ solve: { ...updatedSolve } });
        } else if (updatedSolve && caseOfUse === "last-solve") {
          setLastSolve({ ...updatedSolve });
        }
      }

      toast("", {
        description: "Bookmark status updated.",
        duration: 500,
      });
    }
  };

  const handleClipboardSolve = () => {
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(
        `${formatTime(solve?.time || 0)} - ${solve?.scramble}`
      );
    }

    toast(t("SolvesPage.toast.success-copy"), {
      description: t("SolvesPage.toast.success-copy-description"),
      duration: 1000,
    });
  };

  return (
    <>
      {/* options */}
      <div
        className="flex items-center justify-center py-5 gap-2"
        id="quick-action-buttons"
      >
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                onClick={handleDeleteSolve}
                onTouchEnd={handleDeleteSolve}
              >
                <Cross1Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.delete")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                className="font-light text-md"
                onClick={handlePenaltyPlus2}
                onTouchEnd={handlePenaltyPlus2}
              >
                +2
              </Button>
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
                  onClick={handleBookmarkSolve}
                  onTouchEnd={handleBookmarkSolve}
                >
                  {!lastSolve?.bookmark ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkFilledIcon />
                  )}
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  onClick={handleBookmarkSolve}
                  onTouchEnd={handleBookmarkSolve}
                >
                  {!dialog.solve?.bookmark ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkFilledIcon />
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
              <Button
                variant={"ghost"}
                onClick={handleClipboardSolve}
                onTouchEnd={handleClipboardSolve}
              >
                <CopyIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.copy")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
