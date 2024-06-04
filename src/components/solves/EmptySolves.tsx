import { CubeIcon, CursorArrowRaysIcon } from "@heroicons/react/24/solid";
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
        {icon === "no-cube-selected" ? (
          <CursorArrowRaysIcon className="w-6 h-6" />
        ) : (
          <CubeIcon className="w-6 h-6" />
        )}
        <div className="text-center">{message}</div>
      </Link>
    </>
  );
}
