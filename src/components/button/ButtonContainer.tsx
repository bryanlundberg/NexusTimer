interface ButtonContainer {
  children: React.ReactNode;
  className?: string;
  handleClick: () => void;
}

export function ButtonContainer({
  className,
  children,
  handleClick,
}: ButtonContainer) {
  return (
    <>
      <button
        type="button"
        className={`h-8 px-3 transition duration-200 rounded-md border font-medium justify-center align-middle light:hover:bg-neutral-200 light:text-neutral-950 light:border-neutral-200 dark:hover:bg-zinc-900 dark:border-zinc-800 text-sm disabled:bg-zinc-900 ${className}`}
        onClick={handleClick}
      >
        {children}
      </button>
    </>
  );
}
