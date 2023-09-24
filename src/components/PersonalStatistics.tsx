import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";

export default function PersonalStatistics() {
  const { cubes } = useTimerStore();
  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic label="Cuber Classification" total={"Rookie"} />
          <CardStatistic label="Rating Points" total={0} />
          <CardStatistic label="Time Spent Cubing" total={"72h 45min"} />
          <CardStatistic label="Total Cubes Solved" total={1233} />
          <CardStatistic label="Sessions in progress" total={"3/12 [392]"} />
          <CardStatistic label="Total Events" total={"4"} />
          <CardStatistic label="Most Played" total={"3x3"} />
          <CardStatistic label="Success Rate" total={"98.8%"} />
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full sm:h-96 justify-center items-center">
            <div>Pending Dounough Chart</div>
          </div>
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full sm:h-96 justify-center items-center">
            <div>Pending Area Chart</div>
          </div>
        </div>
        <LastActivity />
      </div>
    </>
  );
}

function LastActivity() {
  return (
    <>
      <div className="border rounded-md border-zinc-800 p-3 w-full text-left sm:text-center">
        <div className="text-xl font-medium mb-3">Last activity</div>
        <div className="text-sm">
          1. 3x3 Weilong 9.59 9 hours ago +4 rating points
        </div>
      </div>
    </>
  );
}
