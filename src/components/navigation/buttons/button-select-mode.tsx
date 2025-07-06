"use client";
import { Button } from "@/components/ui/button";
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
import { useTranslations } from "next-intl";
import { TimerMode } from "@/enums/TimerMode";

export default function ButtonSelectMode() {
  const timerMode = useTimerStore((state) => state.timerMode);
  const setTimerMode = useTimerStore((state) => state.setTimerMode);
  const t = useTranslations("Index");
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="py-0 px-3">
            <MixIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>{t("HomePage.mode")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={timerMode}
            onValueChange={(e: any) => setTimerMode(e)}
          >
            <DropdownMenuRadioItem value={TimerMode.NORMAL}>Normal</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.STACKMAT}>
              Stackmat
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.VIRTUAL} disabled>
              Virtual
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={TimerMode.SMART_CUBE} disabled>
              Smart cube
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
