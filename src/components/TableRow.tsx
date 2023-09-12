import Checkbox from "./Checkbox";

export default function TableRow({
  cube,
  category,
  best,
  ao3,
  ao5,
  ao12,
  ao50,
  ao100,
  ao1000,
}: {
  cube: string;
  category: string;
  best: number;
  ao3: number;
  ao5: number;
  ao12: number;
  ao50: number;
  ao100: number;
  ao1000: number;
}) {
  return (
    <>
      <div className="table-row ">
        <div className="table-cell w-10 align-middle">
          <Checkbox />
        </div>
        <div className="table-cell align-middle text-left">{cube}</div>
        <div className="table-cell align-middle text-center">{category}</div>
        <div className="table-cell align-middle text-center">{best}</div>
        <div className="table-cell align-middle text-center">{ao3}</div>
        <div className="table-cell align-middle text-center">{ao5}</div>
        <div className="table-cell align-middle text-center">{ao12}</div>
        <div className="table-cell align-middle text-center">{ao50}</div>
        <div className="table-cell align-middle text-center">{ao100}</div>
        <div className="table-cell align-middle text-center">{ao1000}</div>
      </div>
    </>
  );
}
