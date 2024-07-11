import React from "react";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Modes } from "@/lib/SortSolves";
import { useTranslations } from "next-intl";

interface SortModeMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  onSelectSortMode: (mode: Modes) => void;
}

export default function SortModeMenu({
  submenuRef,
  onSelectSortMode,
}: SortModeMenuProps) {
  const t = useTranslations("Index.SolvesPage");

  return (
    <div
      className="w-40 p-2 z-50 flex  flex-col gap-3 mt-1 bg-white rounded-md text-xs text-black"
      ref={submenuRef}
    >
      <p className="text-sm">{t("sort-by")}</p>

      <div
        className="flex justify-between items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() => onSelectSortMode("Time")}
      >
        <div className="flex flex-row p-0">
          <ClockIcon className="w-4 h-4" />
          <span className="mx-1.5">{t("time")}</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>

      <div
        className="flex justify-between items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() => onSelectSortMode("Date")}
      >
        <div className="flex flex-row p-0">
          <CalendarIcon className="w-4 h-4" />
          <span className="mx-1.5">{t("date")}</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>
    </div>
  );
}
