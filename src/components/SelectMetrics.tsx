import Check from "@/icons/Check";
import SelectOptions from "@/icons/SelectOptions";
import { useEffect, useState } from "react";

export default function SelectMetrics({
  label,
  options,
  handleChange,
}: {
  label: string;
  options: any[];
  handleChange: any;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState(label);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSelect = (value: any) => {
    setSelect(value);
    setOpen(false);
    handleChange(value);
  };

  const renderOption = (opt: any, selected: string) => {
    return (
      <div
        onClick={() => handleSelect(opt)}
        className="flex justify-between items-center bg-zinc-950 hover:bg-zinc-900 hover:text-neutral-200 text-neutral-300 p-1 cursor-pointer rounded-md"
      >
        <div>{opt}</div>
        {opt === selected ? <Check /> : null}
      </div>
    );
  };
  return (
    <>
      <div className="relative">
        <button
          onClick={handleOpen}
          className="bg-zinc-950 hover:bg-zinc-900 hover:text-neutral-200 text-neutral-300 border rounded-md p-1 border-zinc-800 w-48 flex justify-between items-center px-2"
        >
          {label}
          <SelectOptions />
        </button>
        {open ? (
          <div className="absolute z-10 top-10 p-1 left-0 w-full rounded-md bg-zinc-950 border border-zinc-800">
            {options.map((opt) => renderOption(opt, select))}
          </div>
        ) : null}
      </div>
    </>
  );
}
