import ArrowRays from "@/icons/ArrowRays";
import CubeIcon from "@/icons/Cube";
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
        className="flex flex-col items-center justify-center gap-3 m-3 text-lg border border-dashed rounded-md grow border-zinc-600"
      >
        {icon === "no-cube-selected" ? <ArrowRays /> : <CubeIcon />}
        <div>{message}</div>
      </Link>
    </>
  );
}
