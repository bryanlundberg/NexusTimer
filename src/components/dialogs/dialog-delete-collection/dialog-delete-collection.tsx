"use client";
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

export default function DialogDeleteCollection({
  error,
  handleChangeError,
}: {
  error: { message: string; status: boolean };
  handleChangeError: ({
    message,
    status,
  }: {
    message: string;
    status: boolean;
  }) => void;
}) {
  const t = useTranslations("Index");
  const setCubes = useTimerStore((state) => state.setCubes);
  const { cube, closeDialog } = useDialogCubesOptions();
  const [cubeName, setCubeName] = useState("");

  const handleDeleteCube = async () => {
    try {
      if (cubeName.trim() !== cube?.name) {
        handleChangeError({
          status: true,
          message: t("Errors.not-match"),
        });
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
      <DialogContent
        className="sm:max-w-[425px]"
        data-testid="dialog-delete-cube-container"
      >
        <DialogHeader>
          <DialogTitle data-testid="dialog-delete-cube-title">
            {t("Cubes-modal.delete-collection")}
          </DialogTitle>
          <DialogDescription data-testid="dialog-delete-cube-description">
            {t("Cubes-modal.delete-collection-description")}
          </DialogDescription>
        </DialogHeader>

        <Alert
          className="bg-red-200/20 text-red-500"
          data-testid="dialog-delete-cube-warning"
        >
          <AlertDescription className="font-semibold">
            <span className="font-black">{t("Cubes-modal.warning-alert")}</span>{" "}
            {t("Cubes-modal.warning-msg")}
          </AlertDescription>
        </Alert>

        <Label className="text-secondary-foreground/50 flex flex-wrap">
          <span>{t("Cubes-modal.input-collection-name")}{" "}</span>
          <span className="text-secondary-foreground">{cube?.name}</span>{" "}
          <span>{t("Cubes-modal.to-continue")}</span>
        </Label>
        <Input
          onChange={(e) => {
            handleChangeError({ status: false, message: "" });
            setCubeName(e.target.value);
          }}
          data-testid="dialog-delete-cube-input"
        />

        {error && error.status && (
          <p
            className="text-destructive text-sm"
            data-testid="dialog-delete-cube-error-message"
          >
            {error.message}
          </p>
        )}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button
                variant={"outline"}
                data-testid="dialog-delete-cube-cancel-button"
              >
                {t("Inputs.cancel")}
              </Button>
            </DialogClose>

            <Button
              variant={"default"}
              onClick={handleDeleteCube}
              data-testid="dialog-delete-cube-accept-button"
            >
              {t("Inputs.continue")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
