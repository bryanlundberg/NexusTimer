import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTimerStore } from "@/store/timerStore";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

export default function ButtonNextScramble() {
  const t = useTranslations("Index");
  const { selectedCube, setNewScramble } = useTimerStore();
  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild disabled={selectedCube === null}>
            <Button
              variant={"ghost"}
              className="py-0 px-3"
              onClick={() => setNewScramble(selectedCube)}
            >
              <UpdateIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("HomePage.new-scramble")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
