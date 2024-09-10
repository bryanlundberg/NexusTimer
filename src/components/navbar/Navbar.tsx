import { NavContainer } from "@/components/navbar/NavContainer";
import { NavItem } from "@/components/navbar/NavItem";

import {
  ChartBarIcon,
  ClockIcon,
  CubeIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";

const navigation: Navigation = [
  {
    path: "/",
    icon: <ClockIcon className="w-6 h-6" />,
  },
  {
    path: "/solves",
    icon: <Square3Stack3DIcon className="w-6 h-6" />,
  },
  {
    path: "/stats",
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
  {
    path: "/cubes",
    icon: <CubeIcon className="w-6 h-6" />,
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
