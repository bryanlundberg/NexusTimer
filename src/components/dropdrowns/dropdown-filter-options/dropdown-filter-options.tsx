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
  CalendarDaysIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";

export default function DropdownFilterSolves() {
  const { sortType, order, handleChangeOrder, handleChangeSortType } =
    useSolveFiltersStore();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            <EllipsisVerticalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* sort - time */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
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
                <CalendarDaysIcon className="w-4 h-4" />
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
                <ShareIcon className="w-4 h-4" />
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
                <DropdownMenuItem>All session</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
