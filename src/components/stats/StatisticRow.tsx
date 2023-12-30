interface StatisticRow {
  label: string;
  global: number | string;
  session: number | string;
  cubeAll: number | string;
  cubeSession: number | string;
}

export function StatisticRow({
  label,
  global,
  session,
  cubeAll,
  cubeSession,
}: StatisticRow) {
  return (
    <div className="flex items-center h-10 text-xs rounded-md dark:text-zinc-400 light:text-neutral-950 light:bg-neutral-100">
      <div className="w-1/5 ps-3">{label}</div>
      <div className="w-1/5 text-center">{global}</div>
      <div className="w-1/5 text-center">{session}</div>
      <div className="w-1/5 text-center">{cubeAll}</div>
      <div className="w-1/5 text-center">{cubeSession}</div>
    </div>
  );
}
