import React from "react";

interface SortMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  setSortModal:(modal : boolean)=>void
  setIsSorted: (sorted: boolean) => void;
  setSortType : (type : string) =>void;
}

const SortMenu = ({ submenuRef, setIsSorted , setSortType ,setSortModal }: SortMenuProps) => {
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

  return (
    <div
      className="absolute transform : -translate-x-full w-40 p-2 flex  flex-col gap-3 mt-1 z-50 bg-white rounded-md text-xs text-black"
      ref={submenuRef}
    >
      <p className="font-semibold text-sm">Sort By-</p>
      <div
        className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortNewestToOldest}
      >
        Newest to Oldest
      </div>
      <div
        className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortOldestToNewest}
      >
        Oldest to Newest
      </div>
      <div
        className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortByPlusTwo}
      >
        +2
      </div>
      <div
        className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortFastestToSlowest}
      >
        Fastest to Slowest
      </div>
      <div
        className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleSortSolwestToFastest}
      >
        Slowest to Fastest
      </div>
    </div>
  );
};

export default SortMenu;
