import { Toggle } from "@/components/ui/toggle";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { DashboardIcon } from "@radix-ui/react-icons";

export default function ButtonDisplayType() {
  const { handleChangeTab, tab } = useSolveFiltersStore();
  return (
    <>
      <Toggle
        onPressedChange={() => {
          if (tab === "session") {
            handleChangeTab("all");
          } else if (tab === "all") {
            handleChangeTab("session");
          }
        }}
      >
        <DashboardIcon />
      </Toggle>
    </>
  );
}
