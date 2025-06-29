import genSolution from "@/lib/timer/genSolution";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { Component1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import DrawerHintPanel from "../drawners/drawer-hint-panel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogEnterNewScramble from "../dialogs/dialog-enter-new-scramble/dialog-enter-new-scramble";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Layer } from "@/enums/Layer";
import { motion } from "framer-motion";

export function ScrambleZone() {
  const selectedCube = useTimerStore(store => store.selectedCube);
  const scramble = useTimerStore(store => store.scramble);
  const displayHint = useTimerStore(store => store.displayHint);
  const setHints = useTimerStore(store => store.setHints);
  const isSolving = useTimerStore(store => store.isSolving);

  const settings = useSettingsModalStore(store => store.settings);
  const t = useTranslations("Index");
  return (
    <>
      <motion.div
        className="relative mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
      >
        <div
          className={`h-auto text-balance p-2 overflow-auto text-2xl sm:text-3xl font-semilight text-center rounded-md min-w-auto sm:max-w-(--breakpoint-sm) md:max-w-(--breakpoint-md) lg:max-w-(--breakpoint-md) max-h-28 md:max-h-full ${
            settings.features.scrambleBackground ? "bg-secondary" : ""
          }`}
        >
          <p data-testid="scramble-text-zone">
            {selectedCube ? scramble : t("HomePage.empty-scramble")}
          </p>
        </div>

        <div className="absolute bottom-0 right-0 cursor-pointer duration-300 transition translate-y-10 flex gap-3">
          <TooltipProvider delayDuration={250}>
            {!isSolving && selectedCube && (
              <Tooltip>
                <Dialog>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <Pencil2Icon/>
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>

                  <DialogEnterNewScramble/>
                  <TooltipContent>
                    <p>{t("HomePage.edit-scramble")}</p>
                  </TooltipContent>
                </Dialog>
              </Tooltip>
            )}

            {selectedCube?.category &&
              ["3x3", "3x3 OH"].includes(selectedCube.category) &&
              !displayHint &&
              !isSolving && (
                <Drawer>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DrawerTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => {
                            if (!selectedCube) return;
                            genSolution(
                              selectedCube.category,
                              scramble,
                              Layer.YELLOW
                            ).then((res: CrossSolutions) => setHints(res));
                          }}
                        >
                          <Component1Icon/>
                        </Button>
                      </DrawerTrigger>
                    </TooltipTrigger>

                    <DrawerHintPanel/>
                    <TooltipContent>
                      <p>{t("HomePage.hints")}</p>
                    </TooltipContent>
                  </Tooltip>
                </Drawer>
              )}
          </TooltipProvider>
        </div>
      </motion.div>
    </>
  );
}
