import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Solve } from "@/interfaces/Solve";
import formatTime from "@/lib/formatTime";
import updateSolve from "@/lib/updateSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  CopyIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function MenuSolveOptions({ solve }: { solve: Solve | null }) {
  const t = useTranslations("Index");
  const { selectedCube, cubes, mergeUpdateSelectedCube } = useTimerStore();
  if (!solve && !selectedCube) return null;

  const handleDeleteSolve = async () => {
    if (solve && selectedCube) {
      const updatedCube = await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "DELETE",
      });
      mergeUpdateSelectedCube(updatedCube, cubes);
    }
  };

  const handlePenaltyPlus2 = async () => {
    if (solve && selectedCube) {
      const updatedCube = await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "+2",
      });
      mergeUpdateSelectedCube(updatedCube, cubes);
    }
  };

  const handleBookmarkSolve = async () => {
    if (solve && selectedCube) {
      const updatedCube = await updateSolve({
        solveId: solve.id,
        selectedCube: selectedCube,
        type: "BOOKMARK",
      });
      mergeUpdateSelectedCube(updatedCube, cubes);
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
      <div className="flex items-center justify-center pt-5 gap-2">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} onClick={handleDeleteSolve}>
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
              <Button variant={"ghost"} onClick={handleBookmarkSolve}>
                {!solve?.bookmark ? <BookmarkIcon /> : <BookmarkFilledIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.bookmark")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} onClick={handleClipboardSolve}>
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
