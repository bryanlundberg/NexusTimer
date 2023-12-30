import Clock from "@/icons/Clock";
import ClockSolid from "@/icons/ClockSolid";
import Cubes from "@/icons/Cubes";
import CubesSolid from "@/icons/CubesSolid";
import Metrics from "@/icons/Metrics";
import MetricsSolid from "@/icons/MetricsSolid";
import Stack from "@/icons/Stack";
import StackSolid from "@/icons/StackSolid";
import { NavContainer } from "@/components/navbar/NavContainer";
import { NavItem } from "@/components/navbar/NavItem";
import genId from "@/lib/genId";

const navigation: Navigation = [
  {
    path: "/",
    normalIcon: <Clock />,
    solidIcon: <ClockSolid />,
  },
  {
    path: "/solves",
    normalIcon: <Stack />,
    solidIcon: <StackSolid />,
  },
  {
    path: "/stats",
    normalIcon: <Metrics />,
    solidIcon: <MetricsSolid />,
  },
  {
    path: "/cubes",
    normalIcon: <Cubes />,
    solidIcon: <CubesSolid />,
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
            key={genId()}
            path={item.path}
            solidIcon={item.solidIcon}
            normalIcon={item.normalIcon}
          />
        );
      })}
    </NavContainer>
  );
}
