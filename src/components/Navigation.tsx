import Clock from "@/icons/Clock";
import Cubes from "@/icons/Cubes";
import Metrics from "@/icons/Metrics";
import Stack from "@/icons/Stack";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul className="flex p-3 gap-5 justify-center">
        <li className="p-4 hover:bg-gray-800">
          <Link
            href="/"
            className="flex flex-col justify-center items-center font-medium"
          >
            <Clock />
            <div>Timer</div>
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-800">
          <Link
            href="/solves"
            className="flex flex-col justify-center items-center font-medium"
          >
            <Stack />
            <div>Historial</div>
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-800">
          <Link
            href="/stats"
            className="flex flex-col justify-center items-center font-medium"
          >
            <Metrics />
            <div>Statistics</div>
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-800">
          <Link
            href="/cubes"
            className="flex flex-col justify-center items-center font-medium"
          >
            <Cubes />
            <div>Cubes</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
