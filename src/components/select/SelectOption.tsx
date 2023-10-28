interface SelectOption {
  label: string;
  selected: string;
  onSelect: () => void;
}

export function SelectOption({ label, selected, onSelect }: SelectOption) {
  const active = label === selected;
  return (
    <>
      <div
        onClick={onSelect}
        className={`flex justify-between items-center p-1 rounded-md ${
          active
            ? "dark:bg-zinc-800 light:bg-neutral-600 light:text-neutral-100"
            : "dark:bg-zinc-950 dark:hover:bg-zinc-900 light:bg-transparent light:hover:bg-zinc-200 light:hover:text-neutral-950 light:text-neutral-800"
        }`}
      >
        <div>{label}</div>
      </div>
    </>
  );
}
