interface OverallHeader {
  children: React.ReactNode;
  title: string;
}

export function OverallHeader({ children, title }: OverallHeader) {
  return (
    <>
      <div className="py-4 border-b light:border-neutral-200 dark:border-zinc-800 ">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between gap-2 mx-3">
            <div className="text-2xl font-medium">{title}</div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
