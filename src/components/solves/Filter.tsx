import ToggleSolvesButton from "@/components/solves/ToggleSolvesButton";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import { useTranslations } from "next-intl";

interface Filter {
  currentTab: SolveTab;
  handleClick: (clickedTab: SolveTab) => void;
}

export function Filter({ currentTab, handleClick }: Filter) {
  const t = useTranslations("Index.SolvesPage");
  return (
    <>
      <div className="flex w-auto gap-1 p-1 font-medium rounded-md h-9 light:bg-neutral-200 light:text-neutral-700 dark:bg-zinc-800">
        <ToggleSolvesButton
          handleClick={() => handleClick("Session")}
          active={currentTab === "Session"}
          label={t("session")}
        />
        <ToggleSolvesButton
          handleClick={() => handleClick("All")}
          active={currentTab === "All"}
          label={t("all")}
        />
      </div>
    </>
  );
}
