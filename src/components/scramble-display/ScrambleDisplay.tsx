import { useEffect } from "react";
import { TwistyPlayer, PuzzleID } from "cubing/twisty";
import { cubeCollection } from "@/lib/const/cubeCollection";

interface ScrambleDisplay {
  className: string;
  show: boolean;
  scramble: string | null;
  event: string;
}

export default function ScrambleDisplay({
  show,
  scramble,
  event,
  className,
}: ScrambleDisplay) {
  useEffect(() => {
    if (!show) return;

    const display = document.querySelector("twisty-player");
    display?.remove();

    const getDisplayId = (): PuzzleID | null => {
      const category = cubeCollection.filter((u) => u.event === event);
      if (category.length >= 1) return category[0].displayId;
      return null;
    };

    const displayId = getDisplayId();

    const player = new TwistyPlayer({
      puzzle: displayId || "3x3x3",
      alg: scramble ? scramble : "",
      hintFacelets: "none",
      background: "none",
      controlPanel: "none",
      visualization: "2D",
    });

    document.querySelector("#scramble-display")?.appendChild(player);
    const twistyPlayerElement = document.querySelector("twisty-player");
    if (twistyPlayerElement) {
      twistyPlayerElement.style.width = "100%";
      twistyPlayerElement.style.height = "auto";
      twistyPlayerElement.style.maxWidth = "100%";
      twistyPlayerElement.style.minHeight = "100%";
    }
  }, [show, event, scramble]);

  return (
    <>{show ? <div className={className} id="scramble-display"></div> : null}</>
  );
}
