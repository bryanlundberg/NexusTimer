import { Switch } from "@headlessui/react";
import loadSettings from "@/lib/loadSettings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

function Toggle({ setting }: any) {
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
