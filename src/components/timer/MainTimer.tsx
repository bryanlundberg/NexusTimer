import ManualMode from "./ManualMode";
import Timer from "./Timer";
import { useTimerStore } from "@/store/timerStore";
import Stackmat from "../stackmat";
import { TimerMode } from "@/enums/TimerMode";
import TimerVirtual from '@/components/timer/TimerVirtual';

export function MainTimer() {
  const timerMode = useTimerStore(store => store.timerMode);
  const event = useTimerStore(store => store.event);

  return (
    <>
      {timerMode === TimerMode.NORMAL && (
        <Timer />
      )}

      {timerMode === TimerMode.MANUAL && (
        <ManualMode />
      )}

      {timerMode === TimerMode.STACKMAT && (
        <Timer>
          <Stackmat />
        </Timer>
      )}

      {timerMode === TimerMode.VIRTUAL && (event === '333' || event === '222') && (
        <TimerVirtual/>
      )}
    </>
  );
}
