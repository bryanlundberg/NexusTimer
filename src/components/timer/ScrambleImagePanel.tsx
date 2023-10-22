import { useTimerScrambleEffect } from "@/hooks/useTimerScrambleEffect";

export default function ScrambleImagePanel() {
  const showScramble = useTimerScrambleEffect();

  return (
    <>
      {showScramble ? (
        <div className="w-full h-full" id="scramble-display"></div>
      ) : null}
    </>
  );
}
