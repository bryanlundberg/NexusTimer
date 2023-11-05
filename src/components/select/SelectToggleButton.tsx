import SelectOptions from "@/icons/SelectOptions";

interface SelectToggleButton {
  text: string;
  handleClick: () => void;
}

export function SelectToggleButton({ text, handleClick }: SelectToggleButton) {
  return (
    <>
      <button
        onClick={handleClick}
        className={`transition duration-300 w-full dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-neutral-200 dark:text-neutral-300 border rounded-md p-1 dark:border-zinc-800 light:bg-neutral-100 light:hover:bg-neutral-200 light:hover:text-neutral-950 light:text-neutral-800  light:border-neutral-200 flex justify-between items-center px-2`}
      >
        <div>{text}</div>
        <div>
          <SelectOptions />
        </div>
      </button>
    </>
  );
}
