"use client";
import Select from "@/components/Select";

export default function StatsPage() {
  return (
    <div className="grow flex flex-col justify-between border border-zinc-800 rounded-md">
      <div className="border-b border-zinc-800 py-4 ">
        <div className="w-full md:w-10/12 mx-auto">
          <div className="flex justify-between items-center">
            <div className="font-medium text-2xl">Metrics</div>
            <Select />
          </div>
        </div>
      </div>
    </div>
  );
}
