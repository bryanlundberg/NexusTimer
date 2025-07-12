"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cubeCollection } from "@/lib/const/cubeCollection";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useNXData } from '@/hooks/useNXData';
import { useForm, Controller } from 'react-hook-form';
import { Categories } from '@/interfaces/Categories';
import { toast } from 'sonner';

export default function DialogEditCollection() {
  const { getAllCubes, saveCube } = useNXData();
  const t = useTranslations("Index");
  const cube = useDialogCubesOptions((state) => state.cube);
  const closeDialog = useDialogCubesOptions((state) => state.closeDialog);
  const cubes = useTimerStore((state) => state.cubes);
  const setCubes = useTimerStore((state) => state.setCubes);
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube);
  const { register, handleSubmit, formState : { errors }, reset, setError, control } = useForm({
    defaultValues: {
      name: cube?.name || "",
      category: cube?.category || "2x2"
    }
  })

  const handleSubmitEditCubeCollection = async (form: { name: string, category: string }) => {
    try {
      if (cube?.name !== form.name && cubes?.some((e) => e.name === form.name)) {
        setError("name", {
          type: "manual",
          message: t("Cubes-modal.name-repeated")
        })
        return;
      }

      await saveCube({
        ...cube,
        name: form.name.trim(),
        category: form.category as Categories
      });

      const cubesDB = await getAllCubes();
      setCubes(cubesDB);

      if (cube?.id === selectedCube?.id) {
        setSelectedCube(null);
      }

      closeDialog();
      toast.success("Cube edited successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to edit cube");
    }
  };

  useEffect(() => {
    if (!cube?.id) {
      closeDialog();
      return;
    }

    reset({
      name: cube.name,
      category: cube.category || "2x2"
    });
  }, [closeDialog, cube, reset]);

  return (
    <>
      <DialogContent
        className="sm:max-w-[425px]"
        data-testid="drawer-edit-collection-container"
      >
        <DialogHeader>
          <DialogTitle>{t("Cubes-modal.edit-collection")}</DialogTitle>
        </DialogHeader>

        <Alert className="bg-yellow-200/20 text-amber-700">
          <AlertDescription className="font-semibold">
            {t("Cubes-modal.danger-msg")}
          </AlertDescription>
        </Alert>

        <Label>{t("Cubes-modal.name")}</Label>
        <Input
          {...register("name", {
            required: "Required field",
            minLength: {
              value: 2,
              message: "Min length is 2 characters"
            },
            maxLength: {
              value: 50,
              message: "Max length is 50 characters"
            }
          })}
          data-testid="drawer-edit-input-name"
        />

        {errors?.name && (
          <p
            className="text-destructive text-sm"
            data-testid="drawer-edit-collection-error-message"
          >
            {errors.name.message}
          </p>
        )}

        <Label>{t("Cubes-modal.category")}</Label>
        <Controller
          name="category"
          control={control}
          rules={{ required: 'Required field' }}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className={'w-full'} data-testid="drawer-edit-select-category">
                <SelectValue placeholder={t('Cubes-modal.select-an-option')}/>
              </SelectTrigger>
              <SelectContent>
                {cubeCollection.map((cube) => (
                  <SelectItem key={cube.id} value={cube.name}>
                    {cube.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button
                variant={"outline"}
                data-testid="drawer-edit-cancel-button"
              >
                {t("Inputs.cancel")}
              </Button>
            </DialogClose>

            <Button
              variant={"default"}
              onClick={handleSubmit(handleSubmitEditCubeCollection)}
              data-testid="drawer-edit-accept-button"
            >
              {t("Inputs.continue")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
