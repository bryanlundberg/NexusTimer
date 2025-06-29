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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full h-full"
        >
          <ScrambleDisplay
            className="w-full h-full cursor-pointer"
            show={settings.features.scrambleImage}
            scramble={scramble}
            event={selectedCube?.category || "3x3"}
            onClick={() => setZoomInScramble(true)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
