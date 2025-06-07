import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import loadSettings from "@/lib/loadSettings";
import { setSetting } from "@/lib/settingsUtils";
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
    const defaultCubeKey = settings.preferences.defaultCube.key;

    if (cubeId === "none") {
      setSetting(defaultCubeKey, null);
    } else {
      const selection = cubes?.find((i) => i.id === cubeId);
      if (!selection) return;
      setSetting(defaultCubeKey, cubeId);
    }
    const updatedSettings = loadSettings();
    setSettings(updatedSettings);
  };

  const defaultCube = settings.preferences.defaultCube.id;

  return (
    <div className="flex justify-between items-center mb-1 mx-3">
      <div className="grow">{t("Settings-menu.auto-select")}</div>
      <Select
        defaultValue={defaultCube || "none"}
        value={defaultCube || "none"}
        onValueChange={handleCubeSelect}
      >
        <SelectTrigger className="w-[180px] bg-background">
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
  );
}
