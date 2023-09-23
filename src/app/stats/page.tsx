"use client";

import PersonalStatistics from "@/components/PersonalStatistics";
import { useTimerStore } from "@/store/timerStore";

export default function StatsPage() {
  const { cubes } = useTimerStore();
  return (
    <div className="grow w-full md:max-w-6xl mx-auto flex flex-col border border-zinc-800 rounded-md overflow-auto">
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
      <PersonalStatistics />
    </div>
  );
}
