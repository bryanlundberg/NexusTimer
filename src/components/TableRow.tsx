import { Cube } from "@/interfaces/Cube";
import Checkbox from "./Checkbox";

export default function TableRow({ cubeData }: { cubeData: Cube }) {
  // const bestTime = cubeData.solves.

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
        <div className="table-cell align-middle text-center">{3}</div>
        <div className="table-cell align-middle text-center">{3}</div>
        <div className="table-cell align-middle text-center">{3}</div>
        <div className="table-cell align-middle text-center">{3}</div>
        <div className="table-cell align-middle text-center">{3}</div>
        <div className="table-cell align-middle text-center">{3}</div>
        <div className="table-cell align-middle text-center">{3}</div>
      </div>
    </>
  );
}
