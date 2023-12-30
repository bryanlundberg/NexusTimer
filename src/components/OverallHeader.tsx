interface OverallHeader {
  children?: React.ReactNode;
  title: string;
}

export function OverallHeader({ children, title }: OverallHeader) {
  return (
    <>
      <div className="py-3 border-b light:border-neutral-200 light:bg-neutral-100 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between gap-5 mx-3">
            <div className="hidden text-2xl font-medium align-middle sm:inline">
              {title}
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
