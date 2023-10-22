import { useEffect } from "react";
import createScrambleImage from "@/lib/createScrambleImage";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";

export function useTimerScrambleEffect() {
  const { settings } = useSettingsModalStore();
  const { scramble, event } = useTimerStore();

  const showScramble = settings.features.scrambleImage.status;

  useEffect(() => {
    if (showScramble) {
      createScrambleImage(event, scramble ? scramble : "");
    }
  }, [showScramble, event, scramble]);

  return showScramble;
}
