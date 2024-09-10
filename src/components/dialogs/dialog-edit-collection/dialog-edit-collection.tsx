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
import { useEffect, useState } from "react";

export default function DialogEditCollection() {
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
          message: "That name already exist.",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit collection</DialogTitle>
        </DialogHeader>

        <Alert className="bg-yellow-200/20 text-amber-700">
          <AlertDescription className="font-semibold">
            <span className="font-black">Warning:</span> Modify the collection
            category, changes the solves from their category too.
          </AlertDescription>
        </Alert>

        <Label>Name</Label>
        <Input
          defaultValue={cube?.name}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, name: e.target.value }));
          }}
        />

        {error && error.status && (
          <p className="text-destructive text-sm">{error.message}</p>
        )}

        <Label>Category</Label>
        <Select
          defaultValue={form.category}
          onValueChange={(e) =>
            setForm((prev) => ({ ...prev, category: e as any }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
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
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>

            <Button
              variant={"default"}
              onClick={handleSubmitEditCubeCollection}
            >
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
