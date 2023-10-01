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
import Image from "next/image";
import fail from "@/images/no-data.png";
import Hashtag from "@/icons/Hashtag";
import PresentationChart from "@/icons/PresentationChart";
import Clock from "@/icons/Clock";
import ChartPie from "@/icons/ChartPie";
import CalendarDays from "@/icons/CalentarDays";
import Fire from "@/icons/Fire";
import Flag from "@/icons/Flag";
import Trophy from "@/icons/Trophy";

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
          <CardStatistic label="Cuber Classification" total={cuberTitle}>
            <Trophy />
          </CardStatistic>
          <CardStatistic label="Rating Points" total={totalFormatted}>
            <PresentationChart />
          </CardStatistic>
          <CardStatistic label="Time Spent Cubing" total={totalTimeCubing}>
            <Clock />
          </CardStatistic>
          <CardStatistic label="Total Solves" total={totalCubesSolved}>
            <Hashtag />
          </CardStatistic>
          <CardStatistic label="Most Played" total={mostPlayedEvent}>
            <ChartPie />
          </CardStatistic>
          <CardStatistic
            label="Sessions in progress"
            total={sessionsInProgress}
          >
            <CalendarDays />
          </CardStatistic>
          <CardStatistic
            label="Success Rate"
            total={"0.00%"}
            className="border-blue-400"
          >
            <Fire />{" "}
          </CardStatistic>
          <CardStatistic label="Total Events" total={totalEvents}>
            <Flag />
          </CardStatistic>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full sm:h-96 justify-center items-center">
            <Image src={fail} alt="no-data" />
            <div className="text-zinc-500">Pending Dounough Chart</div>
          </div>
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full sm:h-96 justify-center items-center">
            <Image src={fail} alt="no-data" />
            <div className="text-zinc-500">Pending Area Chart</div>
          </div>
        </div>
        <LastActivity />
      </div>
    </>
  );
}
