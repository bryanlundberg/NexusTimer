import { Solve } from "@/interfaces/Solve";
import formatDate from "@/lib/formatDate";
import { useSolvesStore } from "@/store/SolvesStore";

export default function SingleSolveItem({ solve }: { solve: Solve }) {
  const { setStatus, setSolve } = useSolvesStore();
  return (
    <>
      <div
        onClick={() => {
          setSolve(solve);
          setStatus();
        }}
        className="relative flex items-center justify-center w-auto p-1 text-lg font-medium text-center rounded-md cursor-pointer z-1 bg-neutral-300 hover:bg-neutral-400 text-zinc-800 h-14"
      >
        {(solve.time / 1000).toFixed(2)}
        {solve.plus2 ? <span className="text-sm text-red-600">+2</span> : null}
        <div className="absolute z-20 text-xs top-1 left-1">
          {formatDate(solve.endTime).slice(0, 5)}
        </div>
      </div>
    </>
  );
}
