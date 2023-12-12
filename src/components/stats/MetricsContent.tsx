import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";
import PersonalStatistics from "@/components/stats/PersonalStatistics";
import CategoryStatistics from "@/components/stats/CategoryStatistics";

interface MetricsContent {
  selectedValue: string;
}

export function MetricsContent({ selectedValue }: MetricsContent) {
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
