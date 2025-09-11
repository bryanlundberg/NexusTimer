import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createShareMessage } from "@/lib/createShareMessage";
import { useTimerStore } from "@/store/timerStore";
import {
  DotsVerticalIcon,
  DragHandleHorizontalIcon,
  DragHandleVerticalIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { STATES } from "@/constants/states";
import { DisplaySolvesTabs } from "@/enums/DisplaySolvesTabs";

export default function DropdownFilterSolves() {
  const t = useTranslations("Index");
  const [tabMode,] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, { defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE });
  const [orderType, setOrderType] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, { defaultValue: STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE });
  const [sortType, setSortType] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE });

  const selectedCube = useTimerStore((state) => state.selectedCube);
  const locale = useLocale();
  const date = DateTime.now().setLocale(locale).toLocaleString();
  const handleShare = (type: "All" | "3" | "5" | "12" | "50" | "100") => {
    if (selectedCube) {
      const tempSolves =
        tabMode === DisplaySolvesTabs.ALL ? selectedCube.solves.all : selectedCube.solves.session;

      const message = createShareMessage({
        type,
        solves: tempSolves,
        translations: {
          statsTitle: t("SolvesPage.share-clipboard.header"),
          avg: t("SolvesPage.share-clipboard.average"),
          listOfTimes: t("SolvesPage.share-clipboard.list-of-times"),
          date: date,
        },
      });

      if ("clipboard" in navigator) {
        navigator.clipboard.writeText(message);
      }

      toast(t("SolvesPage.toast.success-copy"), {
        description: t("SolvesPage.toast.success-copy-description"),
      });
    } else {
      toast(t("SolvesPage.toast.unable-action"), {
        description: t("SolvesPage.toast.warning-select-cube"),
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* sort - type */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <DragHandleHorizontalIcon />
                <p>{t("SolvesPage.sort")}</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={sortType}
                  onValueChange={setSortType}
                >
                  <DropdownMenuRadioItem value="time">
                    {t("SolvesPage.time")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="date">
                    {t("SolvesPage.date")}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* sort - direction */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <DragHandleVerticalIcon />
                <p>{t("SolvesPage.order")}</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={orderType}
                  onValueChange={setOrderType}
                >
                  <DropdownMenuRadioItem value="asc">
                    {t("SolvesPage.ascending")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    {t("SolvesPage.descending")}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* share */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <Share1Icon />
                <p>{t("SolvesPage.share")}</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleShare("5")}>
                  {t("SolvesPage.last")} Ao5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("12")}>
                  {t("SolvesPage.last")} Ao12
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("All")}>
                  {t("SolvesPage.all")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
