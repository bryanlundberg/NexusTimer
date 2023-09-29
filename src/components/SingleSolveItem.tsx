import { Solve } from "@/interfaces/Solve";
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
        className="z-1 text-lg font-medium relative flex items-center justify-center p-1 rounded-md bg-neutral-300 hover:bg-neutral-400 cursor-pointer text-zinc-800 text-center w-auto h-14"
      >
        {(solve.time / 1000).toFixed(2)}
        <div className="absolute font-light top-1 left-1 text-xs z-20">
          11/08
        </div>
      </div>
    </>
  );
}
