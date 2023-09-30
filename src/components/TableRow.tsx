import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "./BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";
import updateCube from "@/lib/updateCube";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";

export default function TableRow({ cube }: { cube: Cube }) {
  const { setCubes } = useTimerStore();
  const { setEditingCube, setModalOpen } = useCubesModalStore();
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
        <div className="table-cell align-middle text-left">{cube.name}</div>
        <div className="table-cell align-middle text-center">
          {cube.category}
        </div>
        <div className="table-cell align-middle text-center">
          {`${cube.solves.session.length}/${cube.solves.all.length}`}
        </div>
        <div className="align-middle text-center hidden md:table-cell">
          {formatDate(cube.createdAt)}
        </div>
        <div className="align-middle text-center hidden md:table-cell">
          Used
        </div>
        <div className="table-cell align-middle text-center">
          <button
            className="hover:bg-zinc-800 p-1 px-2 sm:px-2 rounded-md"
            onClick={() => {
              setEditingCube(cube);
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
