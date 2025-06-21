import { ScrambleDisplay } from "../scramble-display";
import { useTimerStore } from "@/store/timerStore";

export default function ScrambleModal() {
  const { zoomInScramble, setZoomInScramble, scramble, selectedCube } = useTimerStore();

  if (!zoomInScramble) return null;

  const handleClose = () => setZoomInScramble(false);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-transparent"
      onClick={handleClose}
    >
      <ScrambleDisplay
        className="w-full h-120 mx-auto"
        show
        event={selectedCube?.category || "3x3"}
        scramble={scramble}
      />
    </div>
  );
}
