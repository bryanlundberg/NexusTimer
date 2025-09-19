import { ScrambleDisplay } from "../scramble-display";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';
import { useWindowSize } from 'react-use-size';
import { SCRAMBLE_HEIGHT } from '@/constants/scramble-height';

export default function ScrambleImagePanel() {
  const settings = useSettingsModalStore(store => store.settings);
  const scramble = useTimerStore(store => store.scramble);
  const selectedCube = useTimerStore(store => store.selectedCube);
  const setZoomInScramble = useTimerStore(store => store.setZoomInScramble);
  const zoomInScramble = useTimerStore(store => store.zoomInScramble);
  const isSolving = useTimerStore(store => store.isSolving);
  const { height } = useWindowSize();
  return (
    <AnimatePresence>
      {(!zoomInScramble || !isSolving) && (
        <motion.div
          key="scramble-image-panel"
          initial={{ opacity: 0.8, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.8, y: 100 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className={"w-fit mx-auto"}
            onPointerDownCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setZoomInScramble(true);
            }}
            onPointerUpCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStartCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setZoomInScramble(true);
            }}
            onTouchEndCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDownCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setZoomInScramble(true);
            }}
            onMouseUpCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ScrambleDisplay
              className={cn("w-20 h-20 md:w-32 mx-auto cursor-pointer", height <= SCRAMBLE_HEIGHT && "h-18 max-w-20")}
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
