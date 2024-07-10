import React, { useState } from "react";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

interface SortMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  setSortBy: (type: string) => void;
  setSortOn: (type: string) => void;
  setSubMenuModal: (prev: boolean) => void;
}

const SortMenu = ({
  submenuRef,
  setSortBy,
  setSortOn,
  setSubMenuModal,
}: SortMenuProps) => {
  const handleSortByTime = () => {
    setSortBy("Time");
    setSortOn("");
    setSubMenuModal(true);
  };

  const handleSortByDate = () => {
    setSortBy("Date"), setSortOn(""), setSubMenuModal(true);
  };

  return (
    <div
      className="w-40 p-2 z-50 flex  flex-col gap-3 mt-1 bg-white rounded-md text-xs text-black"
      ref={submenuRef}
    >
      <p className="text-sm">Sort By...</p>

      <div
        className="flex justify-between items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortByTime}
      >
        <div className="flex flex-row p-0">
          <ClockIcon className="w-4 h-4" />
          <span className="mx-1.5">Time</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>

      <div
        className="flex justify-between items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortByDate}
      >
        <div className="flex flex-row p-0">
          <CalendarIcon className="w-4 h-4" />
          <span className="mx-1.5">Date</span>
        </div>
        <div>
          <PlayIcon className="w-2 h-2 -mx-6" />
        </div>
      </div>
    </div>
  );
};

export default SortMenu;
