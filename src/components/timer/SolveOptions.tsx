import { getCubeById } from "@/db/dbOperations";
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
    setSelectedCube,
    setSolvingTime,
    solvingTime,
  } = useTimerStore();
  const { lang } = useSettingsModalStore();

  async function handleDeleteSolve() {
    if (!selectedCube) return;
    await updateSolve({
      cubeId: selectedCube.id,
      solveId: solve.id,
      type: "DELETE",
    });
    const currentCube = await getCubeById(selectedCube.id);
    await setSelectedCube(currentCube);
    setSolvingTime(0);
    setLastSolve(null);
  }

  async function handlePlusTwo() {
    if (!selectedCube) return;
    await updateSolve({
      cubeId: selectedCube.id,
      solveId: solve.id,
      type: "+2",
    });
    const currentCube = await getCubeById(selectedCube.id);
    await setSelectedCube(currentCube);
    setSolvingTime(solvingTime + 2000);
    setLastSolve(null);
  }

  async function handleBookmark() {
    if (!selectedCube) return;
    await updateSolve({
      cubeId: selectedCube.id,
      solveId: solve.id,
      type: "BOOKMARK",
    });
    const currentCube = await getCubeById(selectedCube.id);
    await setSelectedCube(currentCube);
    setLastSolve(null);
  }

  async function handleComment(comment: string) {
    if (!selectedCube) return;
    await updateSolve({
      cubeId: selectedCube.id,
      solveId: solve.id,
      type: "COMMENT",
      comment: comment,
    });
    const currentCube = await getCubeById(selectedCube.id);
    await setSelectedCube(currentCube);
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
