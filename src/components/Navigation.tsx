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
          <Link href="/">
            <Clock />
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-800">
          <Link href="/solves">
            <Stack />
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-800">
          <Link href="/stats">
            <Metrics />
          </Link>
        </li>
        <li className="p-4 hover:bg-gray-800">
          <Link href="/cubes">
            <Cubes />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
