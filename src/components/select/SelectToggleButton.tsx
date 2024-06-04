import { ChevronUpDownIcon } from "@heroicons/react/16/solid";

interface SelectToggleButton {
  text: string;
  handleClick: () => void;
  isOpen: boolean;
}

export function SelectToggleButton({
  text,
  handleClick,
  isOpen,
}: SelectToggleButton) {
  return (
    <>
      <button
        onClick={handleClick}
        className={`transition duration-300 w-full dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-neutral-200 dark:hover:border-zinc-500 dark:text-neutral-300 border rounded-md p-1 dark:border-zinc-800 light:bg-neutral-200 light:hover:bg-neutral-300 light:hover:text-neutral-950 light:text-neutral-800  light:border-neutral-300 light:hover:border-neutral-400 flex justify-between items-center px-2 ${
          isOpen
            ? "light:bg-neutral-300 light:border-neutral-400 dark:bg-neutral-900 dark:border-zinc-500"
            : ""
        }`}
      >
        <div>{text}</div>
        <div>
          <ChevronUpDownIcon className="w-5 h-5" />
        </div>
      </button>
    </>
  );
}
