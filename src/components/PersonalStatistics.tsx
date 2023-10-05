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
import Hashtag from "@/icons/Hashtag";
import PresentationChart from "@/icons/PresentationChart";
import Clock from "@/icons/Clock";
import ChartPie from "@/icons/ChartPie";
import CalendarDays from "@/icons/CalentarDays";
import Fire from "@/icons/Fire";
import Flag from "@/icons/Flag";
import Trophy from "@/icons/Trophy";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import RadarCharter from "./charts/RadarCharter";
import PieCharter from "./charts/PieCharter";
import getCategoryTotalSolves from "@/lib/getCategoryTotalSolves";
import getCategoryTotalRatingPoints from "@/lib/getCategoryTotalRatingPoints";
import getSuccessRate from "@/lib/getSuccessRate";

export default function PersonalStatistics() {
  const { cubes } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const totalCubesSolved = getTotalCubesSolved(cubes);
  const totalEvents = getTotalEvents(cubes);
  const totalTimeCubing = getTotalTimeCubing(cubes);
  const mostPlayedEvent = getMostPlayedEvent(cubes);
  const { totalNumeric, totalFormatted } = getTotalRatingPoints(cubes);
  const sessionsInProgress = getSessionInProgress(cubes);
  const cuberTitle = getTitleByPoints(totalNumeric);
  const rate = getSuccessRate(cubes);
  const data01 = getCategoryTotalSolves(cubes);
  const data02 = getCategoryTotalRatingPoints(cubes);
  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic
            label={
              translation.metrics.cards["classification"][
                settings.locale[0].lang
              ]
            }
            total={cuberTitle}
          >
            <Trophy />
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["rating-points"][
                settings.locale[0].lang
              ]
            }
            total={totalFormatted}
          >
            <PresentationChart />
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["time-spent-cubing"][
                settings.locale[0].lang
              ]
            }
            total={totalTimeCubing}
          >
            <Clock />
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["total-solves"][settings.locale[0].lang]
            }
            total={totalCubesSolved}
          >
            <Hashtag />
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["most-played"][settings.locale[0].lang]
            }
            total={mostPlayedEvent}
          >
            <ChartPie />
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["sessions-in-progress"][
                settings.locale[0].lang
              ]
            }
            total={sessionsInProgress}
          >
            <CalendarDays />
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["success-rate"][settings.locale[0].lang]
            }
            total={rate + "%"}
            className="border-blue-400"
          >
            <Fire />{" "}
          </CardStatistic>
          <CardStatistic
            label={
              translation.metrics.cards["total-events"][settings.locale[0].lang]
            }
            total={totalEvents}
          >
            <Flag />
          </CardStatistic>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full lg:w-2/3 h-96 justify-center items-center">
            <RadarCharter data={data01} />
            <div className="font-medium mb-3 text-2xl text-center">
              {translation.metrics["cube-insights"][settings.locale[0].lang]}
            </div>
          </div>
          <div className="flex flex-col border rounded-md border-zinc-800 p-3 w-full lg:w-1/3 h-96 justify-center items-center">
            <PieCharter data={data02} />
            <div className="font-medium mb-3 text-2xl text-center">
              {translation.metrics["rating-spread"][settings.locale[0].lang]}
            </div>
          </div>
        </div>
        <LastActivity />
      </div>
    </>
  );
}
