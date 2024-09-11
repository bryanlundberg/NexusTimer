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
import { useSolveFilters } from "@/store/SolvesFilters";
import {
  CalendarDaysIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function DropdownFilterSolves() {
  const { config, handleChangeConfig } = useSolveFilters();
  const [position, setPosition] = useState("top");
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
                <p>Time</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="top">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">
                    Descending
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
                <p>Date</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="top">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">
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
                <p>Share by...</p>
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
