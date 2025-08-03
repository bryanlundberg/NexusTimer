import { ScrambleDisplay } from "../scramble-display";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrambleImagePanel() {
  const settings = useSettingsModalStore(store => store.settings);
  const scramble = useTimerStore(store => store.scramble);
  const selectedCube = useTimerStore(store => store.selectedCube);
  const setZoomInScramble = useTimerStore(store => store.setZoomInScramble);
  const zoomInScramble = useTimerStore(store => store.zoomInScramble);
  const isSolving = useTimerStore(store => store.isSolving);

  return (
    <AnimatePresence>
      {(!zoomInScramble || !isSolving) && (
        <motion.div
          key="scramble-image-panel"
          initial={{ opacity: 0.8, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.8, y: 100 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full"
        >
          <div
            className={"w-fit mx-auto"}
            onPointerDown={(e) => {
              e.stopPropagation();
              setZoomInScramble(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setZoomInScramble(true);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setZoomInScramble(true);
            }}
          >
            <ScrambleDisplay
              className="min-w-32 mx-auto cursor-pointer w-fit h-20 md:h-24"
              show={settings.features.scrambleImage}
              scramble={scramble}
              event={selectedCube?.category || "3x3"}
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
