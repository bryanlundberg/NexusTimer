import PlusIcon from "@/icons/PlusIcon";
import SelectOptions from "@/icons/SelectOptions";
import genId from "@/lib/genId";
import { useEffect, useState } from "react";

type TypesSelect = "Category" | "Cube";

export default function Select({
  type,
  options,
  handleChange,
  currentSelection,
  children,
}: {
  type: TypesSelect;
  options: any[];
  handleChange: any;
  currentSelection: any;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative p-2">
        <button
          onClick={() => setOpen(!open)}
          className="min-w-[200px] text-xs appearance-none border bg-transparent hover:bg-zinc-800 border-zinc-800 font-medium rounded-md px-4 py-2"
        >
          <div className="flex justify-between">
            <div className="">Select Cube</div>
            <SelectOptions />
          </div>
        </button>
        {open === true ? (
          <div
            id="list-options"
            className="absolute p-1 top-12 left-0 min-w-full max-w-full bg-zinc-950 text-slate-100 h-auto border border-zinc-800 rounded-md"
          >
            <Option />
            <Option />
            <Option />
            <AddCubeOption />
          </div>
        ) : null}
      </div>
    </>
  );
}

function Option() {
  return (
    <div className="hover:bg-zinc-800 p-1 select-none rounded-md ps-2">
      Holaaaaaaaaa
    </div>
  );
}

function AddCubeOption() {
  return (
    <div className="hover:bg-zinc-800 p-1 select-none rounded-md ps-2 border-t border-zinc-800">
      <div className="flex justify-start items-center align-middle gap-2">
        <PlusIcon />
        <div>Add Cube</div>
      </div>
    </div>
  );
}
