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
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col justify-center items-center h-96 border rounded-md border-zinc-800 p-3 w-full">
            <div>Pending Line Chart</div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-md text-sm w-full">
          <div className="flex bg-zinc-900 p-1 rounded-md text-zinc-200 h-10 items-center">
            <div className="w-1/4"></div>
            <div className="w-1/4 text-center">All</div>
            <div className="w-1/4 text-center">Session</div>
            <div className="w-1/4 text-center">Cube</div>
          </div>
          <StatisticRow
            label="Desviation"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Ao5"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Ao12"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Ao50"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Ao100"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Ao1000"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Best Time"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Mean"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Time Spent"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
          <StatisticRow
            label="Counter"
            valueAll={1.96}
            valueCube={1.55}
            valueSession={0.93}
          />
        </div>
      </div>
    </>
  );
}

function StatisticRow({
  label,
  valueAll,
  valueSession,
  valueCube,
}: {
  label: string;
  valueAll: number | string;
  valueSession: number | string;
  valueCube: number | string;
}) {
  return (
    <div className="flex rounded-md text-zinc-400 text-xs h-10 items-center hover:bg-zinc-700">
      <div className="ps-3 w-1/4">{label}</div>
      <div className="w-1/4 text-center">{valueAll}</div>
      <div className="w-1/4 text-center">{valueSession}</div>
      <div className="w-1/4 text-center">{valueCube}</div>
    </div>
  );
}
