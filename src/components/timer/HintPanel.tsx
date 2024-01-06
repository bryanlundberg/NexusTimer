import useClickOutside from "@/hooks/useClickOutside";
import LightBulb from "@/icons/LightBulb";
import { Layers } from "@/interfaces/types/Layers";
import genSolution from "@/lib/timer/genSolution";
import { useTimerStore } from "@/store/timerStore";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function HintPanel() {
  const { displayHint, setDisplayHint, scramble, selectedCube } =
    useTimerStore();
  const componentRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(componentRef, () => setDisplayHint(false));
  return (
    <>
      <AnimatePresence>
        {displayHint && selectedCube ? (
          <div className="absolute w-full h-auto font-medium text-black bottom-0 overflow-hidden z-20">
            <motion.div
              initial={{ y: 1500, opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 1000, opacity: 0.8 }}
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
                <OptimalCrossLayer
                  layer="yellow"
                  solution={genSolution(
                    selectedCube.category,
                    scramble,
                    "yellow"
                  )}
                />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function OptimalCrossLayer({
  layer,
  solution,
}: {
  layer: Layers;
  solution: CrossSolutions;
}) {
  return (
    <>
      <div>
        Optimal {layer.charAt(0).toUpperCase()}
        {layer.slice(1)}
      </div>
      <div className="text-xl font-normal select-text">
        Cross - {solution.cross}
      </div>
      <div className="text-xl font-normal select-text">
        XCross - {solution.xcross}
      </div>
    </>
  );
}
