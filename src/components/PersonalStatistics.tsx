import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";
import { Categories } from "@/interfaces/Categories";
import prettyMilliseconds from "pretty-ms";
import { cubeCollection } from "@/lib/cubeCollection";

export default function PersonalStatistics() {
  const { cubes } = useTimerStore();

  const totalCubesSolved = () => {
    if (!cubes) return 0;
    return cubes.reduce((acc, total) => acc + total.solves.all.length, 0);
  };

  const totalEvents = () => {
    if (!cubes) return 0;
    const currentCategories: Categories[] = [];
    for (const cube of cubes) {
      if (!currentCategories.includes(cube.category)) {
        currentCategories.push(cube.category);
      }
    }
    return currentCategories.length;
  };

  const totalTimeCubing = () => {
    if (!cubes) return 0;

    let total = 0;
    for (const cube of cubes) {
      total =
        total + cube.solves.all.reduce((acc, total) => acc + total.time, 0);
    }

    const result = prettyMilliseconds(total);
    return result;
  };

  const mostPlayedEvent = () => {
    if (!cubes) return "No solves";

    interface PlayedCubes {
      category: Categories;
      resolutions: number;
    }

    const played: PlayedCubes[] = [];

    for (const category of cubeCollection) {
      played.push({
        category: category.name,
        resolutions: 0,
      });
    }

    cubes.map((cube) => {
      played.forEach((element) => {
        if (element.category === cube.category) {
          element.resolutions += cube.solves.all.length;
        }
      });
    });
    console.log(played);
    return played[0].category;
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic label="Cuber Classification" total={"Rookie"} />
          <CardStatistic label="Rating Points" total={0} />
          <CardStatistic label="Time Spent Cubing" total={totalTimeCubing()} />
          <CardStatistic
            label="Total Cubes Solved"
            total={totalCubesSolved()}
          />
          <CardStatistic label="Sessions in progress" total={"3/12 [392]"} />
          <CardStatistic label="Total Events" total={totalEvents()} />
          <CardStatistic label="Most Played" total={mostPlayedEvent()} />
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
