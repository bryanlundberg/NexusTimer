import { useTimerStore } from "@/store/timerStore";
import { cubeCollection } from "@/lib/cubeCollection";
import { useState } from "react";
import { Categories } from "@/interfaces/Categories";
import calcAverageStatistics from "@/lib/calcAverageStatistics";
import calcTimeSpentStatistics from "@/lib/calcTimeSpentStatistics";
import calcTotalSolvesStatistics from "@/lib/calcTotalSolvesStatistics";
import calcAoStatistics from "@/lib/calcAoStatistics";
import calcDeviation from "@/lib/calcDeviation";
import calcBestTime from "@/lib/calcBestTime";
import SelectMetrics from "./SelectMetrics";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import LineCharter from "./charts/LineCharter";
import getSolvesMetrics from "@/lib/getSolvesMetrics";

export default function CategoryStatistics() {
  const { cubes } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const [filterCategory, setFilterCategory] = useState<Categories>("3x3");
  const [filterCube, setFilterCube] = useState<string>(
    translation.solves.filter["all"][settings.locale[0].lang]
  );

  const handleChangeCategory = (value: any) => {
    setFilterCategory(value);
    setFilterCube(translation.solves.filter["all"][settings.locale[0].lang]);
  };

  const handleChangeCube = (value: any) => {
    setFilterCube(value);
  };

  const categoyOptions = loadCategoryOptions();
  const cubeOptions = loadCubeOptions();
  function loadCategoryOptions(): Categories[] {
    const categoryOptions: Categories[] = [];
    cubeCollection.map((cat) => {
      categoryOptions.push(cat.name);
    });
    return categoryOptions;
  }

  function loadCubeOptions() {
    const cubesList = [
      translation.solves.filter["all"][settings.locale[0].lang],
    ];
    cubes?.map((cube) => {
      if (cube.category === filterCategory) {
        cubesList.push(cube.name);
      }
    });
    return cubesList;
  }

  const average = calcAverageStatistics(filterCategory, filterCube);
  const timeSpent = calcTimeSpentStatistics(filterCategory, filterCube);
  const counter = calcTotalSolvesStatistics(filterCategory, filterCube);
  const stats = calcAoStatistics(filterCategory, filterCube);
  const deviation = calcDeviation(filterCategory, filterCube);
  const best = calcBestTime(filterCategory, filterCube);
  const data = getSolvesMetrics(filterCategory, filterCube);
  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="flex gap-3">
          <SelectMetrics
            label={filterCategory}
            options={categoyOptions}
            handleChange={handleChangeCategory}
            extraClass="w-full"
          />
          <SelectMetrics
            label={filterCube}
            options={cubeOptions}
            handleChange={handleChangeCube}
            extraClass="w-full"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col justify-center items-center h-96 border rounded-md border-zinc-800 p-3 w-full">
            <LineCharter
              data={data}
              cubeSelected={
                translation.solves.filter["all"][settings.locale[0].lang] !==
                filterCube
              }
            />
          </div>
        </div>

        <div className="bg-zinc-800 rounded-md text-sm w-full">
          <div className="flex bg-zinc-900 p-1 rounded-md text-zinc-200 h-10 items-center">
            <div className="w-1/5"></div>
            <div className="w-1/5 text-center">
              {translation.metrics["global"][settings.locale[0].lang]}
            </div>
            <div className="w-1/5 text-center">
              {translation.metrics["sessions"][settings.locale[0].lang]}
            </div>
            <div className="w-1/5 text-center">
              C {translation.solves.filter["all"][settings.locale[0].lang]}
            </div>
            <div className="w-1/5 text-center">
              C {translation.solves.filter["session"][settings.locale[0].lang]}
            </div>
          </div>
          <StatisticRow
            label={translation.timer["deviation"][settings.locale[0].lang]}
            global={deviation.global === 0 ? "--" : deviation.global.toFixed(3)}
            session={
              deviation.session === 0 ? "--" : deviation.session.toFixed(3)
            }
            cubeAll={
              deviation.cubeAll === 0 ? "--" : deviation.cubeAll.toFixed(3)
            }
            cubeSession={
              deviation.cubeSession === 0
                ? "--"
                : deviation.cubeSession.toFixed(3)
            }
          />
          <StatisticRow
            label="Ao5"
            global={stats.global.ao5 === 0 ? "--" : stats.global.ao5.toFixed(3)}
            session={
              stats.session.ao5 === 0 ? "--" : stats.session.ao5.toFixed(3)
            }
            cubeAll={
              stats.cubeAll.ao5 === 0 ? "--" : stats.cubeAll.ao5.toFixed(3)
            }
            cubeSession={
              stats.cubeSession.ao5 === 0
                ? "--"
                : stats.cubeSession.ao5.toFixed(3)
            }
          />
          <StatisticRow
            label="Ao12"
            global={
              stats.global.ao12 === 0 ? "--" : stats.global.ao12.toFixed(3)
            }
            session={
              stats.session.ao12 === 0 ? "--" : stats.session.ao12.toFixed(3)
            }
            cubeAll={
              stats.cubeAll.ao12 === 0 ? "--" : stats.cubeAll.ao12.toFixed(3)
            }
            cubeSession={
              stats.cubeSession.ao12 === 0
                ? "--"
                : stats.cubeSession.ao12.toFixed(3)
            }
          />
          <StatisticRow
            label="Ao50"
            global={
              stats.global.ao50 === 0 ? "--" : stats.global.ao50.toFixed(3)
            }
            session={
              stats.session.ao50 === 0 ? "--" : stats.session.ao50.toFixed(3)
            }
            cubeAll={
              stats.cubeAll.ao50 === 0 ? "--" : stats.cubeAll.ao50.toFixed(3)
            }
            cubeSession={
              stats.cubeSession.ao50 === 0
                ? "--"
                : stats.cubeSession.ao50.toFixed(3)
            }
          />
          <StatisticRow
            label="Ao100"
            global={
              stats.global.ao100 === 0 ? "--" : stats.global.ao100.toFixed(3)
            }
            session={
              stats.session.ao100 === 0 ? "--" : stats.session.ao100.toFixed(3)
            }
            cubeAll={
              stats.cubeAll.ao100 === 0 ? "--" : stats.cubeAll.ao100.toFixed(3)
            }
            cubeSession={
              stats.cubeSession.ao100 === 0
                ? "--"
                : stats.cubeSession.ao100.toFixed(3)
            }
          />
          <StatisticRow
            label="Ao1000"
            global={
              stats.global.ao1000 === 0 ? "--" : stats.global.ao1000.toFixed(3)
            }
            session={
              stats.session.ao1000 === 0
                ? "--"
                : stats.session.ao1000.toFixed(3)
            }
            cubeAll={
              stats.cubeAll.ao1000 === 0
                ? "--"
                : stats.cubeAll.ao1000.toFixed(3)
            }
            cubeSession={
              stats.cubeSession.ao1000 === 0
                ? "--"
                : stats.cubeSession.ao1000.toFixed(3)
            }
          />
          <StatisticRow
            label={translation.metrics["best-time"][settings.locale[0].lang]}
            global={best.global}
            session={best.session}
            cubeAll={best.cubeAll}
            cubeSession={best.cubeSession}
          />
          <StatisticRow
            label={translation.metrics["average"][settings.locale[0].lang]}
            global={average.global === 0 ? "--" : average.global.toFixed(3)}
            session={average.session === 0 ? "--" : average.session.toFixed(3)}
            cubeAll={average.cubeAll === 0 ? "--" : average.cubeAll.toFixed(3)}
            cubeSession={
              average.cubeSession === 0 ? "--" : average.cubeSession.toFixed(3)
            }
          />
          <StatisticRow
            label={translation.metrics["time-spent"][settings.locale[0].lang]}
            global={timeSpent.global}
            session={timeSpent.session}
            cubeAll={timeSpent.cubeAll}
            cubeSession={timeSpent.cubeSession}
          />
          <StatisticRow
            label={translation.timer["counter"][settings.locale[0].lang]}
            global={counter.global === 0 ? "--" : counter.global}
            session={counter.session === 0 ? "--" : counter.session}
            cubeAll={counter.cubeAll === 0 ? "--" : counter.cubeAll}
            cubeSession={counter.cubeSession === 0 ? "--" : counter.cubeSession}
          />
        </div>
      </div>
    </>
  );
}

function StatisticRow({
  label,
  global,
  session,
  cubeAll,
  cubeSession,
}: {
  label: string;
  global: number | string;
  session: number | string;
  cubeAll: number | string;
  cubeSession: number | string;
}) {
  return (
    <div className="flex rounded-md text-zinc-400 text-xs h-10 items-center hover:bg-zinc-700">
      <div className="ps-3 w-1/5">{label}</div>
      <div className="w-1/5 text-center">{global}</div>
      <div className="w-1/5 text-center">{session}</div>
      <div className="w-1/5 text-center">{cubeAll}</div>
      <div className="w-1/5 text-center">{cubeSession}</div>
    </div>
  );
}
