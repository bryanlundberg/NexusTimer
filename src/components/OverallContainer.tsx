interface Container {
  children: React.ReactNode;
}
export function OverallContainer({ children }: Container) {
  return (
    <>
      <div className="flex flex-col w-full min-h-full mx-auto rounded-md grow xl:max-w-5xl xl:border light:border-neutral-200 dark:border-zinc-800 xl:mt-3 dark:bg-zinc-950 light:bg-neutral-50">
        {children}
      </div>
    </>
  );
}
