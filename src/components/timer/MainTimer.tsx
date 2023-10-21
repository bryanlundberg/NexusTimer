import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ManualMode from "./ManualMode";
import Timer from "./Timer";

export function MainTimer() {
  const { settings } = useSettingsModalStore();
  const manualMode = settings.timer.manualMode.status;
  return <>{manualMode ? <ManualMode /> : <Timer />}</>;
}
