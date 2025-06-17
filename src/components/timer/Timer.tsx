import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import useTimer from "@/hooks/useTimer";
import Confetti from "react-dom-confetti";
import useDeviceMatch from "@/hooks/useDeviceMatch";
import { confettiConfig } from "@/lib/const/confettiConfig";
import MenuSolveOptions from "../menu-solve-options/menu-solve-options";
import DisplayContainer from "./display/display-container";
import DisplayTime from "./display/display-time";
import { ReactNode } from "react";
import { TimerStatus } from "@/enums/TimerStatus";
import useSolveData from "@/hooks/useSolveData";

export default function Timer({ children }: { children?: ReactNode }) {
  const { settings } = useSettingsModalStore();
  const {
    selectedCube,
    isSolving,
    lastSolve,
    timerStatus,
    solvingTime,
    timerStatistics,
    setLastSolve,
    setTimerStatus,
    setTimerStatistics,
    setIsSolving,
    setSolvingTime,
    displayHint,
    timerMode
  } = useTimerStore();

  const { saveSolveMainTimer } = useSolveData();

  const { inspectionTime } = useTimer({
    onFinishSolve: () => saveSolveMainTimer(),
    isSolving,
    setTimerStatus,
    selectedCube,
    setTimerStatistics,
    inspectionRequired: settings.timer.inspection.status,
    setIsSolving,
    setSolvingTime,
    displayHint,
    timerMode,
    settings
  });

  const { device } = useDeviceMatch();

  return (
    <DisplayContainer>
      {selectedCube && (
        <DisplayTime
          isSolving={isSolving}
          timerStatus={timerStatus}
          lastSolve={lastSolve}
          solvingTime={solvingTime}
          device={device}
          inspectionTime={inspectionTime}
          hideWhileSolving={settings.features.hideWhileSolving.status}
        />
      )}
      <Confetti
        active={
          timerStatistics.global.best === lastSolve?.time &&
          !isSolving &&
          settings.alerts.bestTime.status
        }
        config={confettiConfig}
      />
      {lastSolve &&
        settings.features.quickActionButtons.status &&
        timerStatus === TimerStatus.IDLE && (
          <MenuSolveOptions
            solve={lastSolve}
            onDeleteSolve={() => setLastSolve(null)}
            caseOfUse="last-solve"
          />
        )}
      {children}
    </DisplayContainer>
  );
}
