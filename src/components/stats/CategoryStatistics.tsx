import calcAverageStatistics from "@/lib/calcAverageStatistics";
import calcTimeSpentStatistics from "@/lib/calcTimeSpentStatistics";
import calcTotalSolvesStatistics from "@/lib/calcTotalSolvesStatistics";
import calcAoStatistics from "@/lib/calcAoStatistics";
import calcDeviation from "@/lib/calcDeviation";
import calcBestTime from "@/lib/calcBestTime";
import { Select } from "@/components/select/index";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import LineCharter from "../charts/LineCharter";
import getSolvesMetrics from "@/lib/getSolvesMetrics";
import calcSuccessRate from "@/lib/calcSuccessRate";
import formatTime from "@/lib/formatTime";
import useMetricsSwitch from "@/hooks/useMetricsSwitch";
import { StatisticRow } from "@/components/stats/StatisticRow";
import { CustomTableContainer } from "@/components/stats/CustomTableContainer";
import { StatisticHeader } from "@/components/stats/StatisticsHeader";

export default function CategoryStatistics() {
  const { lang } = useSettingsModalStore();
  const {
    filterCategory,
    filterCube,
    handleChangeCategory,
    handleChangeCube,
    categoryOptions,
    cubeOptions,
    optInChart,
    setOptInChart,
  } = useMetricsSwitch();

  const average = calcAverageStatistics(filterCategory, filterCube);
  const timeSpent = calcTimeSpentStatistics(filterCategory, filterCube);
  const counter = calcTotalSolvesStatistics(filterCategory, filterCube);
  const stats = calcAoStatistics(filterCategory, filterCube);
  const deviation = calcDeviation(filterCategory, filterCube);
  const successRate = calcSuccessRate(filterCategory, filterCube);
  const best = calcBestTime(filterCategory, filterCube);
  const data = getSolvesMetrics(filterCategory, filterCube);

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 overflow-auto grow">
        <div className="flex gap-3">
          <Select
            defaultLabel={filterCategory}
            list={categoryOptions}
            onChange={(e) => handleChangeCategory(e)}
            className={"w-full"}
          />
          <Select
            defaultLabel={filterCube}
            list={cubeOptions}
            onChange={(e) => handleChangeCube(e)}
            className={"w-full"}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-col w-full p-3 border rounded-md light:bg-neutral-100 dark:bg-zinc-950 h-96 light:border-neutral-200 dark:border-zinc-800">
            <LineCharter
              data={data}
              optInChart={optInChart}
              cubeSelected={
                translation.solves.filter["all"][lang] !== filterCube
              }
            />
            <div className="flex gap-5">
              <label htmlFor="mean-average" className="hover:cursor-pointer">
                <input
                  type="checkbox"
                  id="mean-average"
                  checked={optInChart.mean}
                  onChange={() =>
                    setOptInChart({
                      mean: !optInChart.mean,
                      best: optInChart.best,
                    })
                  }
                />{" "}
                {translation.metrics["average"][lang]}
              </label>
              <label htmlFor="best-time" className="hover:cursor-pointer">
                <input
                  type="checkbox"
                  id="best-time"
                  checked={optInChart.best}
                  onChange={() =>
                    setOptInChart({
                      mean: optInChart.mean,
                      best: !optInChart.best,
                    })
                  }
                />{" "}
                {translation.metrics["best-time"][lang]}
              </label>
            </div>
          </div>
        </div>

        <CustomTableContainer>
          <StatisticHeader />
          <StatisticRow
            label={translation.timer["deviation"][lang]}
            global={
              deviation.global === 0 ? "--" : formatTime(deviation.global)
            }
            session={
              deviation.session === 0 ? "--" : formatTime(deviation.session)
            }
            cubeAll={
              deviation.cubeAll === 0 ? "--" : formatTime(deviation.cubeAll)
            }
            cubeSession={
              deviation.cubeSession === 0
                ? "--"
                : formatTime(deviation.cubeSession)
            }
          />
          <StatisticRow
            label="Ao5"
            global={
              stats.global.ao5 === 0 ? "--" : formatTime(stats.global.ao5)
            }
            session={
              stats.session.ao5 === 0 ? "--" : formatTime(stats.session.ao5)
            }
            cubeAll={
              stats.cubeAll.ao5 === 0 ? "--" : formatTime(stats.cubeAll.ao5)
            }
            cubeSession={
              stats.cubeSession.ao5 === 0
                ? "--"
                : formatTime(stats.cubeSession.ao5)
            }
          />
          <StatisticRow
            label="Ao12"
            global={
              stats.global.ao12 === 0 ? "--" : formatTime(stats.global.ao12)
            }
            session={
              stats.session.ao12 === 0 ? "--" : formatTime(stats.session.ao12)
            }
            cubeAll={
              stats.cubeAll.ao12 === 0 ? "--" : formatTime(stats.cubeAll.ao12)
            }
            cubeSession={
              stats.cubeSession.ao12 === 0
                ? "--"
                : formatTime(stats.cubeSession.ao12)
            }
          />
          <StatisticRow
            label="Ao50"
            global={
              stats.global.ao50 === 0 ? "--" : formatTime(stats.global.ao50)
            }
            session={
              stats.session.ao50 === 0 ? "--" : formatTime(stats.session.ao50)
            }
            cubeAll={
              stats.cubeAll.ao50 === 0 ? "--" : formatTime(stats.cubeAll.ao50)
            }
            cubeSession={
              stats.cubeSession.ao50 === 0
                ? "--"
                : formatTime(stats.cubeSession.ao50)
            }
          />
          <StatisticRow
            label="Ao100"
            global={
              stats.global.ao100 === 0 ? "--" : formatTime(stats.global.ao100)
            }
            session={
              stats.session.ao100 === 0 ? "--" : formatTime(stats.session.ao100)
            }
            cubeAll={
              stats.cubeAll.ao100 === 0 ? "--" : formatTime(stats.cubeAll.ao100)
            }
            cubeSession={
              stats.cubeSession.ao100 === 0
                ? "--"
                : formatTime(stats.cubeSession.ao100)
            }
          />
          <StatisticRow
            label="Ao1000"
            global={
              stats.global.ao1000 === 0 ? "--" : formatTime(stats.global.ao1000)
            }
            session={
              stats.session.ao1000 === 0
                ? "--"
                : formatTime(stats.session.ao1000)
            }
            cubeAll={
              stats.cubeAll.ao1000 === 0
                ? "--"
                : formatTime(stats.cubeAll.ao1000)
            }
            cubeSession={
              stats.cubeSession.ao1000 === 0
                ? "--"
                : formatTime(stats.cubeSession.ao1000)
            }
          />
          <StatisticRow
            label={translation.metrics["best-time"][lang]}
            global={best.global > 0 ? formatTime(best.global) : "--"}
            session={best.session > 0 ? formatTime(best.session) : "--"}
            cubeAll={best.cubeAll > 0 ? formatTime(best.cubeAll) : "--"}
            cubeSession={
              best.cubeSession > 0 ? formatTime(best.cubeSession) : "--"
            }
          />
          <StatisticRow
            label={translation.metrics["average"][lang]}
            global={average.global === 0 ? "--" : formatTime(average.global)}
            session={average.session === 0 ? "--" : formatTime(average.session)}
            cubeAll={average.cubeAll === 0 ? "--" : formatTime(average.cubeAll)}
            cubeSession={
              average.cubeSession === 0 ? "--" : formatTime(average.cubeSession)
            }
          />
          <StatisticRow
            label={translation.metrics["time-spent"][lang]}
            global={timeSpent.global}
            session={timeSpent.session}
            cubeAll={timeSpent.cubeAll}
            cubeSession={timeSpent.cubeSession}
          />
          <StatisticRow
            label={translation.metrics.cards["success-rate"][lang]}
            global={successRate.global === 0 ? "--" : successRate.global + "%"}
            session={
              successRate.session === 0 ? "--" : successRate.session + "%"
            }
            cubeAll={
              successRate.cubeAll === 0 ? "--" : successRate.cubeAll + "%"
            }
            cubeSession={
              successRate.cubeSession === 0
                ? "--"
                : successRate.cubeSession + "%"
            }
          />
          <StatisticRow
            label={translation.timer["counter"][lang]}
            global={counter.global === 0 ? "--" : counter.global}
            session={counter.session === 0 ? "--" : counter.session}
            cubeAll={counter.cubeAll === 0 ? "--" : counter.cubeAll}
            cubeSession={counter.cubeSession === 0 ? "--" : counter.cubeSession}
          />
        </CustomTableContainer>
      </div>
    </>
  );
}
