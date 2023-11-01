import createScrambleImage from "@/lib/createScrambleImage";
import { useEffect } from "react";

interface ScrambleDisplay {
  className: string;
  show: boolean;
  scramble: string | null;
  event: string;
}

export default function ScrambleDisplay(props: ScrambleDisplay) {
  const { className, show, scramble, event } = props;

  useEffect(() => {
    if (!show) return;
    createScrambleImage(event, scramble ? scramble : "");
  }, [show, event, scramble]);

  return (
    <>
      {show ? (
        <div className={className} id="scramble-display"></div>
      ) : null}
    </>
  );
}
