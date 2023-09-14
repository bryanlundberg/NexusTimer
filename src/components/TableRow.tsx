import { Cube } from "@/interfaces/Cube";
import BookmarkFav from "./BookmarkFav";
import Ellipsis from "@/icons/Ellipsis";

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
          {cubeData.solves.length}
        </div>
        <div className="table-cell align-middle text-center">{1.32}</div>
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
