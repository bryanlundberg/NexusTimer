import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllCubes, saveCube } from "@/db/dbOperations";
import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/const/cubeCollection";
import genId from "@/lib/genId";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface FormProps {
  category: Categories;
  name: string;
}

export default function DrawerCreateCollection({
  closeDrawer,
}: {
  closeDrawer: () => void;
}) {
  const t = useTranslations("Index");
  const [newCollection, setNewCollection] = useState<FormProps>({
    category: "2x2",
    name: "",
  });
  const { setCubes, cubes } = useTimerStore();
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const handleSubmitNewCollection = async () => {
    try {
      if (newCollection.name.trim() === "") {
        setError((prev) => ({
          ...prev,
          error: true,
          message: t("Errors.empty-input"),
        }));
        return;
      }

      if (
        cubes &&
        cubes.some((cube) => cube.name === newCollection.name.trim())
      ) {
        setError((prev) => ({
          ...prev,
          error: true,
          message: t("Errors.repeated-name"),
        }));
        return;
      }

      await saveCube({
        name: newCollection.name,
        category: newCollection.category,
      });
      const cubesDB = await getAllCubes();
      setCubes(cubesDB);
      closeDrawer();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DrawerContent
      className="max-w-[850px] mx-auto"
      data-testId="drawer-create-collection"
    >
      <DrawerHeader>
        <DrawerTitle>{t("Cubes-modal.new-collection")}</DrawerTitle>
        <DrawerDescription>
          {t("Cubes-modal.new-collection-description")}
        </DrawerDescription>
      </DrawerHeader>

      <div className="p-3">
        <Label htmlFor="name">{t("Cubes-modal.name")}</Label>
        <Input
          data-testId="drawer-input-name"
          id="name"
          placeholder="E.g: X Man Tornado V3 M"
          onChange={(e) => {
            setNewCollection((prev) => ({ ...prev, name: e.target.value }));
            setError((prev) => ({ ...prev, error: false, message: "" }));
          }}
        />

        {error && <p className="text-destructive mt-1">{error.message}</p>}

        <div className="mt-3"></div>
        <Label>{t("Cubes-modal.category")}</Label>
        <div className="grid md:grid-cols-6 grid-cols-4 gap-5 place-items-center mt-3">
          {cubeCollection.map((e) => {
            return (
              <Image
                data-testId={"checkbox-category-" + e.name}
                key={genId()}
                src={e.src}
                alt={e.event || ""}
                className={cn(
                  "w-full max-w-fit max-h-20 object-scale-down hover:outline hover:outline-4 hover:outline-secondary-foreground hover:outline-offset-4 rounded hover:scale-105 transition duration-200",
                  `${
                    newCollection.category === e.name
                      ? "outline outline-4 outline-secondary-foreground outline-offset-4 rounded scale-105"
                      : ""
                  }`
                )}
                draggable={false}
                onClick={() => {
                  console.log(e.name);
                  setNewCollection((prev) => ({ ...prev, category: e.name }));
                }}
              />
            );
          })}
        </div>

        <div className="mt-3"></div>
        <Label>
          {t("Cubes-modal.current-selection")} {newCollection.category}
        </Label>
      </div>

      <DrawerFooter>
        <Button
          onClick={handleSubmitNewCollection}
          data-testId="drawer-accept-button"
        >
          {t("Inputs.create")}
        </Button>
        <DrawerClose asChild>
          <Button
            variant="outline"
            className="w-full"
            data-testId="drawer-cancel-button"
          >
            {t("Inputs.cancel")}
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
