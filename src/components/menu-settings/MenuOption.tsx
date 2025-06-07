import { Switch } from "../ui/switch";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { getSetting, setSetting } from "@/lib/settingsUtils";

interface MenuOption {
  label: string;
  setting: any;
}

export function MenuOption({ label, setting }: MenuOption) {
  const { status, key: id } = setting;
  const { setSettings } = useSettingsModalStore();

  const saveSettings = () => {
    const currentStatus = getSetting(id, status);
    setSetting(id, !currentStatus);
    const updatedSettings = loadSettings();
    setSettings(updatedSettings);
  };

  return (
    <div className="ps-3 pe-3 flex items-center justify-between mb-1">
      <div className="grow">{label}</div>
      <Switch checked={status} onCheckedChange={saveSettings} />
    </div>
  );
}
