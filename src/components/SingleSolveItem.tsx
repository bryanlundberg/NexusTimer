import { Solve } from "@/interfaces/Solve";

export default function SingleSolveItem({ solve }: { solve: Solve }) {
  return (
    <>
      <div className="text-lg font-medium relative flex items-center justify-center p-1 rounded-md bg-zinc-700 text-center w-28 h-12">
        9.12
        <div className="absolute font-light top-1 left-1 text-xs">11/08</div>
      </div>
    </>
  );
}
