import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shareSolves } from "@/lib/shareSolves";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { useTimerStore } from "@/store/timerStore";
import {
  DotsVerticalIcon,
  DragHandleHorizontalIcon,
  DragHandleVerticalIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DropdownFilterSolves() {
  const t = useTranslations("Index");
  const { sortType, order, handleChangeOrder, handleChangeSortType, tab } =
    useSolveFiltersStore();
  const { selectedCube } = useTimerStore();

  const handleShare = () => {
    if (selectedCube) {
      const {
        formattedAo5,
        formattedAo12,
        formattedLast5Solves,
        formattedLast12Solves,
      } = shareSolves({
        solves:
          tab === "session"
            ? selectedCube.solves.session
            : selectedCube.solves.all,
      });
      console.log(
        formattedAo5,
        formattedAo12,
        formattedLast5Solves,
        formattedLast12Solves
      );
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
          <Button variant={"outline"}>
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
                  onValueChange={(e) => {
                    handleChangeSortType(e as any);
                  }}
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
                  value={order}
                  onValueChange={(e) => {
                    handleChangeOrder(e as any);
                  }}
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
                <DropdownMenuItem onClick={handleShare}>
                  {t("SolvesPage.last")} Ao5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  {t("SolvesPage.last")} Ao12
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
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
