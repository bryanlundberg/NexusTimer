import { ScrambleDisplay } from "../scramble-display";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function ScrambleImagePanel() {
  const settings = useSettingsModalStore(store => store.settings);
  const scramble = useTimerStore(store => store.scramble);
  const selectedCube = useTimerStore(store => store.selectedCube);
  const setZoomInScramble = useTimerStore(store => store.setZoomInScramble);
  const zoomInScramble = useTimerStore(store => store.zoomInScramble);
  const isSolving = useTimerStore(store => store.isSolving);

  if (zoomInScramble || isSolving) return null;

  return (
    <ScrambleDisplay
      className="w-full h-full cursor-pointer"
      show={settings.features.scrambleImage}
      scramble={scramble}
      event={selectedCube?.category || "3x3"}
      onClick={() => setZoomInScramble(true)}
    />
  );
}
