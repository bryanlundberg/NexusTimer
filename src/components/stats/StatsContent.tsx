import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";
import PersonalStatistics from "./PersonalStatistics";
import CategoryStatistics from "../CategoryStatistics";

interface StatsContentProps {
  selectedValue: string;
}

export function StatsContent({ selectedValue }: StatsContentProps) {
  const { lang } = useSettingsModalStore();
  return (
    <>
      {selectedValue ===
      translation.metrics["header-select"]["personal"][lang] ? (
        <PersonalStatistics />
      ) : (
        <CategoryStatistics />
      )}
    </>
  );
}
