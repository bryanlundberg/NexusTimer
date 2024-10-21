import Toggle from "@/components/headless/Toggle";
import { Switch } from "../ui/switch";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

interface MenuOption {
  label: string;
  setting: any;
}

export function MenuOption({ label, setting }: MenuOption) {
  const { status, key: id } = setting;
  const { setSettings } = useSettingsModalStore();

  const saveSettings = () => {
    const currentSettings = loadSettings();

    Object.values(currentSettings.timer).forEach((setting: any) => {
      if (setting.key === id) {
        setting.status = !setting.status;
      }
    });

    Object.values(currentSettings.alerts).forEach((setting: any) => {
      if (setting.key === id) {
        setting.status = !setting.status;
      }
    });
    Object.values(currentSettings.features).forEach((setting: any) => {
      if (setting.key === id) {
        setting.status = !setting.status;
      }
    });

    window.localStorage.setItem("settings", JSON.stringify(currentSettings));
    setSettings(currentSettings);
  };

  return (
    <div className="ps-3 pe-3 flex items-center justify-between mb-1">
      <div className="grow">{label}</div>
      <Switch checked={status} onCheckedChange={saveSettings} />
    </div>
  );
}
