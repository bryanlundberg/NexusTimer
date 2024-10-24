import Logo from "@/components/logo/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/routing";
import {
  BarChartIcon,
  ClockIcon,
  CubeIcon,
  StackIcon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type Navigation = NavItem[];

interface NavItem {
  path: string;
  icon: React.ReactNode;
  toolTipMessage: string;
}

export default function SheetNavbar() {
  const pathname = usePathname();
  const t = useTranslations("Index");
  const navigation: Navigation = [
    {
      path: "/",
      icon: <ClockIcon />,
      toolTipMessage: t("HomePage.title"),
    },
    {
      path: "/solves",
      icon: <StackIcon />,
      toolTipMessage: t("SolvesPage.title"),
    },
    {
      path: "/stats",
      icon: <BarChartIcon />,
      toolTipMessage: t("StatsPage.title"),
    },
    {
      path: "/cubes",
      icon: <CubeIcon />,
      toolTipMessage: t("CubesPage.title"),
    },
  ];

  return (
    <>
      <SheetContent side={"left"}>
        <SheetHeader className="mb-10">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription>
            Explore your solves, track progress, and improve your speedcubing
            skills with quick access to stats, timers, and tutorials.
          </SheetDescription>
        </SheetHeader>

        {navigation.map((item) => {
          return (
            <>
              <Link
                key={item.path}
                href={item.path}
                className="w-full flex items-center group/selection pb-2 mb-1 transition duration-500 gap-1"
              >
                <TriangleRightIcon
                  className={` group-hover/selection:visible size-4 ${
                    pathname === item.path ? "visible" : "invisible"
                  }`}
                />
                <div className="grow text-2xl">{item.toolTipMessage}</div>
              </Link>
            </>
          );
        })}
      </SheetContent>
    </>
  );
}
