import { Solve } from "@/interfaces/Solve";

export default function SingleSolveItem({ solve }: { solve: Solve }) {
  return (
    <>
      <div className="text-lg font-medium relative flex items-center justify-center p-1 rounded-md bg-neutral-300 hover:bg-neutral-400 cursor-pointer text-zinc-800 text-center w-auto h-14">
        {(solve.time / 1000).toFixed(2)}
        <div className="absolute font-light top-1 left-1 text-xs">11/08</div>
      </div>
    </>
  );
}
