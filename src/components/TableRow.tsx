import { Cube } from "@/interfaces/Cube";
import Checkbox from "./Checkbox";
import Ellipsis from "@/icons/Ellipsis";

export default function TableRow({ cubeData }: { cubeData: Cube }) {
  return (
    <>
      <div className="table-row h-10 hover:bg-zinc-900">
        <div className="table-cell w-10 align-middle">
          <Checkbox />
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
