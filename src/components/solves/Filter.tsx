import { useSettingsModalStore } from "@/store/SettingsModalStore";
import ToggleSolvesButton from "@/components/solves/ToggleSolvesButton";
import translation from "@/translations/global.json";
import { SolveTab } from "@/interfaces/types/SolveTabs";

interface Filter {
  currentTab: SolveTab;
  handleClick: (clickedTab: SolveTab) => void;
}

export function Filter({ currentTab, handleClick }: Filter) {
  const { lang } = useSettingsModalStore();
  return (
    <>
      <div className="flex w-full gap-1 p-1 font-medium rounded-md h-9 light:bg-neutral-200 light:text-neutral-700 dark:bg-zinc-800 md:w-56 xl:w-96">
        <ToggleSolvesButton
          handleClick={() => handleClick("Session")}
          active={currentTab === "Session"}
          label={translation.solves.filter["session"][lang]}
        />
        <ToggleSolvesButton
          handleClick={() => handleClick("All")}
          active={currentTab === "All"}
          label={translation.solves.filter["all"][lang]}
        />
      </div>
    </>
  );
}
