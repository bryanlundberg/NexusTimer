import React, { useState } from "react";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import SortSubMenu from "./SortSubMenu";

interface SortMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  setSortModal: (modal: boolean) => void;
  setIsSorted: (sorted: boolean) => void;
  setSortType: (type: string) => void;
}

const SortMenu = ({
  submenuRef,
  setIsSorted,
  setSortType,
  setSortModal,
}: SortMenuProps) => {
  const [sortByTime, setSortByTime] = useState<boolean>(false);
  const [sortByDate, setSortByDate] = useState<boolean>(false);

  const handleSortNewestToOldest = () => {
    setSortModal(false);
    setIsSorted(true);
    setSortType("NewestToOldest");
  };

  const handleSortOldestToNewest = () => {
    setSortModal(false);
    setIsSorted(true);
    setSortType("OldestToNewest");
  };
  const handleSortByPlusTwo = () => {
    setSortModal(false);
    setIsSorted(true);
    setSortType("plus2");
  };
  const handleSortFastestToSlowest = () => {
    setIsSorted(true);
    setSortModal(false);
    setSortType("FastestToSlowest");
  };
  const handleSortSolwestToFastest = () => {
    setSortModal(false);
    setIsSorted(true);
    setSortType("slowestToFastest");
  };

  const handleSortByTime = ()=>{
    setSortByTime((prev)=>!prev);
    setSortByDate(false);
  }


  const handleSortByDate = ()=>{
    setSortByDate((prev)=>!prev);
    setSortByTime(false);
  }
  return (
    <div
      className="w-40 p-2 flex  flex-col gap-3 mt-1 bg-white rounded-md text-xs text-black"
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
          <PlayIcon className="w-2 h-2 -mx-6"  />
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
          <PlayIcon  className="w-2 h-2 -mx-6" />
        </div>
      </div>


      {sortByTime && <div className="absolute top-0 left-0">
        <SortSubMenu submenuRef={submenuRef} title="Time" onAscending={handleSortFastestToSlowest} 
        onDescending={handleSortSolwestToFastest}/>
      </div> }


      {sortByDate && <div className="absolute top-0 left-0">
        <SortSubMenu submenuRef={submenuRef} title="Date" onAscending={handleSortOldestToNewest} 
        onDescending={handleSortNewestToOldest}/>
      </div> }
        
    </div>
  );
};

export default SortMenu;
