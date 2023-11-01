import { ScrambleDisplay } from "../scramble-display";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function ScrambleImagePanel() {
  const { settings } = useSettingsModalStore();
  const { scramble, event } = useTimerStore();

  const showScramble = settings.features.scrambleImage.status;

  return (
    <>
      <ScrambleDisplay
        className="w-full h-full"
        show={showScramble}
        scramble={scramble}
        event={event}
      ></ScrambleDisplay>
    </>
  );
}
