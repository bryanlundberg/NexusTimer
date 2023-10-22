interface ToggleSolvesButton {
  label: string;
  handleClick: () => void;
  active?: boolean;
}

export default function ToggleSolvesButton({
  label,
  handleClick,
  active,
}: ToggleSolvesButton) {
  return (
    <>
      <button
        onClick={() => handleClick()}
        type="button"
        className={`w-full appearance-none rounded-md ${
          active
            ? "light:bg-neutral-400 light:text-neutral-950 dark:bg-zinc-950"
            : "dark:bg-transparent"
        }`}
      >
        {label}
      </button>
    </>
  );
}
