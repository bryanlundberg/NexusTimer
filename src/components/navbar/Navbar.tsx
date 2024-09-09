import { NavContainer } from "@/components/navbar/NavContainer";
import { NavItem } from "@/components/navbar/NavItem";
import {
  ClockIcon as ClockIconO,
  CubeIcon as CubeIconO,
  ChartBarIcon as ChartBarIconO,
  Square3Stack3DIcon as Square3Stack3DIconO,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  ClockIcon,
  CubeIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";

const navigation: Navigation = [
  {
    path: "/",
    normalIcon: <ClockIconO className="w-6 h-6" />,
    solidIcon: <ClockIcon className="w-6 h-6" />,
  },
  {
    path: "/solves",
    normalIcon: <Square3Stack3DIconO className="w-6 h-6" />,
    solidIcon: <Square3Stack3DIcon className="w-6 h-6" />,
  },
  {
    path: "/stats",
    normalIcon: <ChartBarIconO className="w-6 h-6" />,
    solidIcon: <ChartBarIcon className="w-6 h-6" />,
  },
  {
    path: "/cubes-experimental",
    normalIcon: <CubeIconO className="w-6 h-6" />,
    solidIcon: <CubeIcon className="w-6 h-6" />,
  },
];

type Navigation = NavItem[];

interface NavItem {
  path: string;
  normalIcon: React.ReactNode;
  solidIcon: React.ReactNode;
}

export default function Navbar() {
  return (
    <NavContainer>
      {navigation.map((item: NavItem) => {
        return (
          <NavItem
            key={item.path}
            path={item.path}
            solidIcon={item.solidIcon}
            normalIcon={item.normalIcon}
          />
        );
      })}
    </NavContainer>
  );
}
