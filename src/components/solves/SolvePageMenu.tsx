import React from "react";
import { ClockIcon, ShareIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface SolvePageMenuProps {
  solveMenuRef: React.RefObject<HTMLDivElement>;
  setSortModal: (sort: boolean) => void;
  setShareSolveModal: (share: boolean) => void;
}

export default function SolvePageMenu({
  solveMenuRef,
  setSortModal,
  setShareSolveModal,
}: SolvePageMenuProps) {
  const t = useTranslations("Index.SolvesPage");

  return (
    <div
      className="w-40 p-2 z-50 flex flex-col gap-3 mt-1 bg-white rounded-md text-xs text-black"
      ref={solveMenuRef}
    >
      <div
        className="flex justify-between items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={() => setSortModal(true)}
      >
        <div className="flex flex-row p-0">
          <ClockIcon className="w-4 h-4" />
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
          <span className="mx-1.5">{t("share-session")}</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>
    </div>
  );
}
