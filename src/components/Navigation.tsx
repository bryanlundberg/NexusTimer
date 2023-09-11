import Clock from "@/icons/Clock";
import Cubes from "@/icons/Cubes";
import Metrics from "@/icons/Metrics";
import Stack from "@/icons/Stack";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul className="flex p-3 gap-5 justify-center bg-gray-300">
        <li>
          <Link href="/">
            <Clock />
          </Link>
        </li>
        <li>
          <Link href="/solves">
            <Stack />
          </Link>
        </li>
        <li>
          <Link href="/stats">
            <Metrics />
          </Link>
        </li>
        <li>
          <Link href="/cubes">
            <Cubes />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
