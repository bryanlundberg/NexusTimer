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
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import {
  CalendarIcon,
  DividerHorizontalIcon,
  DividerVerticalIcon,
  DotsVerticalIcon,
  LapTimerIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

export default function DropdownFilterSolves() {
  const { sortType, order, handleChangeOrder, handleChangeSortType } =
    useSolveFiltersStore();

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
              <div className="flex items-center gap-1">
                <DividerHorizontalIcon />
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
              <div className="flex items-center gap-1">
                <DividerVerticalIcon className="w-4 h-4" />
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
              <div className="flex items-center gap-1">
                <Share1Icon className="w-4 h-4" />
                <p>Share</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled>Share...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Last Ao5</DropdownMenuItem>
                <DropdownMenuItem>Last Ao12</DropdownMenuItem>
                <DropdownMenuItem>Last Ao50</DropdownMenuItem>
                <DropdownMenuItem>All</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
