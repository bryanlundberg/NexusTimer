import { useTimerStore } from "@/store/timerStore";
import { Solve } from "@/interfaces/Solve";
import { formatDistanceToNow } from "date-fns";
import { Cube } from "@/interfaces/Cube";
import { sort } from "fast-sort";
import findCube from "@/lib/findCube";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";

export default function LastActivity() {
  const { cubes } = useTimerStore();
  const { lang } = useSettingsModalStore();

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
            {index + 1}. {cube?.category} {cube?.name} {formatTime(solve.time)}{" "}
            {formatDistanceToNow(new Date(solve.endTime))} ago +{solve.rating}{" "}
            {translation.metrics.cards["rating-points"][lang].toLowerCase()}
          </div>
        );
      });
    }
    return null;
  };
  return (
    <>
      <div className="w-full p-3 text-left border rounded-md dark:border-zinc-800 light:border-neutral-200 sm:text-center">
        <div className="mb-3 text-xl font-medium">
          {translation.metrics["last-activity"][lang]}
        </div>
        {renderLastAct()}
      </div>
    </>
  );
}
