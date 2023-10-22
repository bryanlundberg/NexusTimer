import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import findCube from "@/lib/findCube";
import { formatDistanceToNow } from "date-fns";
import { sort } from "fast-sort";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";

export function ActivityList() {
  const { lang } = useSettingsModalStore();
  const { cubes } = useTimerStore();

  if (!cubes) return null;

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
        {index + 1}. {cube?.category} {cube?.name} {formatTime(solve.time)}{" "}
        {formatDistanceToNow(new Date(solve.endTime))} ago +{solve.rating}{" "}
        {translation.metrics.cards["rating-points"][lang].toLowerCase()}
      </div>
    );
  });
}
