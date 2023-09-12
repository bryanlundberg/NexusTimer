export default function SolveOptions() {
  return (
    <>
      {/* Options at the end of the solve */}
      <div className="flex gap-3">
        <button type="button" className="border-2 border-slate-500">
          Delete
        </button>
        <button type="button" className="border-2 border-slate-500">
          +2
        </button>
        <button type="button" className="border-2 border-slate-500">
          Mark
        </button>
        <button type="button" className="border-2 border-slate-500">
          Comment
        </button>
      </div>
    </>
  );
}
