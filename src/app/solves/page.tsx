import SingleSolveItem from "@/components/SingleSolveItem";

export default function SolvesPage() {
  return (
    <>
      <div className="w-full md:w-10/12 mx-auto mt-10">
        <div className="flex justify-between text-sm">
          {/* Options Show session/ History/bookmark */}
          <div className="font-medium rounded-md p-1 flex h-8 bg-zinc-800 gap-1">
            <button
              type="button"
              className="px-8 appearance-none rounded-md bg-zinc-950 "
            >
              Session
            </button>
            <button
              type="button"
              className="px-8 appearance-none rounded-md bg-zinc-800"
            >
              All time
            </button>
            <button
              type="button"
              className="px-8 appearance-none rounded-md bg-zinc-800"
            >
              Bookmark
            </button>
          </div>

          <div className="flex gap-2 h-8">
            <button className="px-4 appearance-none rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 font-medium">
              Import
            </button>
            <button className="px-4 appearance-none rounded-md bg-neutral-200 hover:bg-neutral-300 text-zinc-800 font-medium">
              + Add Solve
            </button>
          </div>
        </div>

        <div className="mt-8"></div>
        <div className="w-full gap-3 flex flex-wrap justify-center">
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
          <SingleSolveItem />
        </div>
      </div>
    </>
  );
}
