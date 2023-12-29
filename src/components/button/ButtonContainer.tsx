interface ButtonContainer {
  children: React.ReactNode;
  className?: string;
  handleClick: () => void;
  isDisabled?: boolean;
}

export function ButtonContainer({
  className,
  children,
  handleClick,
  isDisabled
}: ButtonContainer) {
  return (
    <>
      <button
        type="button"
        className={`min-h-9 px-3 transition duration-200 rounded-md border font-medium justify-center align-middle light:hover:bg-neutral-200 light:text-neutral-950 light:border-neutral-200 dark:hover:bg-zinc-700 dark:hover:border-zinc-500 dark:border-zinc-800 text-md disabled:bg-zinc-900 ${className}`}
        onClick={!isDisabled ? handleClick : undefined}
        style={{cursor:isDisabled ? 'not-allowed' : 'initial'}}
      >
        {children}
      </button>
    </>
  );
}
