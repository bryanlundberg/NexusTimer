import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Solve } from "@/interfaces/Solve";
import updateSolve from "@/lib/updateSolve";
import { useTimerStore } from "@/store/timerStore";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  CopyIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";

export default function MenuSolveOptions({ solve }: { solve: Solve | null }) {
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

  const handleClipboardSolve = () => {};

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
              <p>Delete</p>
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
              <p>+2 Penalty</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} onClick={handleBookmarkSolve}>
                {!solve?.bookmark ? <BookmarkIcon /> : <BookmarkFilledIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bookmark</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"}>
                <CopyIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
