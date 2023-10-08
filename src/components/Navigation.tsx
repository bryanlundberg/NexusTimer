import Clock from "@/icons/Clock";
import Cubes from "@/icons/Cubes";
import Metrics from "@/icons/Metrics";
import Stack from "@/icons/Stack";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import Link from "next/link";
import translation from "@/translations/global.json";

export default function Navigation() {
  const { settings } = useSettingsModalStore();
  return (
    <nav>
      <ul className="flex justify-center gap-5 ">
        <NavItem url="/">
          <Clock />
          <div>{translation.timer["header"][settings.locale[0].lang]}</div>
        </NavItem>
        <NavItem url="/solves">
          <Stack />
          <div>{translation.solves["header"][settings.locale[0].lang]}</div>
        </NavItem>
        <NavItem url="/stats">
          <Metrics />
          <div>{translation.metrics["header"][settings.locale[0].lang]}</div>
        </NavItem>
        <NavItem url="/cubes">
          <Cubes />
          <div>{translation.cubes["header"][settings.locale[0].lang]}</div>
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
