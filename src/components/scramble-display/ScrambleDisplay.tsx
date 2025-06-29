import { useEffect, useRef } from "react";
import { TwistyPlayer } from "cubing/twisty";
import getDisplayId from "@/lib/getDisplayId";
import { Categories } from "@/interfaces/Categories";

interface ScrambleDisplay extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  show: boolean;
  scramble: string | null;
  event: Categories;
  visualization?: "2D" | "3D";
}

export default function ScrambleDisplay({
  show,
  scramble,
  event,
  className,
  visualization = "2D",
  ...rest
}: ScrambleDisplay) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !containerRef.current) return;

    const existingPlayer = containerRef.current.querySelector("twisty-player");
    if (existingPlayer) {
      existingPlayer.remove();
    }

    const displayId = getDisplayId(event);

    const player = new TwistyPlayer({
      puzzle: displayId || "3x3x3",
      alg: scramble ? scramble : "",
      hintFacelets: "none",
      background: "none",
      controlPanel: "none",
      visualization: visualization,
    });

    containerRef.current.appendChild(player);

    player.style.width = "100%";
    player.style.height = "auto";
    player.style.maxWidth = "100%";
    player.style.minHeight = "100%";

    return () => {
      player.remove();
    };
  }, [show, event, scramble, visualization]);

  if (!show) return null;

  return (
    <div {...rest} className={className} id="scramble-display" ref={containerRef}></div>
  );
}
