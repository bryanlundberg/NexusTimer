import LightBulb from "@/icons/LightBulb";
import genSolution from "@/lib/timer/genSolution";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import Loading from "../Loading";
import Pencil from "@/icons/Pencil";
import { AnimatePresence, motion } from "framer-motion";

export function ScrambleZone() {
  const {
    selectedCube,
    scramble,
    setDisplayHint,
    displayHint,
    setHints,
    initializing,
    isSolving,
    setCustomScramble,
  } = useTimerStore();
  const { lang, settings } = useSettingsModalStore();

  return (
    <>
      <div className="relative">
        <div
          className={`h-auto text-balance p-2 overflow-auto text-2xl sm:text-3xl font-semilight text-center rounded-md min-w-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-md max-h-28 md:max-h-full ${
            settings.features.scrambleBackground.status
              ? "dark:bg-zinc-900 light:bg-neutral-200"
              : "bg-transparent"
          }`}
        >
          {initializing
            ? "Initializing please wait."
            : selectedCube
            ? scramble
            : translation.timer["empty-scramble"][lang]}

          {initializing && (
            <div className="flex w-full justify-center my-3">
              <Loading />
            </div>
          )}
        </div>
        <AnimatePresence>
          {selectedCube?.category && !isSolving && !displayHint && (
            <motion.div
              initial={{ opacity: 0.1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.1 }}
              className="absolute bottom-0 right-0 cursor-pointer duration-300 transition translate-y-10 flex gap-3"
            >
              <div
                onClick={() => {
                  const newScramble = window.prompt(
                    `${translation.solves["enter-custom-scramble"][lang]}`
                  );
                  if (newScramble?.trim()) {
                    setCustomScramble(newScramble);
                  }
                }}
                className="hover:scale-105 light:hover:text-neutral-500 dark:hover:text-neutral-200 duration-200 transition"
              >
                <Pencil />
              </div>

              {selectedCube?.category &&
                ["3x3", "3x3 OH"].includes(selectedCube.category) &&
                !displayHint &&
                !isSolving && (
                  <div
                    onClick={() => {
                      setDisplayHint(true);
                      genSolution(
                        selectedCube.category,
                        scramble,
                        "yellow"
                      ).then((res: CrossSolutions) => setHints(res));
                    }}
                    className="hover:scale-105 hover:text-yellow-600 duration-200 transition"
                  >
                    <LightBulb />
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
