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

  const showScramble = settings.features.scrambleImage.status;

  return (
    <>
      {!zoomInScramble && !isSolving && (
        <ScrambleDisplay
          className="w-full h-full cursor-pointer"
          show={showScramble}
          scramble={scramble}
          event={selectedCube ? selectedCube.category : "3x3"}
          onClick={() => setZoomInScramble(true)}
        ></ScrambleDisplay>
      )}
    </>
  );
}
