import genId from "@/lib/genId";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useTimerStore } from "@/store/timerStore";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function DrawerHintPanel() {
  const { hint } = useTimerStore();

  return (
    <>
      <DrawerContent className="max-w-96 mx-auto">
        <DrawerHeader>
          <DrawerTitle className="flex gap-2 items-center">
            <Cross1Icon className="rotate-45" />
            Hints: Yellow layer
          </DrawerTitle>
          <DrawerDescription>
            Position to start: White on top, Green facing forward.
          </DrawerDescription>
          {hint?.cross.map((i) => (
            <OptimalCrossLayer key={genId()} solution={i} type="cross" />
          ))}
          {hint?.xcross.map((i) => (
            <OptimalCrossLayer key={genId()} solution={i} type="xcross" />
          ))}
        </DrawerHeader>
      </DrawerContent>
    </>
  );
}

function OptimalCrossLayer({
  solution,
  type,
}: {
  solution: string;
  type: "cross" | "xcross";
}) {
  return (
    <>
      <div className="select-text">
        {type.charAt(0).toUpperCase()}
        {type.slice(1)} - {solution}
      </div>
    </>
  );
}
