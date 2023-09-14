import PlusIcon from "@/icons/PlusIcon";
import SelectOptions from "@/icons/SelectOptions";
import genId from "@/lib/genId";
import { useEffect, useState } from "react";
import cube222 from "@/images/categories/cube444.png";
import Image from "next/image";
import Check from "@/icons/Check";
import Link from "next/link";

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
          className="min-w-[250px] text-xs appearance-none border bg-transparent hover:bg-zinc-800 border-zinc-800 font-medium rounded-md px-4 py-2"
        >
          <div className="flex justify-between">
            <div className="">Select Cube</div>
            <SelectOptions />
          </div>
        </button>
        {open === true ? (
          <div
            id="list-options"
            className="absolute overflow-auto max-h-[400px] p-1 top-12 left-0 min-w-full max-w-full bg-zinc-950 text-slate-100 h-auto border border-zinc-800 rounded-md"
          >
            <LabelSection description="Favorite" />
            <Option />
            <Option />
            <Option />
            <LabelSection description="Cubes" />
            <Option />
            <Option />
            <Option />
            <Option />
            <Option />
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

function MiniatureIcon() {
  return <Image src={cube222} alt="dsafd" width={24} height={24} />;
}

function Option() {
  return (
    <div className="hover:bg-zinc-800 p-1 select-none rounded-md ps-2 flex justify-between overflow-hidden">
      <div className="flex justify-start gap-3">
        <MiniatureIcon />
        <div className="overflow-hidden">X-man tornado v3</div>
      </div>
      <div className="w-4 h-4 me-3 text-xs">
        <Check />
      </div>
    </div>
  );
}

function LabelSection({ description }: { description: string }) {
  return <div className="p-1 ps-2 text-xs text-neutral-500">{description}</div>;
}

function AddCubeOption() {
  return (
    <div className=" mt-1 cursor-pointer hover:bg-zinc-800 p-1 select-none rounded-md ps-2 border-t border-zinc-800">
      <Link href="/cubes">
        <div className="flex justify-start items-center align-middle gap-2">
          <PlusIcon />
          <div>Add Cube</div>
        </div>
      </Link>
    </div>
  );
}
