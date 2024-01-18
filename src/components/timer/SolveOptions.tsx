import ChatBubble from "@/icons/ChatBubble";
import Flag from "@/icons/Flag";
import NoSymbol from "@/icons/NoSymbol";
import { Solve } from "@/interfaces/Solve";
import updateSolve from "@/lib/updateSolve";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";

export default function SolveOptions({ solve }: { solve: Solve }) {
  const {
    setLastSolve,
    selectedCube,
    setSolvingTime,
    solvingTime,
    mergeUpdateSelectedCube,
    cubes,
  } = useTimerStore();
  const { lang } = useSettingsModalStore();

  async function handleDeleteSolve() {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "DELETE",
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setSolvingTime(0);
    setLastSolve(null);
  }

  async function handlePlusTwo() {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "+2",
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setSolvingTime(solvingTime + 2000);
    setLastSolve(null);
  }

  async function handleBookmark() {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "BOOKMARK",
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setLastSolve(null);
  }

  async function handleComment(comment: string) {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "COMMENT",
      comment: comment,
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
  }

  const classButton =
    "flex items-center justify-center w-12 h-8 p-1 font-normal transition duration-200 bg-transparent border border-transparent rounded-md dark:text-neutral-300 light:text-neutral-500 light:hover:text-neutral-900 dark:hover:text-neutral-100";

  if (!selectedCube) return null;
  return (
    <>
      <div
        className="flex items-center justify-center gap-3 p-3 mt-3"
        id="quick-action-buttons"
      >
        <button
          type="button"
          className={classButton}
          onClick={handleDeleteSolve}
          onTouchStart={handleDeleteSolve}
        >
          <NoSymbol />
        </button>
        <button
          type="button"
          className={classButton}
          onClick={handlePlusTwo}
          onTouchStart={handlePlusTwo}
        >
          +2
        </button>

        <button
          type="button"
          className={classButton}
          onClick={handleBookmark}
          onTouchStart={handleBookmark}
        >
          <Flag />
        </button>

        <button
          type="button"
          className={classButton}
          onClick={() => {
            const comment = window.prompt(
              `${translation.solves["enter-a-comment"][lang]}`
            );
            if (comment) {
              handleComment(comment);
            }
          }}
          onTouchStart={() => {
            const comment = window.prompt(
              `${translation.solves["enter-a-comment"][lang]}`
            );
            if (comment) {
              handleComment(comment);
            }
          }}
        >
          <div className="w-4 h-4">
            <ChatBubble />
          </div>
        </button>
      </div>
    </>
  );
}
