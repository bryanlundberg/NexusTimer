import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";
import { cubeCollection } from "@/lib/cubeCollection";

export default function CategoryStatistics() {
  const { cubes } = useTimerStore();
  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="flex gap-3">
          <select className="bg-zinc-900 w-full border rounded-md p-1 border-zinc-800">
            {cubeCollection.map((cube) => (
              <option key={cube.name} value={cube.name}>
                {cube.name}
              </option>
            ))}
          </select>

          <select className="bg-zinc-900 w-full border rounded-md p-1 border-zinc-800">
            <option value="all">All</option>
            <option value="123ds">Weilong</option>
            <option value="wilon">Moulong</option>
            <option value="gan-55">Gan 355</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic label="Total Cubes Solved" total={933} />
          <CardStatistic label="Total Cubes" total={"41"} />
          <CardStatistic label="Most Used Cube" total={"Meilong"} />
          <CardStatistic label="Time Spent Cubing" total={"16h 12min"} />
          <CardStatistic label="Best Time" total={9.91} />
          <CardStatistic label="Best Ao5" total={13.75} />
          <CardStatistic label="Best Ao100" total={15.75} />
          <CardStatistic label="Best Ao1000" total={16.75} />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col justify-center items-center h-96 border rounded-md border-zinc-800 p-3 w-full">
            <div>Pending Line Chart</div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-md text-sm w-full">
          <div className="flex bg-zinc-700 p-1 rounded-md text-zinc-200 h-10 items-center">
            <div className="w-1/4"></div>
            <div className="w-1/4 text-center">All</div>
            <div className="w-1/4 text-center">Session</div>
            <div className="w-1/4 text-center">Cube</div>
          </div>
          <div className="flex rounded-md text-zinc-400 text-xs h-10 items-center">
            <div className="ps-3 w-1/4">Desviation</div>
            <div className="w-1/4 text-center">1.54</div>
            <div className="w-1/4 text-center">0.96</div>
            <div className="w-1/4 text-center">3.49</div>
          </div>
          <div className="flex rounded-md text-zinc-400 text-xs h-10 items-center">
            <div className="ps-3 w-1/4">Desviation</div>
            <div className="w-1/4 text-center">1.54</div>
            <div className="w-1/4 text-center">0.96</div>
            <div className="w-1/4 text-center">3.49</div>
          </div>
        </div>
      </div>
    </>
  );
}
