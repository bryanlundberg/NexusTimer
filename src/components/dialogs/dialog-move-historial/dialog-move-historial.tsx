import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAllCubes, getCubeById } from "@/db/dbOperations";
import finishSession from "@/lib/finishSession";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { useTimerStore } from "@/store/timerStore";
import { toast } from "sonner";

export default function DialogMoveHistorial({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { selectedCube, cubes, setCubes, setSelectedCube, setTimerStatistics } =
    useTimerStore();
  const { tab } = useSolveFiltersStore();

  const handleMoveSessionToHistorial = async () => {
    if (selectedCube) {
      await finishSession({ selectedCube, cubesDB: cubes });
      const cubesDB = await getAllCubes();
      setCubes(cubesDB);
      const currentCube = await getCubeById(selectedCube.id);
      setSelectedCube(currentCube);
      setTimerStatistics();
      handleClose();
      return;
    }

    toast("Unable action", {
      description: "Please select a cube before.",
    });
  };

  return (
    <>
      <DialogContent className="max-w-96 rounded-md">
        <DialogHeader>
          <DialogTitle>Move solves to history?</DialogTitle>
          <DialogDescription>
            You will be able to access them by tapping the history switch.
          </DialogDescription>
          <DialogFooter>
            <div className="flex gap-1 mt-5">
              <Button variant={"ghost"} onClick={handleClose}>
                Cancel
              </Button>
              <Button variant={"ghost"} onClick={handleMoveSessionToHistorial}>
                Move
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </>
  );
}
