import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ManualMode from "./ManualMode";
import Timer from "./Timer";
import { useTimerStore } from "@/store/timerStore";
import Stackmat from "../stackmat";
import { TimerMode } from "@/enums/TimerMode";
import TimerVirtual from '@/components/timer/TimerVirtual';

export function MainTimer() {
  const timerMode = useTimerStore(store => store.timerMode);
  const settings = useSettingsModalStore(store => store.settings);
  const manualMode = settings.timer.manualMode;
  const event = useTimerStore(store => store.event);

  return (
    <>
      {timerMode === TimerMode.NORMAL && (
        <>{manualMode ? <ManualMode /> : <Timer />}</>
      )}

      {timerMode === TimerMode.STACKMAT && (
        <Timer>
          <Stackmat />
        </Timer>
      )}

      {timerMode === TimerMode.VIRTUAL && event === '333' && (
        <TimerVirtual/>
      )}
    </>
  );
}
