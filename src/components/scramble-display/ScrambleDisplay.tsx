import { useEffect } from "react";
import { TwistyPlayer, PuzzleID } from "cubing/twisty";
import { cubeCollection } from "@/lib/cubeCollection";

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

    const getDisplayId = (): PuzzleID => {
      const category = cubeCollection.filter((u) => u.event === event);
      console.log(category[0].displayId);
      return category[0].displayId;
    };

    const displayId = getDisplayId();

    const player = new TwistyPlayer({
      puzzle: displayId,
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
