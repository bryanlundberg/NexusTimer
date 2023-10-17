import Clock from "@/icons/Clock";
import ClockSolid from "@/icons/ClockSolid";
import Cubes from "@/icons/Cubes";
import CubesSolid from "@/icons/CubesSolid";
import Metrics from "@/icons/Metrics";
import MetricsSolid from "@/icons/MetricsSolid";
import Stack from "@/icons/Stack";
import StackSolid from "@/icons/StackSolid";
import { Themes } from "@/interfaces/types/Themes";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

const variation: Record<Themes, string> = {
  light: "shadow-black bg-neutral-100 shadow-sm shadow-black",
  dark: "bg-zinc-900",
};

export default function Navigation() {
  const pathname = usePathname();
  const { settings } = useSettingsModalStore();
  return (
    <nav>
      <ul
        className={`flex justify-between items-center w-full gap-5 h-12 rounded-t-xl sm:mx-auto sm:w-96 ${
          variation[settings.theme.background.color]
        }`}
      >
        <NavItem pathname={pathname} url="/">
          {pathname === "/" ? <ClockSolid /> : <Clock />}
        </NavItem>
        <NavItem pathname={pathname} url="/solves">
          {pathname === "/solves" ? <StackSolid /> : <Stack />}
        </NavItem>
        <NavItem pathname={pathname} url="/stats">
          {pathname === "/stats" ? <MetricsSolid /> : <Metrics />}
        </NavItem>
        <NavItem pathname={pathname} url="/cubes">
          {pathname === "/cubes" ? <CubesSolid /> : <Cubes />}
        </NavItem>
      </ul>
    </nav>
  );
}

function NavItem({
  children,
  url,
  pathname,
}: {
  children: React.ReactNode;
  url: string;
  pathname: string;
}) {
  return (
    <>
      <li className="grow">
        <Link
          href={url}
          className={`${
            pathname === url
              ? "light:text-neutral-900 dark:text-neutral-200"
              : "light:text-neutral-500 dark:text-neutral-400"
          } transition-all duration-300 py-2 rounded-md hover:dark:text-neutral-300 light:hover:text-neutral-900 flex flex-col justify-center items-center font-medium`}
        >
          {children}
        </Link>
      </li>
    </>
  );
}
