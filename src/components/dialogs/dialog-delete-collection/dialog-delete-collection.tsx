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
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useNXData } from '@/hooks/useNXData';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function DialogDeleteCollection() {
  const { getAllCubes, deleteCubeById } = useNXData();
  const t = useTranslations("Index");
  const setCubes = useTimerStore((state) => state.setCubes);
  const { cube, closeDialog } = useDialogCubesOptions();
  const { handleSubmit, register, formState: { errors }, reset, setError } = useForm({
    defaultValues: {
      cubeName: cube?.name || "",
    },
  })

  const handleDeleteCube = async (form: { cubeName: string }) => {
    if (!cube?.id) return;

    try {
      if (form.cubeName.trim() !== cube?.name) {
        setError("cubeName", {
          type: "manual",
          message: "Collection name does not match.",
        });
        return;
      }

      await deleteCubeById(cube.id);
      const cubes = await getAllCubes();
      setCubes(cubes);
      closeDialog();
      toast.success('Collection deleted successfully')
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete collection');
    }
  };

  useEffect(() => {
    if (!cube?.id) {
      closeDialog();
      return;
    }

    reset({
      cubeName: cube?.name,
    });
  }, [closeDialog, cube, reset]);

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
          {...register("cubeName", {
            required: true,
            validate: (value) => value.trim() !== "",
          })}
          data-testid="dialog-delete-cube-input"
        />

        {errors && errors.cubeName && (
          <p
            className="text-destructive text-sm"
            data-testid="dialog-delete-cube-error-message"
          >
            {errors.cubeName.message}
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
              onClick={handleSubmit(handleDeleteCube)}
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
