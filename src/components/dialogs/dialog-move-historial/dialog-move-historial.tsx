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
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DialogMoveHistorial({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const t = useTranslations("Index");
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const cubes = useTimerStore((state) => state.cubes);
  const setCubes = useTimerStore((state) => state.setCubes);
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube);

  const handleMoveSessionToHistorial = async () => {
    if (selectedCube) {
      await finishSession({ selectedCube, cubesDB: cubes });
      const cubesDB = await getAllCubes();
      setCubes(cubesDB);
      const currentCube = await getCubeById(selectedCube.id);
      setSelectedCube(currentCube);
      handleClose();
      return;
    }

    toast(t("SolvesPage.toast.unable-action"), {
      description: t("SolvesPage.toast.warning-select-cube"),
    });
  };

  return (
    <>
      <DialogContent className="max-w-96 rounded-md">
        <DialogHeader>
          <DialogTitle>{t("SolvesPage.dialogs.move-to-history")}</DialogTitle>
          <DialogDescription>
            {t("SolvesPage.dialogs.move-to-history-para")}
          </DialogDescription>
          <DialogFooter>
            <div className="flex justify-end gap-1 mt-5">
              <Button variant={"ghost"} onClick={handleClose}>
                {t("Inputs.cancel")}
              </Button>
              <Button variant={"ghost"} onClick={handleMoveSessionToHistorial}>
                {t("Inputs.move")}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </>
  );
}
