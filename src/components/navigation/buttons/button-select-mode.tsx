"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { useTimerStore } from "@/store/timerStore";

export default function ButtonSelectMode() {
  const { timerMode, setTimerMode } = useTimerStore();
  return (
    <>
      <Select
        defaultValue={timerMode}
        onValueChange={(e: any) => setTimerMode(e)}
      >
        <SelectTrigger className="w-fit"></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Mode</SelectLabel>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="stackmat">Stackmat</SelectItem>
            <SelectItem value="virtual" disabled>
              Virtual
            </SelectItem>
            <SelectItem value="smart-cube" disabled>
              Smart cube
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
