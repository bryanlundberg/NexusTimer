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
import { toast } from "sonner";

export default function DropdownFilterSolves() {
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
      toast("Copied successfully", {
        description: "Has been copied to your clipboard.",
      });
    } else {
      toast("Unable to copy", {
        description: "Please select a cube before attempting to copy.",
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
          {/* sort - time */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <DragHandleHorizontalIcon />
                <p>Sort</p>
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
                    Time
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="date">
                    Date
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* sort - date */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <DragHandleVerticalIcon />
                <p>Order</p>
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
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Descending
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
                <p>Share</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled>Share...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}>
                  Last Ao5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  Last Ao12
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>All</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
