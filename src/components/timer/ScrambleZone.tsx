import genSolution from "@/lib/timer/genSolution";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { InteractiveIcon } from "./InteractiveIcon";
import { Component1Icon, Pencil2Icon } from "@radix-ui/react-icons";

export function ScrambleZone() {
  const {
    selectedCube,
    scramble,
    setDisplayHint,
    displayHint,
    setHints,
    isSolving,
    setCustomScramble,
  } = useTimerStore();

  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index.HomePage");
  return (
    <>
      <div className="relative mx-auto">
        <div
          className={`h-auto text-balance p-2 overflow-auto text-2xl sm:text-3xl font-semilight text-center rounded-md min-w-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-md max-h-28 md:max-h-full ${
            settings.features.scrambleBackground.status ? "bg-secondary" : ""
          }`}
        >
          <p data-testid="scramble-text-zone">
            {selectedCube ? scramble : t("empty-scramble")}
          </p>
        </div>
        <AnimatePresence>
          {selectedCube?.category && !isSolving && !displayHint && (
            <motion.div
              initial={{ opacity: 0.1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.1 }}
              className="absolute bottom-0 right-0 cursor-pointer duration-300 transition translate-y-10 flex gap-3"
            >
              <InteractiveIcon
                message={t("enter-custom-scramble")}
                icon={<Pencil2Icon className="size-5" />}
                onClick={() => {
                  const newScramble = window.prompt(
                    `${t("enter-custom-scramble")}`
                  );
                  if (newScramble?.trim()) {
                    setCustomScramble(newScramble);
                  }
                }}
              />

              {selectedCube?.category &&
                ["3x3", "3x3 OH"].includes(selectedCube.category) &&
                !displayHint &&
                !isSolving && (
                  <InteractiveIcon
                    message="Hints"
                    icon={<Component1Icon className="size-5" />}
                    onClick={() => {
                      setDisplayHint(true);
                      genSolution(
                        selectedCube.category,
                        scramble,
                        "yellow"
                      ).then((res: CrossSolutions) => setHints(res));
                    }}
                  />
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
