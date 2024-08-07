import React from "react";
import { BarsArrowDownIcon, ShareIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface SolvesOptionsDropdownProps {
  solveMenuRef: React.RefObject<HTMLDivElement>;
  setSortModal: (sort: boolean) => void;
  setShareSolveModal: (share: boolean) => void;
}

export default function SolvesOptionsDropdown({
  solveMenuRef,
  setSortModal,
  setShareSolveModal,
}: SolvesOptionsDropdownProps) {
  const t = useTranslations("Index.SolvesPage");

  return (
    <div
      className="w-40 p-2 z-50 flex flex-col gap-1 mt-1 bg-white rounded-md text-xs text-black"
      ref={solveMenuRef}
    >
      <div
        className="flex justify-between items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() => setSortModal(true)}
      >
        <div className="flex flex-row p-0">
          <BarsArrowDownIcon className="w-4 h-4" />
          <span className="mx-1.5">{t("sort-by")}</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>

      <div
        className="flex justify-between items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() => setShareSolveModal(true)}
      >
        <div className="flex flex-row p-0">
          <ShareIcon className="w-4 h-4" />
          <span className="mx-1.5">{t("share")}</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>
    </div>
  );
}
