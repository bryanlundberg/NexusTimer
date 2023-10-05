import Reload from "@/icons/Reload";
import Select from "./Select";
import Settings from "@/icons/Settings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";

export default function HeaderTimer() {
  const { scramble, selectedCube, setNewScramble } = useTimerStore();
  const { setSettingsOpen, settingsOpen, settings } = useSettingsModalStore();
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-4">
      <div className="flex items-center gap-3">
        <div
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-6 h-6 text-netral-50 hover:text-neutral-200 hover:cursor-pointer"
        >
          <Settings />
        </div>
        <Select />
        <div
          onClick={() => {
            if (selectedCube) {
              setNewScramble(selectedCube);
            }
          }}
          className="w-6 h-6 text-netral-50 hover:text-neutral-200 hover:cursor-pointer"
        >
          <Reload />
        </div>
      </div>

      <div className="text-center font-medium text-2xl h-auto max-h-52 overflow-auto p-2 bg-zinc-900 rounded-md">
        {selectedCube
          ? scramble
          : translation.timer["empty-scramble"][settings.locale[0].lang]}
      </div>
    </div>
  );
}
