"use client";
import { usePreloadSettings } from "@/hooks/usePreloadSettings";
import { Navbar } from "@/components/navbar/index";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";

export default function PreloadSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  usePreloadSettings();
  const { settings } = useSettingsModalStore();
  const { isSolving, timerStatus } = useTimerStore();
  const theme = settings ? settings.theme.background.color : "light";
  return (
    <>
      <div className={`${theme}`}>
        <div className="flex flex-col justify-between max-h-dvh min-h-dvh gap-2 overflow-hidden select-none light:bg-neutral-50 light:text-zinc-950 dark:bg-zinc-950 dark:text-slate-50">
          {children}{" "}
          <>{!isSolving && timerStatus === "IDLE" ? <Navbar /> : null}</>
        </div>
      </div>
    </>
  );
}
