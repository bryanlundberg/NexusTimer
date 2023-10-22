interface Container {
  children: React.ReactNode;
}
export function OverallContainer({ children }: Container) {
  return (
    <>
      <div className="flex flex-col w-full min-h-full mx-auto mt-3 rounded-md grow md:max-w-6xl xl:border light:border-neutral-200 dark:border-zinc-800">
        {children}
      </div>
    </>
  );
}
