import { Switch } from "@headlessui/react";
import loadSettings from "@/lib/loadSettings";
import { getSetting, setSetting } from "@/lib/settingsUtils";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

function Toggle({ setting }: any) {
  const { status, key: id } = setting;
  const { setSettings } = useSettingsModalStore();

  const saveSettings = () => {
    const currentStatus = getSetting(id, status);
    setSetting(id, !currentStatus);
    const updatedSettings = loadSettings();
    setSettings(updatedSettings);
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
      <span className="sr-only">toggle/read</span>
      <span
        className={`${
          status ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}

export default Toggle;
