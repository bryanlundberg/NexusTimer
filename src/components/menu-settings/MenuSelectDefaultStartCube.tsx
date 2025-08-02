import { useTranslations } from "next-intl";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MenuSelectDefaultStartCube() {
  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index");
  const cubes = useTimerStore((state) => state.cubes);
  const updateSetting = useSettingsModalStore((state) => state.updateSetting);

  const handleCubeSelect = (cubeId: string) => {
    const defaultCubeKey = "preferences.defaultCube";
    const newValue = cubeId === "none" ? "" : cubes?.find((cube) => cube.id === cubeId)?.id;

    if (newValue === undefined) return;

    updateSetting(defaultCubeKey, newValue);
  };

  const defaultCube = settings.preferences.defaultCube;

  return (
    <div className="mx-3 mb-3">
      <div className="flex justify-between items-center mb-1">
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
      <div className="text-xs text-muted-foreground">
        {t("Settings-descriptions.auto-select-description")}
      </div>
    </div>
  );
}
