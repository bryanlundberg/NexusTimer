interface PersonalChartsContainer {
  children: React.ReactNode;
}

export function PersonalChartsContainer({ children }: PersonalChartsContainer) {
  return (
    <>
      <div className="w-full h-full p-3 border rounded-md light:border-neutral-200 dark:border-zinc-800 dark:bg-zinc-950 light:bg-neutral-100">
        {children}
      </div>
    </>
  );
}
