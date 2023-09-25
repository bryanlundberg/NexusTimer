import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";
import getTotalCubesSolved from "@/lib/getTotalCubesSolved";
import getTotalEvents from "@/lib/getTotalEvents";
import getTotalTimeCubing from "@/lib/getTotalTimeCubing";
import getMostPlayedEvent from "@/lib/getMostPlayedEvent";
import getTotalRatingPoints from "@/lib/getTotalRatingPoints";
import getSessionInProgress from "@/lib/getSessionInProgress";
import LastActivity from "./LastActivity";
import getTitleByPoints from "@/lib/getTitleByPoints";

export default function PersonalStatistics() {
  const { cubes } = useTimerStore();
  const totalCubesSolved = getTotalCubesSolved(cubes);
  const totalEvents = getTotalEvents(cubes);
  const totalTimeCubing = getTotalTimeCubing(cubes);
  const mostPlayedEvent = getMostPlayedEvent(cubes);
  const { totalNumeric, totalFormatted } = getTotalRatingPoints(cubes);
  const sessionsInProgress = getSessionInProgress(cubes);
  const cuberTitle = getTitleByPoints(totalNumeric);

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic label="Cuber Classification" total={cuberTitle} />
          <CardStatistic label="Rating Points" total={totalFormatted} />
          <CardStatistic label="Time Spent Cubing" total={totalTimeCubing} />
          <CardStatistic label="Total Solves" total={totalCubesSolved} />
          <CardStatistic label="Most Played" total={mostPlayedEvent} />
          <CardStatistic
            label="Sessions in progress"
            total={sessionsInProgress}
          />
          <CardStatistic
            label="Success Rate"
            total={"0.00%"}
            className="border-blue-400"
          />
          <CardStatistic label="Total Events" total={totalEvents} />
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
