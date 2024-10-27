import Logo from "@/components/logo/logo";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import DialogNavbarItem from "./dialog-navbar-item";
import ButtonGoogle from "@/components/buttons/button-google/button-google";

type Navigation = NavItem[];

interface NavItem {
  path: string;
  name: string;
}

export default function DialogNavbar() {
  const t = useTranslations("Index");
  const navigation: Navigation = [
    {
      path: "/",
      name: t("HomePage.title"),
    },
    {
      path: "/solves",

      name: t("SolvesPage.title"),
    },
    {
      path: "/stats",
      name: t("StatsPage.title"),
    },
    {
      path: "/cubes",
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

        <div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {navigation.map((item) => {
              return (
                <DialogNavbarItem
                  href={item.path}
                  label={item.name}
                  key={item.path}
                />
              );
            })}
          </div>

          <div className="flex gap-2 my-2">
            <DialogNavbarItem
              href={"/account"}
              label={"Account"}
              key={"item.acccount"}
            />
            <DialogNavbarItem
              href={"/settings"}
              label={"Settings"}
              key={"item.settings"}
            />
          </div>

          <ButtonGoogle />
        </div>
      </DialogContent>
    </>
  );
}
