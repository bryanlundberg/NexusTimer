import Clock from "@/icons/Clock";
import Cubes from "@/icons/Cubes";
import Metrics from "@/icons/Metrics";
import Stack from "@/icons/Stack";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="">
      <ul className="flex gap-5 justify-center">
        <li className="flex items-center">
          <Link
            href="/"
            className="min-w-[70px] p-1 rounded-md hover:bg-zinc-800 flex flex-col justify-center items-center font-medium"
          >
            <div className="w-10 h-10">
              <Clock />
            </div>
            <div>Timer</div>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            href="/solves"
            className="min-w-[70px] p-1 rounded-md hover:bg-zinc-800 flex flex-col justify-center items-center font-medium"
          >
            <div className="w-10 h-10">
              <Stack />
            </div>
            <div>Solves</div>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            href="/stats"
            className="min-w-[70px] p-1 rounded-md hover:bg-zinc-800 flex flex-col justify-center items-center font-medium"
          >
            <div className="w-10 h-10">
              <Metrics />
            </div>
            <div>Statistics</div>
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            href="/cubes"
            className="min-w-[70px] p-1 rounded-md hover:bg-zinc-800 flex flex-col justify-center items-center font-medium"
          >
            <div className="w-10 h-10">
              <Cubes />
            </div>
            <div>Cubes</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
