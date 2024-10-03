import { NavContainer } from "@/components/navbar/NavContainer";
import { NavItem } from "@/components/navbar/NavItem";
import {
  BarChartIcon,
  ClockIcon,
  CubeIcon,
  StackIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type Navigation = NavItem[];

interface NavItem {
  path: string;
  icon: React.ReactNode;
  toolTipMessage: string;
}

export default function Navbar() {

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
    <NavContainer>
      {navigation.map((item: NavItem) => {
        return <NavItem key={item.path} path={item.path} icon={item.icon} toolTipMessage={item.toolTipMessage} />;
      })}
    </NavContainer>
  );
}
