import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import React from "react";

interface SortSubMenuProps {
  submenuRef: React.RefObject<HTMLDivElement>;
  title: string;
  setSortOn: (type: string) => void;
  setSortModal: (bool: boolean) => void;
  setIsSorted: (bool: boolean) => void;
  setSubMenuModal:(bool: boolean) => void;
}

const SortSubMenu = ({
  submenuRef,
  title,
  setSortOn,
  setSortModal,
  setIsSorted,
  setSubMenuModal
}: SortSubMenuProps) => {


  const handleAscending = () => {
    setSortOn("Ascending");
    setSortModal(false);
    setIsSorted(true);
    setSubMenuModal(false);
  };

  const handleDescending = () => {
    setSortOn("Descending");
    setSortModal(false);
    setIsSorted(true);
    setSubMenuModal(false);
  };

  return (
    <div
      className="w-40 p-2 flex flex-col gap-3 mt-1 bg-white rounded-md text-xs text-black"
      ref={submenuRef}
    >
      <p className="text-sm">{title}</p>
      <div
        className="flex justify-start items-center p-0 gap-1 py-2 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleAscending}
      >
        <div>
          <ArrowUpIcon className="w-4 h-4" />
        </div>
        <div>Ascending</div>
      </div>

      <div
        className="flex justify-start items-center p-0 gap-1 py-1 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
        onClick={handleDescending}
      >
        <div>
          <ArrowDownIcon className="w-4 h-4" />
        </div>
        <div>Descending</div>
      </div>
    </div>
  );
};

export default SortSubMenu;
