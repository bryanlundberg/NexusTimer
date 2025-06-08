import { Colors } from "@/interfaces/types/colors";
import { setSetting } from "@/lib/settingsUtils";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import loadSettings from "@/lib/loadSettings";
import useWebsiteColors from "@/hooks/useWebsiteColors";

export default function MenuSelectColor() {
  const { settings, setSettings } = useSettingsModalStore();
  const { applyColorTheme } = useWebsiteColors();

  const handleChooseColor = (newColor: Colors) => {
    const colorTheme = settings.preferences.colorTheme.key;
    setSetting(colorTheme, newColor);
    setSettings(loadSettings());
    applyColorTheme(newColor);
  };

  const currentColor = settings.preferences.colorTheme.value;

  return (
    <div className="flex flex-col gap-2 px-2 mt-5">
      <div className="flex flex-wrap gap-2">
        <div
          className={`size-10 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none ${currentColor === 'red' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("red")}
        ></div>
        <div
          className={`size-10 rounded-full bg-orange-500 hover:bg-orange-600 focus:outline-none ${currentColor === 'orange' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("orange")}
        ></div>
        <div
          className={`size-10 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-none ${currentColor === 'yellow' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("yellow")}
        ></div>
        <div
          className={`size-10 rounded-full bg-green-500 hover:bg-green-600 focus:outline-none ${currentColor === 'green' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("green")}
        ></div>
        <div
          className={`size-10 rounded-full bg-blue-500 hover:bg-blue-600 focus:outline-none ${currentColor === 'blue' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("blue")}
        ></div>
        <div
          className={`size-10 rounded-full bg-violet-500 hover:bg-violet-600 focus:outline-none ${currentColor === 'violet' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("violet")}
        ></div>
        <div
          className={`size-10 rounded-full bg-rose-500 hover:bg-rose-600 focus:outline-none ${currentColor === 'rose' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("rose")}
        ></div>
        <div
          className={`size-10 rounded-full bg-neutral-500 hover:bg-neutral-600 focus:outline-none ${currentColor === 'neutral' ? 'ring' : ''}`}
          onClick={() => handleChooseColor("neutral")}
        ></div>
      </div>
    </div>
  );
}
