import ArrowRays from "@/icons/ArrowRays";
import CubeIcon from "@/icons/Cube";
import Squares from "@/icons/Squares";
import Link from "next/link";
type Icon = "no-cube-selected" | "no-solves";
export default function EmptySolves({
  message,
  icon,
}: {
  message: string;
  icon: Icon;
}) {
  return (
    <>
      <Link
        href="/"
        className="m-3 grow gap-3 text-lg justify-center items-center border rounded-md border-zinc-600 border-dashed flex flex-col"
      >
        {icon === "no-cube-selected" ? <ArrowRays /> : <CubeIcon />}
        <div>{message}</div>
      </Link>
    </>
  );
}
