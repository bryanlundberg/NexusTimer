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
  },
  {
    path: "/solves",
    icon: <StackIcon />,
  },
  {
    path: "/stats",
    icon: <BarChartIcon />,
  },
  {
    path: "/cubes",
    icon: <CubeIcon />,
  },
];

type Navigation = NavItem[];

interface NavItem {
  path: string;
  icon: React.ReactNode;
}

export default function Navbar() {
  return (
    <NavContainer>
      {navigation.map((item: NavItem) => {
        return <NavItem key={item.path} path={item.path} icon={item.icon} />;
      })}
    </NavContainer>
  );
}
