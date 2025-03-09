import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ManualMode from "./ManualMode";
import Timer from "./Timer";
import { useTimerStore } from "@/store/timerStore";
import Stackmat from "../stackmat";
import { TimerMode } from "@/enums/TimerMode";

export function MainTimer() {
  const { timerMode } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const manualMode = settings.timer.manualMode.status;

  return (
    <>
      {timerMode === TimerMode.NORMAL && <>{manualMode ? <ManualMode /> : <Timer />}</>}

      {timerMode === TimerMode.STACKMAT && (
        <Timer>
          <Stackmat />
        </Timer>
      )}
    </>
  );
  // return ;
}
