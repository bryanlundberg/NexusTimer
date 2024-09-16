import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import loadSettings from "@/lib/loadSettings";
import { Cube } from "@/interfaces/Cube";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MenuSelectDefaultStartCube() {
  const { settings, setSettings } = useSettingsModalStore();
  const t = useTranslations("Index");
  const { cubes } = useTimerStore();

  const handleCubeSelect = (cubeId: string) => {
    // if selected no cube at start
    if (cubeId === "none") {
      const currentSettings = loadSettings();
      currentSettings.preferences.defaultCube.cube = null;
      setSettings(currentSettings);
      window.localStorage.setItem("settings", JSON.stringify(currentSettings));
      return;
    }

    // if selected a cube for start
    const selection = cubes?.find((i) => i.id === cubeId);
    if (!selection) return;
    const currentSettings = loadSettings();
    currentSettings.preferences.defaultCube.cube = selection;
    setSettings(currentSettings);
    window.localStorage.setItem("settings", JSON.stringify(currentSettings));
  };

  const defaultCube = settings.preferences.defaultCube.cube?.id;

  return (
    <div className="flex justify-between items-center mb-1 w-full">
      <div className="ms-12">{t("Settings-menu.auto-select")}</div>
      <div className="relative me-6 w-fit mx-auto">
        <Select
          defaultValue="none"
          value={defaultCube}
          onValueChange={handleCubeSelect}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t("Inputs.none")}</SelectItem>
            {cubes?.map((cube) => {
              return (
                <SelectItem value={cube.id} key={cube.id}>
                  {cube.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
