interface SolveFilters {
  children: React.ReactNode;
}

export function SolveFilters({ children }: SolveFilters) {
  return (
    <>
      <div className="z-10 flex flex-col justify-between gap-3 px-3 py-2 text-sm rounded-b-lg shadow-sm light:shadow-neutral-200 dark:shadow-zinc-800 md:flex-row">
        {children}
      </div>
    </>
  );
}
