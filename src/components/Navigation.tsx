import Clock from "@/icons/Clock";
import Cubes from "@/icons/Cubes";
import Metrics from "@/icons/Metrics";
import Stack from "@/icons/Stack";
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
          <Clock />
          <div>{translation.timer["header"][lang]}</div>
        </NavItem>
        <NavItem pathname={pathname} url="/solves">
          <Stack />
          <div>{translation.solves["header"][lang]}</div>
        </NavItem>
        <NavItem pathname={pathname} url="/stats">
          <Metrics />
          <div>{translation.metrics["header"][lang]}</div>
        </NavItem>
        <NavItem pathname={pathname} url="/cubes">
          <Cubes />
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
