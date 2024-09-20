import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCubes, saveCube } from "@/db/dbOperations";
import { cubeCollection } from "@/lib/const/cubeCollection";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function DialogEditCollection() {
  const t = useTranslations("Index");
  const { cube, closeDialog } = useDialogCubesOptions();
  const { cubes, setCubes, selectedCube, setSelectedCube, setTimerStatistics } =
    useTimerStore();
  const { settings, setSettings } = useSettingsModalStore();
  const [form, setForm] = useState({
    name: cube?.name || "",
    category: cube?.category || "2x2",
  });
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const handleSubmitEditCubeCollection = async () => {
    try {
      // verify if its repeated the name
      if (cubes?.some((e) => e.name === form.name)) {
        setError((prev) => ({
          ...prev,
          status: true,
          message: t("Errors.repeated-name"),
        }));
        return;
      }

      // update cube info that its linked to settings "preferences" the default start cube
      if (cube && cube.id === settings.preferences.defaultCube.cube?.id) {
        const newSettings = {
          ...settings,
          preferences: {
            ...settings.preferences,
            defaultCube: {
              ...settings.preferences.defaultCube,
              cube: {
                ...settings.preferences.defaultCube.cube,
                name: form.name,
                category: form.category,
              },
            },
          },
        };
        setSettings(newSettings);
        window.localStorage.setItem("settings", JSON.stringify(newSettings));
      }

      await saveCube({
        ...cube,
        name: form.name.trim(),
        category: form.category,
      });

      const cubesDB = await getAllCubes();
      setCubes(cubesDB);

      if (cube && cube.id === selectedCube?.id) {
        setSelectedCube(null);
        setTimerStatistics();
      }

      // update states
      closeDialog();
    } catch (err) {
      console.log(err);
    }
  };

  // helps to refresh input (name) when re-open the dialog
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      category: cube?.category || "2x2",
      name: cube?.name || "",
    }));
  }, [cube]);

  return (
    <>
      <DialogContent
        className="sm:max-w-[425px]"
        data-testId="drawer-edit-collection-container"
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
          defaultValue={cube?.name}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, name: e.target.value }));
          }}
          data-testId="drawer-edit-input-name"
        />

        {error && error.status && (
          <p
            className="text-destructive text-sm"
            data-testId="drawer-edit-collection-error-message"
          >
            {error.message}
          </p>
        )}

        <Label>{t("Cubes-modal.category")}</Label>
        <Select
          defaultValue={form.category}
          onValueChange={(e) =>
            setForm((prev) => ({ ...prev, category: e as any }))
          }
        >
          <SelectTrigger data-testId="drawer-edit-select-category">
            <SelectValue placeholder={t("Cubes-modal.select-an-option")} />
          </SelectTrigger>
          <SelectContent>
            {cubeCollection.map((cube) => {
              return (
                <SelectItem key={cube.id} value={cube.name}>
                  {cube.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button
                variant={"outline"}
                data-testId="drawer-edit-cancel-button"
              >
                {t("Inputs.cancel")}
              </Button>
            </DialogClose>

            <Button
              variant={"default"}
              onClick={handleSubmitEditCubeCollection}
              data-testId="drawer-edit-accept-button"
            >
              {t("Inputs.continue")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
