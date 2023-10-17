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
        className={`flex justify-between items-center dark:hover:text-neutral-200 dark:text-neutral-300 p-1  rounded-md ${
          active
            ? "dark:bg-zinc-800 light:bg-zinc-900 light:text-neutral-200"
            : "dark:bg-zinc-950 dark:hover:bg-zinc-900 light:bg-transparent light:hover:bg-zinc-200 light:hover:text-neutral-950 light:text-neutral-800"
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
          className={`transition duration-300 w-full dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-neutral-200 dark:text-neutral-300 border rounded-md p-1 dark:border-zinc-800 light:bg-neutral-100 light:hover:bg-neutral-200 light:hover:text-neutral-950 light:text-neutral-800  light:border-neutral-200 flex justify-between items-center px-2`}
        >
          {label}
          <SelectOptions />
        </button>
        {open ? (
          <div className="absolute left-0 z-10 w-full p-1 border rounded-md top-10 dark:bg-zinc-950 dark:border-zinc-800 light:bg-neutral-100 light:border-neutral-200">
            {options.map((opt) => renderOption(opt, select))}
          </div>
        ) : null}
      </div>
    </>
  );
}
