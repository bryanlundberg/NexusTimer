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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function ScrambleZone() {
  const { selectedCube, scramble, displayHint, setHints, isSolving } =
    useTimerStore();

  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index");
  return (
    <>
      <div className="relative mx-auto">
        <div
          className={`h-auto text-balance p-2 overflow-auto text-2xl sm:text-3xl font-semilight text-center rounded-md min-w-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-md max-h-28 md:max-h-full ${
            settings.features.scrambleBackground.status ? "bg-secondary" : ""
          }`}
        >
          <p data-testid="scramble-text-zone">
            {selectedCube ? scramble : t("HomePage.empty-scramble")}
          </p>
        </div>

        <div className="absolute bottom-0 right-0 cursor-pointer duration-300 transition translate-y-10 flex gap-3">
          {!isSolving && selectedCube && (
            <Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <Pencil2Icon />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>

                  <DialogEnterNewScramble />
                  <TooltipContent>
                    <p>Edit scramble</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Dialog>
          )}

          {selectedCube?.category &&
            ["3x3", "3x3 OH"].includes(selectedCube.category) &&
            !displayHint &&
            !isSolving && (
              <Drawer>
                <TooltipProvider>
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
                              "yellow"
                            ).then((res: CrossSolutions) => setHints(res));
                          }}
                        >
                          <Component1Icon />
                        </Button>
                      </DrawerTrigger>
                    </TooltipTrigger>

                    <DrawerHintPanel />
                    <TooltipContent>
                      <p>Hints</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Drawer>
            )}
        </div>
      </div>
    </>
  );
}
