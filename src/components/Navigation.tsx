import Clock from "@/icons/Clock";
import ClockSolid from "@/icons/ClockSolid";
import Cubes from "@/icons/Cubes";
import CubesSolid from "@/icons/CubesSolid";
import Metrics from "@/icons/Metrics";
import MetricsSolid from "@/icons/MetricsSolid";
import Stack from "@/icons/Stack";
import StackSolid from "@/icons/StackSolid";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Link from "next/link";
import translation from "@/translations/global.json";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { lang } = useSettingsModalStore();
  const pathname = usePathname();
  return (
    <nav>
      <ul className="flex justify-center gap-5 ">
        <NavItem pathname={pathname} url="/">
          {pathname === "/" ? <ClockSolid /> : <Clock />}
          <div>{translation.timer["header"][lang]}</div>
        </NavItem>
        <NavItem pathname={pathname} url="/solves">
          {pathname === "/solves" ? <StackSolid /> : <Stack />}
          <div>{translation.solves["header"][lang]}</div>
        </NavItem>
        <NavItem pathname={pathname} url="/stats">
          {pathname === "/stats" ? <MetricsSolid /> : <Metrics />}
          <div>{translation.metrics["header"][lang]}</div>
        </NavItem>
        <NavItem pathname={pathname} url="/cubes">
          {pathname === "/cubes" ? <CubesSolid /> : <Cubes />}
          <div>{translation.cubes["header"][lang]}</div>
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
      <li>
        <Link
          href={url}
          className={`${
            pathname === url ? "text-neutral-100" : "text-neutral-400"
          } min-w-[70px] py-2 rounded-md hover:bg-zinc-800 flex flex-col justify-center items-center font-medium`}
        >
          {children}
        </Link>
      </li>
    </>
  );
}
