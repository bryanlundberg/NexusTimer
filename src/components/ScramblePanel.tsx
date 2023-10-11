import createScrambleImage from "@/lib/createScrambleImage";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";

export default function ScramblePanel() {
  const { settings } = useSettingsModalStore();
  const { scramble, event } = useTimerStore();

  const showScramble = settings.features.scrambleImage.status;
  useEffect(() => {
    if (showScramble) {
      createScrambleImage(event, scramble ? scramble : "");
    }
  }, [settings, event, scramble, showScramble]);
  return (
    <>
      {showScramble ? (
        <div className="w-full h-full" id="scramble-display"></div>
      ) : null}
    </>
  );
}
