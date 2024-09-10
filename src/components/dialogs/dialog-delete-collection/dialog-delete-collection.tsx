import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteCubeById, getAllCubes } from "@/db/dbOperations";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function DialogDeleteCollection() {
  const t = useTranslations("Index");
  const { setCubes } = useTimerStore();
  const { cube, closeDialog } = useDialogCubesOptions();
  const [cubeName, setCubeName] = useState("");
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const handleDeleteCube = async () => {
    try {
      if (cubeName.trim() !== cube?.name) {
        setError((prev) => ({
          ...prev,
          status: true,
          message: t("Errors.not-match"),
        }));
        return;
      }

      await deleteCubeById(cube.id);
      const cubes = await getAllCubes();
      setCubes(cubes);
      closeDialog();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Cubes-modal.delete-collection")}</DialogTitle>
          <DialogDescription>
            {t("Cubes-modal.delete-collection-description")}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-red-200/20 text-red-500">
          <AlertDescription className="font-semibold">
            <span className="font-black">{t("Cubes-modal.warning-alert")}</span>{" "}
            {t("Cubes-modal.warning-msg")}
          </AlertDescription>
        </Alert>

        <Label className="text-secondary-foreground/50">
          {t("Cubes-modal.input-collection-name")}{" "}
          <span className="text-secondary-foreground">{cube?.name}</span>{" "}
          {t("Cubes-modal.to-continue")}
        </Label>
        <Input
          onChange={(e) => {
            setError((prev) => ({ ...prev, status: false, message: "" }));
            setCubeName(e.target.value);
          }}
        />

        {error && error.status && (
          <p className="text-destructive text-sm">{error.message}</p>
        )}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant={"outline"}>{t("Inputs.cancel")}</Button>
            </DialogClose>

            <Button variant={"default"} onClick={handleDeleteCube}>
              {t("Inputs.continue")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
