import { ScrambleDisplay } from "../scramble-display";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function ScrambleImagePanel() {
  const { settings } = useSettingsModalStore();
  const {
    scramble,
    selectedCube,
    setZoomInScramble,
    zoomInScramble,
    isSolving,
  } = useTimerStore();

  if (zoomInScramble || isSolving) return null;

  return (
    <ScrambleDisplay
      className="w-full h-full cursor-pointer"
      show={settings.features.scrambleImage.status}
      scramble={scramble}
      event={selectedCube?.category || "3x3"}
      onClick={() => setZoomInScramble(true)}
    />
  );
}
