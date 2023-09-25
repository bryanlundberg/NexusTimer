import { useTimerStore } from "@/store/timerStore";
import CardStatistic from "./CardStatistic";
import { Categories } from "@/interfaces/Categories";
import prettyMilliseconds from "pretty-ms";
import { cubeCollection } from "@/lib/cubeCollection";
import { sort } from "fast-sort";
import { Solve } from "@/interfaces/Solve";
import { Cube } from "@/interfaces/Cube";
import findCube from "@/lib/findCube";
import { formatDistanceToNow } from "date-fns";

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

    const sorted = sort(played).desc((u) => u.resolutions);
    return sorted[0].resolutions === 0 ? "0 Solves" : sorted[0].category;
  };

  const totalRatingPoints = () => {
    if (!cubes) return 0;

    let totalRating = 0;
    for (const cube of cubes) {
      cube.solves.all.forEach((cube) => {
        totalRating += cube.rating;
      });
      cube.solves.session.forEach((cube) => {
        totalRating += cube.rating;
      });
    }

    return totalRating;
  };

  const sessionsInProgress = () => {
    if (!cubes) return 0;
    let inProgress = {
      sessions: 0,
      solves: 0,
    };

    for (const cube of cubes) {
      if (cube.solves.session.length > 0) {
        inProgress.sessions++;
        inProgress.solves += cube.solves.session.length;
      }
    }

    return `${inProgress.sessions}/${cubes.length} [${inProgress.solves}]`;
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStatistic
            label="Cuber Classification"
            total={"Rookie"}
            className="border-blue-400"
          />
          <CardStatistic label="Rating Points" total={totalRatingPoints()} />
          <CardStatistic label="Time Spent Cubing" total={totalTimeCubing()} />
          <CardStatistic label="Total Solves" total={totalCubesSolved()} />
          <CardStatistic label="Most Played" total={mostPlayedEvent()} />
          <CardStatistic
            label="Sessions in progress"
            total={sessionsInProgress()}
          />
          <CardStatistic
            label="Success Rate"
            total={"98.8%"}
            className="border-blue-400"
          />
          <CardStatistic label="Total Events" total={totalEvents()} />
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
  const { cubes } = useTimerStore();

  const renderLastAct = () => {
    if (cubes) {
      const lastAct: Solve[] = [];
      cubes.forEach((cube: Cube) => {
        cube.solves.all.forEach((i) => {
          lastAct.push(i);
        });
        cube.solves.session.forEach((i) => {
          lastAct.push(i);
        });
      });

      const sorted = sort(lastAct).desc((u) => u.endTime);

      return sorted.slice(0, 10).map((solve, index) => {
        const cube = findCube({ cubeId: solve.cubeId });
        return (
          <div className="text-sm" key={solve.id}>
            {index + 1}. {cube?.category} {cube?.name}{" "}
            {(solve.time / 1000).toFixed(3)}{" "}
            {formatDistanceToNow(new Date(solve.endTime))} ago +{solve.rating}{" "}
            rating points
          </div>
        );
      });
    }
    return null;
  };
  return (
    <>
      <div className="border rounded-md border-zinc-800 p-3 w-full text-left sm:text-center">
        <div className="text-xl font-medium mb-3">Last activity</div>
        {renderLastAct()}
      </div>
    </>
  );
}
