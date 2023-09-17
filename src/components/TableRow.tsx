import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "./BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";
import { sort } from "fast-sort";

export default function TableRow({
  cubeData,
  handleNewFavCube,
}: {
  cubeData: Cube;
  handleNewFavCube: any;
}) {
  const handleChange = (cubeId: string) => {
    handleNewFavCube(cubeId);
  };

  // const bestTime = sort(cubeData.solves.all).asc((u) => u.time);
  // const bestTimeCube = (bestTime[0].time / 1000).toFixed(2);

  return (
    <>
      <div className="table-row h-10 hover:bg-zinc-900">
        <div className="table-cell w-10 align-middle">
          <BookmarkFav
            cubeId={cubeData.id}
            isChecked={cubeData.favorite}
            handleChange={handleChange}
          />
        </div>
        <div className="table-cell align-middle text-left">{cubeData.name}</div>
        <div className="table-cell align-middle text-center">
          {cubeData.category}
        </div>
        <div className="table-cell align-middle text-center">
          {cubeData.solves.all.length}
        </div>
        <div className="table-cell align-middle text-center">{32543}</div>
        <div className="table-cell align-middle text-center">
          {cubeData.createdAt}
        </div>
        <div className="table-cell align-middle text-center">Used</div>
        <div className="table-cell align-middle text-center">
          <button className="hover:bg-zinc-800 p-1 px-4 rounded-md">
            <Ellipsis />
          </button>
        </div>
      </div>
    </>
  );
}
