import useClickOutside from "@/hooks/useClickOutside";
import LightBulb from "@/icons/LightBulb";
import { Layers } from "@/interfaces/types/Layers";
import genId from "@/lib/genId";
import genSolution from "@/lib/timer/genSolution";
import { useTimerStore } from "@/store/timerStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function HintPanel() {
  const { displayHint, setDisplayHint, scramble, selectedCube } =
    useTimerStore();
  const componentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(componentRef, () => setDisplayHint(false));
  const solutions = genSolution("3x3", scramble, "yellow");
  return (
    <>
      <AnimatePresence>
        {displayHint && selectedCube ? (
          <div className="absolute w-full h-auto font-medium text-black bottom-0 overflow-hidden z-20">
            <motion.div
              initial={{ y: 400, opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0.8 }}
              transition={{ type: "lineal" }}
              ref={componentRef}
              className="bg-yellow-100 bottom-0 rounded-t-lg w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-sm mx-auto h-full"
            >
              <div className="p-2 border-b text-2xl border-gray-300 flex justify-between items-center">
                <div>Hint</div>
                <div className="text-black">
                  <LightBulb />
                </div>
              </div>
              <div className="p-3 max-h-full overflow-auto">
                <div>Optimal Yellow</div>
                {solutions.cross.map((i) => {
                  return (
                    <OptimalCrossLayer
                      key={genId()}
                      solution={i}
                      type="cross"
                    />
                  );
                })}
                {solutions.xcross.map((i) => {
                  return (
                    <OptimalCrossLayer
                      key={genId()}
                      solution={i}
                      type="xcross"
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
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
      <div className="text-xl font-normal select-text">
        {type.charAt(0).toUpperCase()}
        {type.slice(1)} - {solution}
      </div>
    </>
  );
}
