"use client";
export default function StatsPage() {
  return (
    <div className="grow w-full md:max-w-6xl mx-auto flex flex-col gap-3 border border-zinc-800 rounded-md">
      <div className="border-b border-zinc-800 py-4 ">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mx-3">
            <div className="font-medium text-2xl">Metrics</div>
            <select name="metrics" id="select-metrics" className="bg-zinc-950">
              <option value="personal">Personal</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex">
        <div id="chart" className="bg-gray-500 grow"></div>
        <div className="w-96 bg-zinc-100"></div>
      </div>
    </div>
  );
}
