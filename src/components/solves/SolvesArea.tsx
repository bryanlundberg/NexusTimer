import SingleSolveItem from "@/components/solves/SingleSolveItem";
import { useTimerStore } from "@/store/timerStore";
import EmptySolves from "@/components/solves/EmptySolves";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";

interface SolvesArea {
  displaySolves: Solve[] | null;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const { selectedCube } = useTimerStore();
  const { lang } = useSettingsModalStore();

  if (!selectedCube) {
    return (
      <EmptySolves
        message={translation.solves["no-cube-selection"][lang]}
        icon="no-cube-selected"
      />
    );
  }

  if (!displaySolves || displaySolves.length === 0) {
    return (
      <EmptySolves
        message={translation.solves["no-solves"][lang]}
        icon="no-solves"
      />
    );
  }

  return (
    <>
      <div className="grid w-full h-full grid-cols-3 gap-3 px-3 py-3 overflow-auto sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
        {displaySolves.map((solve: Solve) => (
          <SingleSolveItem key={genId()} solve={solve} />
        ))}
      </div>
    </>
  );
}
