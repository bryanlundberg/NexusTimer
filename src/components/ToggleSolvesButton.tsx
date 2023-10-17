export default function ToggleSolvesButton({
  children,
  handleClick,
  active,
  ...props
}: {
  children: React.ReactNode;
  handleClick: any;
  active: boolean;
}) {
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
        {...props}
      >
        {children}
      </button>
    </>
  );
}
