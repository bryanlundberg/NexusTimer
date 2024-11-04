"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTimerStore } from "@/store/timerStore";
import { MixIcon } from "@radix-ui/react-icons";

export default function ButtonSelectMode() {
  const { timerMode, setTimerMode } = useTimerStore();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="py-0 px-3">
            <MixIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={timerMode}
            onValueChange={(e: any) => setTimerMode(e)}
          >
            <DropdownMenuRadioItem value="normal">Normal</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="stackmat">
              Stackmat
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="virtual" disabled>
              Virtual
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="smart-cube" disabled>
              Smart cube
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
