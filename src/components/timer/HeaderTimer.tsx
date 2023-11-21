import Reload from "@/icons/Reload";
import Select from "../Select";
import Settings from "@/icons/Settings";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { InteractiveIcon } from "./InteractiveIcon";
import { ScrambleZone } from "./ScrambleZone";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";


export default function HeaderTimer() {
  const { selectedCube, setNewScramble, isSolving } = useTimerStore();
  const { setSettingsOpen, settingsOpen } = useSettingsModalStore();
  const { global } = useTimerStatistics();
  const { lastSolve } = useTimerStore();

  if (isSolving) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-4">
      <div className="flex items-center gap-3">
        <InteractiveIcon
          icon={<Settings />}
          handleClick={() => setSettingsOpen(!settingsOpen)}
        />
        <Select />
        <InteractiveIcon
          icon={<Reload />}
          handleClick={() => {
            if (selectedCube) {
              setNewScramble(selectedCube);
            }
          }}
        />
      </div>
      <ScrambleZone />
      {
        lastSolve != null && lastSolve.time <= global.best ?
          <div className="text-center mt-10">
            <p>Congratulations!</p>
            <p>You have beaten your previous personal best.</p>
          </div>
          : <></> 
      }
    </div>
  );
}
