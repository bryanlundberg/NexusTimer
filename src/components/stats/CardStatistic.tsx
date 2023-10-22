interface CardStatistic {
  label: string;
  total: number | string;
  className?: string;
  icon: React.ReactNode;
}

export default function CardStatistic({
  label,
  total,
  className,
  icon,
}: CardStatistic) {
  return (
    <>
      <div
        className={`border dark:border-zinc-800 light:border-neutral-200 rounded-lg flex justify-between items-center p-3 dark:bg-zinc-900 light:bg-neutral-100 ${className}`}
      >
        <div className="grow">
          <div className="text-3xl font-medium">{total}</div>
          <div className="mt-3 text-md">{label}</div>
        </div>
        {icon}
      </div>
    </>
  );
}
