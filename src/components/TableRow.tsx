import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "./BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";
import updateCube from "@/lib/updateCube";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import Play from "@/icons/Play";
import Stop from "@/icons/Stop";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function TableRow({ cube }: { cube: Cube }) {
  const { settings } = useSettingsModalStore();
  const { setCubes } = useTimerStore();
  const { setEditingCube, setModalOpen, setCubeName, setSelectedCategory } =
    useCubesModalStore();
  const setFavorite = (cubeId: string) => {
    const updatedCube = updateCube({ cubeId });
    setCubes(updatedCube);
  };

  function formatDate(msDate: number) {
    const creationDate = new Date(cube.createdAt);
    const month = creationDate.getMonth() + 1;
    const day = creationDate.getDate();
    const year = creationDate.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  const status = cube.solves.session.length > 0;

  return (
    <>
      <div className="table-row h-10 hover:bg-zinc-800 bg-zinc-950">
        <div className="table-cell w-10 align-middle">
          <BookmarkFav
            cubeId={cube.id}
            isChecked={cube.favorite}
            setFavorite={setFavorite}
          />
        </div>
        <div className="table-cell text-left align-middle">{cube.name}</div>
        <div className="table-cell text-center align-middle">
          {cube.category}
        </div>
        <div className="table-cell text-center align-middle">
          {`${cube.solves.session.length}/${cube.solves.all.length}`}
        </div>
        <div className="hidden text-center align-middle md:table-cell">
          {formatDate(cube.createdAt)}
        </div>
        <div className="hidden text-center align-middle md:table-cell">
          {status ? (
            <div className="flex items-center justify-center gap-1">
              <Play />
              <span>
                {translation.cubes.table["using"][settings.locale[0].lang]}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Stop />
              <span>
                {translation.cubes.table["idle"][settings.locale[0].lang]}
              </span>
            </div>
          )}
        </div>
        <div className="table-cell text-center align-middle">
          <button
            className="p-1 px-2 text-white rounded-md hover:bg-zinc-800 sm:px-2"
            onClick={() => {
              setEditingCube(cube);
              setCubeName(cube.name);
              setSelectedCategory(cube.category);
              setModalOpen(true);
            }}
          >
            <Ellipsis />
          </button>
        </div>
      </div>
    </>
  );
}
