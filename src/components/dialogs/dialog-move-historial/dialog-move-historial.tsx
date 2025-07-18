import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useNXData } from '@/hooks/useNXData';

export default function DialogMoveHistorial({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { getAllCubes, getCubeById, finishSession } = useNXData();
  const t = useTranslations("Index");
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const setCubes = useTimerStore((state) => state.setCubes);
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube);

  const handleMoveSessionToHistorial = async () => {
    if (selectedCube) {
      await finishSession(selectedCube);
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
