import { Toggle } from "@/components/ui/toggle";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { DashboardIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useTimerStore } from "@/store/timerStore";

export default function ButtonDisplayType() {
  const { handleChangeTab, tab } = useSolveFiltersStore();
  const { selectedCube } = useTimerStore();
  const t = useTranslations("Index");
  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* This <div> explained: https://github.com/shadcn-ui/ui/issues/1988#issuecomment-1980597269 */}
            <div>
              <Toggle
                defaultPressed={tab === "all"}
                disabled={selectedCube === null}
                onPressedChange={() => {
                  if (tab === "session") {
                    handleChangeTab("all");
                  } else if (tab === "all") {
                    handleChangeTab("session");
                  }
                }}
              >
                <DashboardIcon />
              </Toggle>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Show:{" "}
              {tab === "all"
                ? t("SolvesPage.session")
                : t("SolvesPage.historial")}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
