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
        className={`cursor-pointer transition duration-200 flex justify-between items-center py-1 rounded-md ${
          active
            ? "dark:bg-zinc-500 light:bg-neutral-600 light:text-neutral-100"
            : "dark:bg-transparent dark:hover:bg-zinc-700 light:bg-transparent light:hover:bg-neutral-400 light:hover:text-neutral-950 light:text-neutral-800"
        }`}
      >
        <div className="ms-1">{label}</div>
      </div>
    </>
  );
}
