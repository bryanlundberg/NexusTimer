import { Switch } from "@headlessui/react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

function Toggle({
  status,
  read,
  id,
}: {
  status: boolean;
  read: string;
  id: string;
}) {
  const { setSettings } = useSettingsModalStore();

  const saveSettings = () => {
    const currentSettings = loadSettings();
    for (const setting of currentSettings.timer) {
      if (setting.key === id) {
        setting.status = !status;
      }
    }

    for (const setting of currentSettings.alerts) {
      if (setting.key === id) {
        setting.status = !status;
      }
    }

    for (const setting of currentSettings.features) {
      if (setting.key === id) {
        setting.status = !status;
      }
    }

    window.localStorage.setItem("settings", JSON.stringify(currentSettings));
    setSettings(currentSettings);
  };

  return (
    <Switch
      checked={status}
      onChange={() => {
        saveSettings();
      }}
      className={`${
        status ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">{read}</span>
      <span
        className={`${
          status ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}

export default Toggle;
