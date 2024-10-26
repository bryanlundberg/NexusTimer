import Logo from "@/components/logo/logo";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import DialogNavbarItem from "./dialog-navbar-item";
import { usePathname } from "next/navigation";

type Navigation = NavItem[];

interface NavItem {
  path: string;
  name: string;
  image: string;
}

export default function DialogNavbar() {
  const t = useTranslations("Index");
  const pathname = usePathname();
  const navigation: Navigation = [
    {
      path: "/",
      image: "/menu/play.webp",
      name: t("HomePage.title"),
    },
    {
      path: "/solves",
      image: "/menu/clock.webp",

      name: t("SolvesPage.title"),
    },
    {
      path: "/stats",
      image: "/menu/blue.webp",
      name: t("StatsPage.title"),
    },
    {
      path: "/cubes",
      image: "/menu/collection.webp",
      name: t("CubesPage.title"),
    },
  ];
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Logo />
          </DialogTitle>
          <DialogDescription>
            Explore your solves, track progress, and improve your speedcubing
            skills with quick access to stats, timers, and tutorials.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {navigation.map((item) => {
            return (
              <DialogNavbarItem
                href={item.path}
                label={item.name}
                key={item.path}
                image={item.image}
              />
            );
          })}
        </div>

        <DialogNavbarItem
          href={"/settings"}
          label={"Settings"}
          key={"item.path"}
          image={"/menu/rain.webp"}
        />
      </DialogContent>
    </>
  );
}
