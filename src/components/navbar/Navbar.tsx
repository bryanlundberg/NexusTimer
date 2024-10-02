import { NavContainer } from "@/components/navbar/NavContainer";
import { NavItem } from "@/components/navbar/NavItem";
import {
  BarChartIcon,
  ClockIcon,
  CubeIcon,
  StackIcon,
} from "@radix-ui/react-icons";

const navigation: Navigation = [
  {
    path: "/",
    icon: <ClockIcon />,
    toolTipMessage: "Index.HomePage.title",
  },
  {
    path: "/solves",
    icon: <StackIcon />,
    toolTipMessage: "Index.SolvesPage.title",
  },
  {
    path: "/stats",
    icon: <BarChartIcon />,
    toolTipMessage: "Index.StatsPage.title",
  },
  {
    path: "/cubes",
    icon: <CubeIcon />,
    toolTipMessage: "Index.CubesPage.title",
  },
];

type Navigation = NavItem[];

interface NavItem {
  path: string;
  icon: React.ReactNode;
  toolTipMessage: string;
}

export default function Navbar() {
  return (
    <NavContainer>
      {navigation.map((item: NavItem) => {
        return <NavItem key={item.path} path={item.path} icon={item.icon} toolTipMessage={item.toolTipMessage} />;
      })}
    </NavContainer>
  );
}
