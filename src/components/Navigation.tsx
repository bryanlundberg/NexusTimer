import Clock from "@/icons/Clock";
import Cubes from "@/icons/Cubes";
import Metrics from "@/icons/Metrics";
import Stack from "@/icons/Stack";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul className="flex gap-5 justify-center ">
        <NavItem url="/">
          <Clock />
          <div>Timer</div>
        </NavItem>
        <NavItem url="/solves">
          <Stack />
          <div>Solves</div>
        </NavItem>
        <NavItem url="/stats">
          <Metrics />
          <div>Metrics</div>
        </NavItem>
        <NavItem url="/cubes">
          <Cubes />
          <div>Cubes</div>
        </NavItem>
      </ul>
    </nav>
  );
}

function NavItem({
  children,
  url,
}: {
  children: React.ReactNode;
  url: string;
}) {
  return (
    <>
      <li>
        <Link
          href={url}
          className="min-w-[70px] py-2 rounded-md hover:bg-zinc-800 flex flex-col justify-center items-center font-medium"
        >
          {children}
        </Link>
      </li>
    </>
  );
}
