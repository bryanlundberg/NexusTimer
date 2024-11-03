import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ManualMode from "./ManualMode";
import Timer from "./Timer";
import { useTimerStore } from "@/store/timerStore";
import Stackmat from "../stackmat";

export function MainTimer() {
  const { timerMode } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const manualMode = settings.timer.manualMode.status;

  return (
    <>
      {timerMode === "normal" && <>{manualMode ? <ManualMode /> : <Timer />}</>}

      {timerMode === "stackmat" && (
        <Timer>
          <Stackmat />
        </Timer>
      )}
    </>
  );
  // return ;
}
