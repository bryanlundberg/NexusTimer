import SelectOptions from "@/icons/SelectOptions";
import genId from "@/lib/genId";
import { useState, useEffect, useRef } from "react";

export default function SelectMetrics({
  label,
  options,
  handleChange,
  extraClass,
}: {
  label: any;
  options: any[];
  handleChange: any;
  extraClass?: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState(label);
  const componentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSelect = (value: any) => {
    setSelect(value);
    setOpen(false);
    handleChange(value);
  };

  const renderOption = (opt: any, selected: string) => {
    const active = opt === selected;
    return (
      <div
        key={genId()}
        onClick={() => handleSelect(opt)}
        className={`flex justify-between items-center hover:text-neutral-200 text-neutral-300 p-1 cursor-pointer rounded-md ${
          active ? "bg-zinc-800" : "bg-zinc-950 hover:bg-zinc-900"
        }`}
      >
        <div>{opt}</div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`relative ${extraClass ? extraClass : ""}`}
        ref={componentRef}
      >
        <button
          onClick={handleOpen}
          className={`w-full bg-zinc-950 hover:bg-zinc-900 hover:text-neutral-200 text-neutral-300 border rounded-md p-1 border-zinc-800 flex justify-between items-center px-2`}
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
