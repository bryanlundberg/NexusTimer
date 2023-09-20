import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "./BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";
import { sort } from "fast-sort";
import updateCube from "@/lib/updateCube";
import { useTimerStore } from "@/store/timerStore";

export default function TableRow({ cube }: { cube: Cube }) {
  const { setCubes } = useTimerStore();

  const setFavorite = (cubeId: string) => {
    const updatedCube = updateCube({ cubeId });
    setCubes(updatedCube);
  };

  // const bestTime = sort(cube.solves.all).asc((u) => u.time);
  // const bestTimeCube = (bestTime[0].time / 1000).toFixed(2);

  return (
    <>
      <div className="table-row h-10 hover:bg-zinc-900">
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
          {cube.solves.all.length}
        </div>
        <div className="align-middle text-center hidden md:table-cell">
          {cube.createdAt}
        </div>
        <div className="align-middle text-center hidden md:table-cell">
          Used
        </div>
        <div className="table-cell align-middle text-center">
          <button className="hover:bg-zinc-800 p-1 px-4 rounded-md">
            <Ellipsis />
          </button>
        </div>
      </div>
    </>
  );
}
