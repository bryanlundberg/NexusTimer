import genId from "@/lib/genId";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useTimerStore } from "@/store/timerStore";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function DrawerHintPanel() {
  const { hint } = useTimerStore();

  return (
    <>
      <DrawerContent className="w-full max-w-[550px] mx-auto">
        <DrawerHeader>
          <DrawerTitle className="flex gap-2 items-center">
            <Cross1Icon className="rotate-45" />
            Hints: Yellow layer
          </DrawerTitle>
          <DrawerDescription className="text-start">
            White on top - Green facing forward.
          </DrawerDescription>
        </DrawerHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-5">
          <div className="px-3">
            {hint?.cross.map((i) => (
              <OptimalCrossLayer key={genId()} solution={i} type="cross" />
            ))}
          </div>

          <div className="px-3 mt-1">
            {hint?.xcross.map((i) => (
              <OptimalCrossLayer key={genId()} solution={i} type="xcross" />
            ))}
          </div>
        </div>
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
        {type} - {solution}
      </div>
    </>
  );
}
