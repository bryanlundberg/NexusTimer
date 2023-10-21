interface SelectOptionList {
  isOpen: boolean;
  children: React.ReactNode;
}

export function SelectOptionList({ isOpen, children }: SelectOptionList) {
  return (
    <>
      {isOpen ? (
        <div className="absolute left-0 z-10 w-full p-1 border rounded-md top-10 dark:bg-zinc-950 dark:border-zinc-800 light:bg-neutral-100 light:border-neutral-200">
          {children}
        </div>
      ) : null}
    </>
  );
}
